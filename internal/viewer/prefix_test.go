// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestForwardedPrefixHTML(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write([]byte(`<link href="/static/style.css"><a href="/r/repo">repo</a>`))
	})
	req := httptest.NewRequest(http.MethodGet, "http://viewer/code-audit/", nil)
	req.Header.Set("X-Forwarded-Prefix", "/code-audit")
	rec := httptest.NewRecorder()

	forwardedPrefixHTML(next).ServeHTTP(rec, req)

	want := `<link href="/code-audit/static/style.css"><a href="/code-audit/r/repo">repo</a>`
	if rec.Body.String() != want {
		t.Fatalf("body = %q, want %q", rec.Body.String(), want)
	}
}

func TestForwardedPrefixHTMLLeavesUnprefixedResponsesUntouched(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		_, _ = w.Write([]byte(`<script src="/static/app.js"></script>`))
	})
	req := httptest.NewRequest(http.MethodGet, "http://viewer/", nil)
	rec := httptest.NewRecorder()

	forwardedPrefixHTML(next).ServeHTTP(rec, req)

	if got := rec.Body.String(); got != `<script src="/static/app.js"></script>` {
		t.Fatalf("body = %q, want root-relative asset URL", got)
	}
}
