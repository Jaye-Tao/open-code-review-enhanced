// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package main

import (
	_ "embed"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"unicode"
)

// bundledBackground is the optional review background shipped inside the
// native binary. It is selected only when --default-prompt is supplied.
//
//go:embed default_background.md
var bundledBackground []byte

const (
	backgroundSoftLimit    = 2000
	backgroundHardLimit    = 10000
	backgroundOpenTag      = "<ocr_user_background>"
	backgroundCloseTag     = "</ocr_user_background>"
	maxBackgroundFileBytes = 1 << 20 // 1 MB
)

var multiNewline = regexp.MustCompile(`\n{3,}`)

func resolveBackgroundFilePath(repoDir, path string) string {
	if path == "" || filepath.IsAbs(path) {
		return path
	}
	return filepath.Join(repoDir, path)
}

// selectBackground returns the effective background. When both entry points
// are provided, the file supplies the baseline instructions and the inline
// value adds task-specific context.
func selectBackground(inline, fromFile string) string {
	if fromFile == "" {
		return inline
	}
	if inline != "" {
		return fromFile + "\n\n" + inline
	}
	return fromFile
}

// resolveBackground determines the effective background from the flag
// combination. File and inline backgrounds are combined; the commit-message
// fallback fires only when neither entry point was used.
func resolveBackground(repoDir, inline, backgroundFile, commit string) (string, error) {
	if backgroundFile != "" {
		fileBg, err := loadBackgroundFile(resolveBackgroundFilePath(repoDir, backgroundFile))
		if err != nil {
			return "", err
		}
		return selectBackground(inline, fileBg), nil
	}
	if inline == "" && commit != "" {
		if msg, err := getCommitMessage(repoDir, commit); err == nil && msg != "" {
			return msg, nil
		}
	}
	return inline, nil
}

func resolveBundledBackground(inline string) (string, error) {
	fileBg, err := loadBackgroundContent(string(bundledBackground), "bundled default prompt")
	if err != nil {
		return "", err
	}
	return selectBackground(inline, fileBg), nil
}

func loadBackgroundFile(path string) (string, error) {
	info, err := os.Stat(path)
	if err != nil {
		return "", fmt.Errorf("read background file %q: %w", path, err)
	}
	if info.IsDir() {
		return "", fmt.Errorf("background file %q is a directory, not a file", path)
	}
	if info.Size() > maxBackgroundFileBytes {
		return "", fmt.Errorf(
			"background file %q is %d bytes, exceeding the maximum of %d bytes; please provide a smaller file",
			path, info.Size(), maxBackgroundFileBytes,
		)
	}

	raw, err := os.ReadFile(path)
	if err != nil {
		return "", fmt.Errorf("read background file %q: %w", path, err)
	}
	return loadBackgroundContent(string(raw), path)
}

func loadBackgroundContent(raw, source string) (string, error) {
	cleaned := sanitizeMarkdown(raw)
	if cleaned == "" {
		return "", fmt.Errorf("background %q is empty after sanitisation", source)
	}

	if strings.Contains(cleaned, backgroundOpenTag) || strings.Contains(cleaned, backgroundCloseTag) {
		return "", fmt.Errorf(
			"background %q must not contain the reserved delimiters %q or %q",
			source, backgroundOpenTag, backgroundCloseTag,
		)
	}

	// Enforce the limits on the cleaned content only: the wrapper delimiters add
	// overhead the user cannot control, so counting them would make the reported
	// character count misleading.
	if n := len([]rune(cleaned)); n > backgroundHardLimit {
		return "", fmt.Errorf(
			"background %q is %d characters, exceeding the hard limit of %d (aborting)",
			source,
			n, backgroundHardLimit,
		)
	} else if n > backgroundSoftLimit {
		fmt.Fprintf(os.Stderr,
			"[ocr] background %q is %d characters, exceeding the recommended %d (continuing but review quality might be impacted)\n",
			source,
			n, backgroundSoftLimit,
		)
	}

	return backgroundOpenTag + "\n" + cleaned + "\n" + backgroundCloseTag, nil
}

func sanitizeMarkdown(s string) string {
	var b strings.Builder
	b.Grow(len(s))

	for _, r := range s {
		switch r {
		case '\n', '\t':
			b.WriteRune(r)
			continue
		case '\r':
			continue
		}
		if isForbiddenChar(r) {
			continue
		}
		b.WriteRune(r)
	}

	collapsed := multiNewline.ReplaceAllString(b.String(), "\n\n")
	return strings.TrimSpace(collapsed)
}

func isForbiddenChar(r rune) bool {
	switch {
	case r <= 0x1F: // C0 control characters (includes NUL)
		return true
	case r >= 0x7F && r <= 0x9F: // DEL and C1 control characters
		return true
	}

	// The runes below all belong to Unicode category Cf and are therefore
	// already caught by the unicode.Is(unicode.Cf, r) check at the end. They are
	// listed explicitly only as documentation of the most common invisible
	// characters we strip; the switch is redundant, not a correctness necessity.
	switch r {
	case '\u200B', // zero-width space
		'\u200C', // zero-width non-joiner
		'\u200D', // zero-width joiner
		'\u200E', // left-to-right mark
		'\u200F', // right-to-left mark
		'\u2060', // word joiner
		'\u00AD', // soft hyphen
		'\uFEFF': // BOM / zero-width no-break space
		return true
	}

	return unicode.Is(unicode.Cf, r)
}
