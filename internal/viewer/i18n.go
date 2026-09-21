// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import "strings"

func modeLabel(mode string) string {
	switch strings.ToLower(strings.TrimSpace(mode)) {
	case "commit":
		return "提交对比"
	case "range":
		return "范围对比"
	case "workspace":
		return "工作区"
	case "staged":
		return "暂存区"
	case "branch":
		return "分支类型"
	case "merge", "merge_request", "pull_request":
		return "Merge 类型"
	default:
		if mode == "" {
			return "未设置"
		}
		return mode
	}
}

func statusLabel(status string) string {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "complete":
		return "已完成"
	case "partial":
		return "部分完成"
	case "failed":
		return "失败"
	case "skipped":
		return "已跳过"
	case "aborted":
		return "已中止"
	case "legacy":
		return "旧版会话"
	default:
		if status == "" {
			return "未知"
		}
		return status
	}
}

func severityLabel(severity string) string {
	switch normalizedCommentSeverity(severity) {
	case "critical":
		return "严重"
	case "high":
		return "高"
	case "medium":
		return "中"
	case "low":
		return "低"
	default:
		if severity == "" {
			return "未标注"
		}
		return severity
	}
}

func categoryLabel(category string) string {
	switch normalizedCommentCategory(category) {
	case "bug":
		return "BUG"
	case "security":
		return "安全"
	case "performance":
		return "性能"
	case "maintainability":
		return "可维护性"
	case "test":
		return "测试"
	case "style":
		return "代码风格"
	case "documentation":
		return "文档"
	default:
		return "其他"
	}
}

func taskLabel(t TaskType) string {
	switch t {
	case PlanTask:
		return "审核规划"
	case MainTask:
		return "代码审核"
	case GroupingTask:
		return "文件分组"
	case MemoryCompressionTask:
		return "上下文整理"
	case ReLocationTask:
		return "问题定位"
	default:
		return string(t)
	}
}
func viewerText(key string) string {
	if key == "File Grouping" {
		return "文件分组"
	}
	return key
}

func modeDifferenceWarning(before, after string) string {
	return "两次审核方式不同（" + modeLabel(before) + " → " + modeLabel(after) + "），对比结果可能覆盖了不同的文件范围。"
}

func legacyCoverageWarning() string {
	return " 审核后会话没有覆盖记录，疑似已修复的问题需要人工确认。"
}
func incompleteReviewWarning() string {
	return " 审核后会话未完整结束，请确认覆盖范围后再接受修复结果。"
}
func reversedChronologyWarning() string {
	return " 审核前会话时间晚于审核后会话，请检查选择是否正确。"
}
