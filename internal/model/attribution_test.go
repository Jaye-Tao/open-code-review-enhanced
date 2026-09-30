// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package model

import "testing"

func TestRemoveAttributionLine(t *testing.T) {
	content := "问题描述：存在风险。\n代码段最后修改人：无法确定\n修复方案：批量查询。" // allow-non-english: verifies localized review output cleanup
	want := "问题描述：存在风险。\n修复方案：批量查询。" // allow-non-english: expected localized review text
	if got := RemoveAttributionLine(content); got != want {
		t.Fatalf("RemoveAttributionLine = %q, want %q", got, want)
	}
}

func TestRemoveFindingHeading(t *testing.T) {
	tests := []struct {
		name string
		in   string
		want string
	}{
		{name: "Chinese heading", in: "问题 1\n标题：空指针风险", want: "标题：空指针风险"},
		{name: "multi digit heading", in: "\n问题 12\r\n标题：风险", want: "标题：风险"},
		{name: "English heading", in: "Finding 3\nTitle: risk", want: "Title: risk"},
		{name: "body text unchanged", in: "标题：问题 1 会导致错误", want: "标题：问题 1 会导致错误"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := RemoveFindingHeading(tt.in); got != tt.want {
				t.Fatalf("RemoveFindingHeading = %q, want %q", got, tt.want)
			}
		})
	}
}
