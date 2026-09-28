# Review viewer enhancements

Start the local viewer with `ocr viewer`. On Windows, the npm launcher is `ocr.cmd`.

## Markdown reports

Use **Markdown** in the sessions list or **Export Markdown** on a session page.
The download includes session metadata, coverage, token counts, every persisted
finding, full paths, line ranges, original code and suggested changes. Browser
filters and local Fixed/Ignored marks do not change the report. LLM conversation
payloads are excluded.

The CLI defaults to HTML for compatibility:

```powershell
ocr.cmd session export --format md -o review.md
ocr.cmd session export <session-id> --format md -o review.md
```

## Compare sessions

Choose **Before** and **After** above the sessions table, then **Compare sessions**.
The per-row Compare link still compares against the next older session.
The page uses the same matching engine as `ocr.cmd session compare`:

- **New**: findings detected only in the after session.
- **Persisting**: findings detected in both sessions (not fixed).
- **Resolved**: previous findings no longer detected in re-reviewed files.
- **Not reviewed**: files without a successful after verdict; fix status is unknown.

Persisting and new findings show deterministic recommendations: **Fix first** for
critical/high severity or security; **Recommended fix** for medium severity, bugs
or performance; otherwise **Review and schedule**. The overview counts persisting
findings in the first two recommendation levels and displays coverage and run metadata.

Matching uses path, category and original code, falling back to finding text.
A resolved result is not proof of correctness. Renames or rewritten findings may
appear as resolved plus new. Legacy runs without coverage manifests retain CLI
behavior and display a warning that resolution is unverified.

## Delete sessions

Use **Delete** in the list or **Delete session** on the detail page. The browser
asks for confirmation with the session ID. Cancel leaves the record untouched.
Confirmation permanently removes only that session's JSONL record; source files
and other sessions are unaffected. Failed deletion shows an error without removing
the row. The endpoint requires a same-origin request and an explicit confirmation
header; read-only page routes still reject writes.

## Full paths

Hover over a file path to see its full value. **Copy** copies the untruncated path
on findings, comparison cards, conversations, reviewed files and token breakdowns.
Clipboard failure falls back to a selectable full-path prompt. Standalone HTML
exports also support path copying.
