// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import "testing"

func TestValidGitURLAcceptsHTTP(t *testing.T) {
	for _, raw := range []string{"http://git.example.test/team/project.git", "https://git.example.test/team/project.git"} {
		if !validGitURL(raw) {
			t.Errorf("validGitURL(%q) = false", raw)
		}
	}
}

func TestValidBranchNameAcceptsUnicode(t *testing.T) {
	if !validBranchName("dev_0810_分销升级") {
		t.Fatal("validBranchName rejected a Unicode branch name")
	}
}

func TestValidateSubmissionReportsInvalidBranch(t *testing.T) {
	item := ReviewSubmission{
		GitURL:       "https://git.example.test/team/project.git",
		TargetBranch: "feature name",
		BaseBranch:   "main",
		SubmittedBy:  "reviewer",
	}
	if err := validateSubmission(item); err == nil || err.Error() != `审核分支 "feature name" 格式不正确，请填写合法的 Git 分支名` {
		t.Fatalf("validateSubmission() error = %v", err)
	}
}
