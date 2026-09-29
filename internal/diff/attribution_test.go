// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package diff

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	"github.com/alibaba/open-code-review/internal/model"
)

func TestAttributorUsesReviewedRevisionAndLocatedLines(t *testing.T) {
	repo := t.TempDir()
	gitAttributionTest(t, repo, "init", "-q")
	gitAttributionTest(t, repo, "config", "user.name", "First Developer")
	gitAttributionTest(t, repo, "config", "user.email", "first@example.com")
	path := filepath.Join(repo, "sample.go")
	if err := os.WriteFile(path, []byte("package sample\n\nfunc old() {}\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	gitAttributionTest(t, repo, "add", "sample.go")
	gitAttributionTest(t, repo, "commit", "-q", "-m", "initial")
	base := gitAttributionOutput(t, repo, "rev-parse", "HEAD")
	gitAttributionTest(t, repo, "config", "user.name", "Second Developer")
	gitAttributionTest(t, repo, "config", "user.email", "second@example.com")
	if err := os.WriteFile(path, []byte("package sample\n\nfunc updated() {}\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	gitAttributionTest(t, repo, "add", "sample.go")
	gitAttributionTest(t, repo, "commit", "-q", "-m", "update")
	head := gitAttributionOutput(t, repo, "rev-parse", "HEAD")
	d := &model.Diff{NewPath: "sample.go", NewFileContent: "package sample\n\nfunc updated() {}\n"}
	a := NewAttributor(repo, InputResolution{ResolvedBase: base, ResolvedHead: head}, nil)
	got := a.Attribute(context.Background(), model.LlmComment{
		Path: "sample.go", StartLine: 3, EndLine: 3, ExistingCode: "func updated() {}",
	}, d)
	if got.Status != "confirmed" || len(got.Authors) != 1 || got.Authors[0].Name != "Second Developer" || got.Authors[0].Email != "second@example.com" {
		t.Fatalf("Attribute = %+v, want second developer", got)
	}
}

func gitAttributionTest(t *testing.T, dir string, args ...string) {
	t.Helper()
	cmd := exec.Command("git", append([]string{"-C", dir}, args...)...)
	if out, err := cmd.CombinedOutput(); err != nil {
		t.Fatalf("git %v: %v: %s", args, err, out)
	}
}

func gitAttributionOutput(t *testing.T, dir string, args ...string) string {
	t.Helper()
	cmd := exec.Command("git", append([]string{"-C", dir}, args...)...)
	out, err := cmd.Output()
	if err != nil {
		t.Fatalf("git %v: %v", args, err)
	}
	return strings.TrimSpace(string(out))
}

func TestParseBlameGroupsAdjacentAuthors(t *testing.T) {
	output := "" +
		"1111111111111111111111111111111111111111 10 10 1\n" +
		"author Alice\n" +
		"author-mail <alice@example.com>\n" +
		"summary first\n" +
		"\tline one\n" +
		"1111111111111111111111111111111111111111 11 11 1\n" +
		"author Alice\n" +
		"author-mail <alice@example.com>\n" +
		"\tline two\n" +
		"2222222222222222222222222222222222222222 12 12 1\n" +
		"author Bob\n" +
		"author-mail <bob@example.com>\n" +
		"\tline three\n"
	authors, ok := parseBlame(output, 10, 12)
	if !ok || len(authors) != 2 {
		t.Fatalf("parseBlame = %#v, %v; want two authors", authors, ok)
	}
	if authors[0].Name != "Alice" || authors[0].StartLine != 10 || authors[0].EndLine != 11 {
		t.Fatalf("first author = %#v", authors[0])
	}
	if authors[1].Name != "Bob" || authors[1].StartLine != 12 || authors[1].EndLine != 12 {
		t.Fatalf("second author = %#v", authors[1])
	}
}

func TestParseBlameRejectsMissingMetadata(t *testing.T) {
	output := "3333333333333333333333333333333333333333 1 1 1\nauthor Nobody\n\tline\n"
	if authors, ok := parseBlame(output, 1, 1); ok || authors != nil {
		t.Fatalf("parseBlame accepted incomplete metadata: %#v, %v", authors, ok)
	}
}
