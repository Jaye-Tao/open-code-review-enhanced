// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package diff

import (
	"context"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/alibaba/open-code-review/internal/gitcmd"
	"github.com/alibaba/open-code-review/internal/model"
)

// Attributor queries only the immutable snapshots used by the review. The
// cache is per run and bounded by the number of findings, including retries.
type Attributor struct {
	repo      string
	input     InputResolution
	runner    *gitcmd.Runner
	mu        sync.Mutex
	cache     map[string]model.CodeAttribution
	workspace bool
}

// MarkWorkspace makes all successful line matches uncommitted. A workspace
// review has a HEAD for context, but its changed lines are not in that commit.
func (a *Attributor) MarkWorkspace() { a.workspace = true }

func NewAttributor(repo string, input InputResolution, runner *gitcmd.Runner) *Attributor {
	if runner == nil {
		runner = gitcmd.New(0)
	}
	return &Attributor{repo: repo, input: input, runner: runner, cache: make(map[string]model.CodeAttribution)}
}

// Attribute validates the located excerpt before looking up its authors.
// Missing evidence never falls back to the branch tip author or local user.
func (a *Attributor) Attribute(ctx context.Context, cm model.LlmComment, d *model.Diff) *model.CodeAttribution {
	result := model.CodeAttribution{Status: "unavailable", Reason: "unresolved_location"}
	if d == nil || cm.StartLine < 1 || cm.EndLine < cm.StartLine || cm.ExistingCode == "" {
		return &result
	}
	target := splitAndNormalize(cm.ExistingCode)
	if len(target) == 0 {
		return &result
	}
	newLines := strings.Split(d.NewFileContent, "\n")
	if !d.IsDeleted && cm.EndLine <= len(newLines) && slices.Equal(target, splitAndNormalize(strings.Join(newLines[cm.StartLine-1:cm.EndLine], "\n"))) {
		result.Ref, result.Path, result.Side = a.input.ResolvedHead, d.NewPath, "new"
	} else {
		for _, hunk := range ParseHunks(d.Diff) {
			var excerpt []string
			for _, line := range extractSideLines(&hunk, false) {
				if line.lineNum >= cm.StartLine && line.lineNum <= cm.EndLine && line.content != "" {
					excerpt = append(excerpt, line.content)
				}
			}
			if slices.Equal(target, excerpt) {
				result.Ref, result.Path, result.Side = a.input.ResolvedBase, d.OldPath, "old"
				break
			}
		}
	}
	if result.Side == "" {
		return &result
	}
	if a.workspace || a.input.ResolvedHead == "" {
		result.Status, result.Reason = "uncommitted", "workspace_review"
		return &result
	}
	if result.Ref == "" || result.Path == "" || result.Path == "/dev/null" {
		result.Reason = "missing_revision"
		return &result
	}
	key := fmt.Sprintf("%s:%s:%s:%d:%d", result.Ref, result.Side, result.Path, cm.StartLine, cm.EndLine)
	a.mu.Lock()
	cached, ok := a.cache[key]
	a.mu.Unlock()
	if ok {
		return &cached
	}
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	out, err := a.runner.Output(ctx, a.repo, "rev-parse", "--is-shallow-repository")
	if err != nil || strings.TrimSpace(string(out)) != "false" {
		result.Reason = "incomplete_history"
		return &result
	}
	out, err = a.runner.Output(ctx, a.repo, "--no-pager", "blame", "--line-porcelain", "-L", fmt.Sprintf("%d,%d", cm.StartLine, cm.EndLine), result.Ref, "--", result.Path)
	if err != nil {
		result.Reason = "git_lookup_failed"
		return &result
	}
	authors, ok := parseBlame(string(out), cm.StartLine, cm.EndLine)
	if !ok {
		result.Reason = "invalid_blame_output"
		return &result
	}
	result.Status, result.Reason, result.Authors = "confirmed", "", authors
	a.mu.Lock()
	a.cache[key] = result
	a.mu.Unlock()
	return &result
}

func parseBlame(output string, start, end int) ([]model.CodeAuthor, bool) {
	var authors []model.CodeAuthor
	var current model.CodeAuthor
	next := start
	for _, line := range strings.Split(output, "\n") {
		switch {
		case strings.HasPrefix(line, "author "):
			current.Name = strings.TrimPrefix(line, "author ")
		case strings.HasPrefix(line, "author-mail "):
			current.Email = strings.TrimSuffix(strings.TrimPrefix(line, "author-mail <"), ">")
		case strings.HasPrefix(line, "\t"):
			if current.StartLine != next || next > end || current.Name == "" || current.Email == "" || strings.Trim(current.Commit, "0") == "" {
				return nil, false
			}
			if n := len(authors); n > 0 && authors[n-1].Commit == current.Commit && authors[n-1].Name == current.Name && authors[n-1].Email == current.Email {
				authors[n-1].EndLine = next
			} else {
				authors = append(authors, current)
			}
			next++
			current = model.CodeAuthor{}
		default:
			fields := strings.Fields(line)
			if len(fields) < 3 || (len(fields[0]) != 40 && len(fields[0]) != 64) {
				continue
			}
			n, err := strconv.Atoi(fields[2])
			if err != nil {
				return nil, false
			}
			current = model.CodeAuthor{Commit: fields[0], StartLine: n, EndLine: n}
		}
	}
	return authors, next == end+1 && len(authors) > 0
}
