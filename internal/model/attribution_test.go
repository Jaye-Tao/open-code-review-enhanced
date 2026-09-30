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
