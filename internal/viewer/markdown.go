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
	return ExportSessionMarkdownWithLanguage(out, root, repo, id, exportLanguageEnglish)
}

// ExportSessionMarkdownWithLanguage exports a session using human-readable
// labels in the requested document language.
func ExportSessionMarkdownWithLanguage(out io.Writer, root, repo, id, language string) error {
	vs, err := LoadSession(root, repo, id)
	if err != nil {
		return err
	}
	s := vs.Summary
	language = normalizeExportLanguage(language)
	english := language == exportLanguageEnglish
	var b bytes.Buffer
	if english {
		b.WriteString("# Code Review Report\n\n## Session\n\n")
		b.WriteString(markdownBlock(fmt.Sprintf("Session: %s\nRepository: %s\nBranch: %s\nMode: %s\nModel: %s\nStarted: %s\nStatus: %s\nAborted: %t\nLegacy: %t\nDuration: %s\nDiff: %s -> %s\nCommit: %s", s.SessionID, s.CWD, s.GitBranch, s.ReviewMode, s.Model, s.Timestamp.Format("2006-01-02T15:04:05Z07:00"), s.TerminalState, s.Aborted, s.Legacy, formatDuration(s.DurationSec), s.DiffFrom, s.DiffTo, s.DiffCommit)))
		fmt.Fprintf(&b, "## Summary\n\n- Findings: %d\n- Files: %d\n- Coverage: %d selected, %d completed, %d reused, %d failed, %d waived\n- Tokens: %d prompt, %d completion\n\n", len(vs.Comments), s.FileCount, s.SelectedCount, s.CompletedCount, s.ReusedCount, s.FailedCount, s.WaivedCount, vs.TokenUsage.TotalPromptTokens, vs.TokenUsage.TotalCompletionTokens)
		b.WriteString("## Findings\n\n")
	} else {
		b.WriteString("# 代码审核报告\n\n## 会话\n\n")
		b.WriteString(markdownBlock(fmt.Sprintf("会话：%s\n仓库：%s\n分支：%s\n审核方式：%s\n模型：%s\n开始时间：%s\n状态：%s\n已中止：%t\n旧版会话：%t\n耗时：%s\n差异：%s -> %s\n提交：%s", s.SessionID, s.CWD, s.GitBranch, s.ReviewMode, s.Model, s.Timestamp.Format("2006-01-02T15:04:05Z07:00"), s.TerminalState, s.Aborted, s.Legacy, formatDuration(s.DurationSec), s.DiffFrom, s.DiffTo, s.DiffCommit)))
		fmt.Fprintf(&b, "## 摘要\n\n- 问题：%d\n- 文件：%d\n- 覆盖：%d 个选中，%d 个完成，%d 个复用，%d 个失败，%d 个跳过\n- Token：%d 输入，%d 输出\n\n", len(vs.Comments), s.FileCount, s.SelectedCount, s.CompletedCount, s.ReusedCount, s.FailedCount, s.WaivedCount, vs.TokenUsage.TotalPromptTokens, vs.TokenUsage.TotalCompletionTokens)
		b.WriteString("## 问题\n\n")
	}
	if len(vs.Comments) == 0 {
		if english {
			b.WriteString("No findings recorded. Check coverage and session status before treating the review as complete.\n\n")
		} else {
			b.WriteString("没有记录到问题。在将审核视为完成前，请检查覆盖范围和会话状态。\n\n")
		}
	}
	for i, c := range vs.Comments {
		if english {
			fmt.Fprintf(&b, "### Finding %d\n\n", i+1)
			b.WriteString(markdownBlock(fmt.Sprintf("Path: %s\nLines: %d-%d\nSeverity: %s\nCategory: %s", c.FilePath, c.StartLine, c.EndLine, c.Severity, c.Category)))
		} else {
			fmt.Fprintf(&b, "### 问题 %d\n\n", i+1)
			b.WriteString(markdownBlock(fmt.Sprintf("路径：%s\n行号：%d-%d\n严重程度：%s\n类别：%s", c.FilePath, c.StartLine, c.EndLine, severityLabel(c.Severity), categoryLabel(c.Category))))
		}
		b.WriteString(markdownBlock(c.Content))
		if c.ExistingCode != "" {
			label := "#### Existing code"
			if !english {
				label = "#### 现有代码"
			}
			b.WriteString(label + "\n\n" + markdownBlock(c.ExistingCode))
		}
		if c.SuggestionCode != "" {
			label := "#### Suggested change"
			if !english {
				label = "#### 建议修改"
			}
			b.WriteString(label + "\n\n" + markdownBlock(c.SuggestionCode))
		}
	}
	_, err = out.Write(b.Bytes())
	return err
}
