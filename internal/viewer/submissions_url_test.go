// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import "testing"

func TestValidGitURL(t *testing.T) {
	for _, raw := range []string{
		"http://git.example.test/team/project.git",
		"https://git.example.test/team/project.git",
		"ssh://git.example.test/team/project.git",
		"git@git.example.test:team/project.git",
	} {
		if !validGitURL(raw) {
			t.Errorf("validGitURL(%q) = false", raw)
		}
	}
	for _, raw := range []string{"/opt/project", "D:\\project", "ftp://git.example.test/project.git", "http://"} {
		if validGitURL(raw) {
			t.Errorf("validGitURL(%q) = true", raw)
		}
	}
}
