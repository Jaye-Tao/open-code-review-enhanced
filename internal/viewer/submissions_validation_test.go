// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import "testing"

func TestValidateSubmissionReportsInvalidBranch(t *testing.T) {
	item := ReviewSubmission{
		GitURL:       "https://git.example.test/team/project.git",
		TargetBranch: "feature name",
		BaseBranch:   "main",
		SubmittedBy:  "reviewer",
	}
	if err := validateSubmission(item); err == nil || err.Error() != `invalid target branch "feature name": use a branch name containing only letters, numbers, '.', '_' or '/'` {
		t.Fatalf("validateSubmission() error = %v", err)
	}
}
