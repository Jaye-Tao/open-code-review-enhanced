// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import "strings"

const (
	exportLanguageChinese = "zh-CN"
	exportLanguageEnglish = "en"
)

// normalizeExportLanguage accepts the browser's locale values and reduces them
// to the two document languages supported by the viewer.
func normalizeExportLanguage(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if value == exportLanguageEnglish || strings.HasPrefix(value, "en-") {
		return exportLanguageEnglish
	}
	return exportLanguageChinese
}

func exportLanguageFromRequest(value string, defaultLanguage string) string {
	if strings.TrimSpace(value) == "" {
		return normalizeExportLanguage(defaultLanguage)
	}
	return normalizeExportLanguage(value)
}
