// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import (
	"net/http/httptest"
	"testing"
)

func TestSameOriginRequestWithProxyHeaders(t *testing.T) {
	tests := []struct {
		name, origin, referer string
		headers               map[string]string
		want                  bool
	}{
		{"forwarded host and port", "https://review.example.test:8443", "", map[string]string{"X-Forwarded-Proto": "https", "X-Forwarded-Host": "review.example.test", "X-Forwarded-Port": "8443"}, true},
		{"forwarded standard header", "https://review.example.test", "", map[string]string{"Forwarded": "for=192.0.2.1;proto=https;host=review.example.test"}, true},
		{"same origin referer", "", "https://review.example.test/submit", map[string]string{"X-Forwarded-Proto": "https", "X-Forwarded-Host": "review.example.test"}, true},
		{"cross origin", "https://evil.example.test", "", map[string]string{"X-Forwarded-Proto": "https", "X-Forwarded-Host": "review.example.test"}, false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := httptest.NewRequest("POST", "http://127.0.0.1/submit", nil)
			for key, value := range tt.headers {
				r.Header.Set(key, value)
			}
			if tt.origin != "" {
				r.Header.Set("Origin", tt.origin)
			}
			if tt.referer != "" {
				r.Header.Set("Referer", tt.referer)
			}
			if got := sameOriginRequest(r); got != tt.want {
				t.Fatalf("sameOriginRequest() = %v, want %v", got, tt.want)
			}
		})
	}
}
