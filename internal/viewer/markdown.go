// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import (
	"bytes"
	"fmt"
	"io"
	"strings"
)

// markdownBlock preserves arbitrary source, including nested Markdown fences.
func markdownBlock(s string) string {
	fence := "```"
	for strings.Contains(s, fence) {
		fence += "`"
	}
	return fence + "\n" + s + "\n" + fence + "\n\n"
}

// ExportSessionMarkdown exports all persisted findings, independent of UI filters
// and browser-local marks. It does not export private LLM conversation payloads.
func ExportSessionMarkdown(out io.Writer, root, repo, id string) error {
	vs, err := LoadSession(root, repo, id)
	if err != nil {
		return err
	}
	s := vs.Summary
	var b bytes.Buffer
	b.WriteString("# Code Review Report\n\n## Session\n\n")
	b.WriteString(markdownBlock(fmt.Sprintf("Session: %s\nRepository: %s\nBranch: %s\nMode: %s\nModel: %s\nStarted: %s\nStatus: %s\nAborted: %t\nLegacy: %t\nDuration: %s\nDiff: %s -> %s\nCommit: %s", s.SessionID, s.CWD, s.GitBranch, s.ReviewMode, s.Model, s.Timestamp.Format("2006-01-02T15:04:05Z07:00"), s.TerminalState, s.Aborted, s.Legacy, formatDuration(s.DurationSec), s.DiffFrom, s.DiffTo, s.DiffCommit)))
	fmt.Fprintf(&b, "## Summary\n\n- Findings: %d\n- Files: %d\n- Coverage: %d selected, %d completed, %d reused, %d failed, %d waived\n- Tokens: %d prompt, %d completion\n\n", len(vs.Comments), s.FileCount, s.SelectedCount, s.CompletedCount, s.ReusedCount, s.FailedCount, s.WaivedCount, vs.TokenUsage.TotalPromptTokens, vs.TokenUsage.TotalCompletionTokens)
	b.WriteString("## Findings\n\n")
	if len(vs.Comments) == 0 {
		b.WriteString("No findings recorded. Check coverage and session status before treating the review as complete.\n\n")
	}
	for i, c := range vs.Comments {
		fmt.Fprintf(&b, "### Finding %d\n\n", i+1)
		b.WriteString(markdownBlock(fmt.Sprintf("Path: %s\nLines: %d-%d\nSeverity: %s\nCategory: %s", c.FilePath, c.StartLine, c.EndLine, c.Severity, c.Category)))
		b.WriteString(markdownBlock(c.Content))
		if c.ExistingCode != "" {
			b.WriteString("#### Existing code\n\n" + markdownBlock(c.ExistingCode))
		}
		if c.SuggestionCode != "" {
			b.WriteString("#### Suggested change\n\n" + markdownBlock(c.SuggestionCode))
		}
	}
	_, err = out.Write(b.Bytes())
	return err
}
