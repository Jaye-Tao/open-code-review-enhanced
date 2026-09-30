// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package model

import (
	"fmt"
	"regexp"
	"strings"
)

var attributionLine = regexp.MustCompile(`(?m)^\s*(代码段最后修改人|Code segment last modified by|Last modified by)\s*[:：].*\r?\n?`) // allow-non-english: matches the localized review field
var findingHeading = regexp.MustCompile(`(?mi)^\s*(问题|Finding)\s+\d+\s*\r?\n`)

// RemoveAttributionLine removes the model-written copy of the attribution
// field. The application owns this field because only it can verify Git data.
func RemoveAttributionLine(content string) string {
	return strings.TrimSpace(attributionLine.ReplaceAllString(content, ""))
}

// RemoveFindingHeading removes a redundant model-written issue number heading.
// The viewer already displays the finding ID, so the body should begin with
// the review fields themselves.
func RemoveFindingHeading(content string) string {
	return strings.TrimSpace(findingHeading.ReplaceAllString(content, ""))
}

// CodeAttribution is Git evidence for routing a finding, not proof of who
// introduced its root cause. It is populated by the application, never the LLM.
type CodeAttribution struct {
	Status  string       `json:"status"` // confirmed, uncommitted, unavailable
	Reason  string       `json:"reason,omitempty"`
	Ref     string       `json:"ref,omitempty"`
	Path    string       `json:"path,omitempty"`
	Side    string       `json:"side,omitempty"` // new or old; old identifies pre-deletion authors
	Authors []CodeAuthor `json:"authors,omitempty"`
}

// CodeAuthor associates a contiguous line range with its last Git author.
// Name and email are commit identities, not hosting-platform usernames.
type CodeAuthor struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Commit    string `json:"commit"`
	StartLine int    `json:"start_line"`
	EndLine   int    `json:"end_line"`
}

// Summary is plain text; callers must escape it for their output surface.
func (a *CodeAttribution) Summary() string {
	if a == nil {
		return ""
	}
	if a.Status == "uncommitted" {
		return "Uncommitted changes; Git author unavailable"
	}
	if a.Status != "confirmed" || len(a.Authors) == 0 {
		return "Unable to determine (" + a.Reason + ")"
	}
	var parts []string
	for _, author := range a.Authors {
		parts = append(parts, fmt.Sprintf("%s <%s> (L%d-L%d)", author.Name, author.Email, author.StartLine, author.EndLine))
	}
	return strings.Join(parts, "; ")
}
