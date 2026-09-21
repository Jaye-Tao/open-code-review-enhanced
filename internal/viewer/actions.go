// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 alibaba/open-code-review Contributors

package viewer

import (
	"bytes"
	"fmt"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
)

// Session mutations require an explicit same-origin browser request. The custom
// header prevents cross-origin forms from deleting local review records.
func handleDeleteSession(w http.ResponseWriter, r *http.Request, root, repo, id string) {
	origin, err := url.Parse(r.Header.Get("Origin"))
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	if err != nil || origin.Scheme != scheme || origin.Host != r.Host || origin.User != nil || origin.Path != "" || r.Header.Get("X-OCR-Confirm") != "delete" {
		http.Error(w, "same-origin deletion confirmation required", http.StatusForbidden)
		return
	}
	// os.Root also prevents symlink/junction escapes from the sessions root.
	dir, err := os.OpenRoot(root)
	if err != nil {
		http.Error(w, "sessions unavailable", http.StatusInternalServerError)
		return
	}
	defer dir.Close()
	if err := dir.Remove(filepath.Join(repo, id+".jsonl")); err != nil {
		status := http.StatusInternalServerError
		if os.IsNotExist(err) {
			status = http.StatusNotFound
		}
		http.Error(w, "could not delete session", status)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func handleDeleteRepository(w http.ResponseWriter, r *http.Request, root, repo string) {
	if !sameOriginDelete(r) { http.Error(w, "same-origin deletion confirmation required", http.StatusForbidden); return }
	dir, err := os.OpenRoot(root)
	if err != nil { http.Error(w, "sessions unavailable", http.StatusInternalServerError); return }
	defer dir.Close()
	if err := dir.RemoveAll(repo); err != nil {
		if os.IsNotExist(err) { http.Error(w, "repository not found", http.StatusNotFound); return }
		http.Error(w, "could not delete repository", http.StatusInternalServerError); return
	}
	w.WriteHeader(http.StatusNoContent)
}

func sameOriginDelete(r *http.Request) bool {
	origin, err := url.Parse(r.Header.Get("Origin"))
	scheme := "http"; if r.TLS != nil { scheme = "https" }
	return err == nil && origin.Scheme == scheme && origin.Host == r.Host && origin.User == nil && origin.Path == "" && r.Header.Get("X-OCR-Confirm") == "delete"
}

func handleMarkdown(w http.ResponseWriter, r *http.Request, root, repo, id string) {
	var out bytes.Buffer
	if err := ExportSessionMarkdown(&out, root, repo, id); err != nil {
		http.Error(w, "could not export session", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "text/markdown; charset=utf-8")
	w.Header().Set("Content-Disposition", mime.FormatMediaType("attachment", map[string]string{"filename": "review-" + id + ".md"}))
	w.Header().Set("Content-Length", fmt.Sprint(out.Len()))
	w.Write(out.Bytes())
}
