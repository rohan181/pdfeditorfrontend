# PDF Editor — local persistence & recovery manual test checklist

Run against `npm run dev`, at `/pdf-editor`. All checks use Chrome/Firefox DevTools → Application → IndexedDB → `editpdfai-db` → `sessions` to inspect stored data directly.

## Autosave
1. Open the editor, upload a PDF. Wait 3–4 seconds without editing anything.
   - [ ] A `sessions` entry appears in IndexedDB with `tool: "pdf-editor"`, a non-empty `fileBlob`, and `lastModified` close to now.
2. Add a text element, then wait 4 seconds without further edits.
   - [ ] `lastModified` on the same session id updates (not a new row).
3. Rotate a page, or delete a page, then wait 4 seconds.
   - [ ] Same session id updates again — discrete page actions trigger autosave, not just typing.
4. Make several edits within 2 seconds of each other (e.g., type quickly).
   - [ ] Only one autosave fires ~3s after the *last* edit, not one per keystroke (check the `lastModified` timestamp lands ~3s after your last action, not earlier).

## Recovery prompt
5. Upload a PDF, wait for autosave, then close the tab (don't use Download).
6. Reopen `/pdf-editor` and click "Edit a PDF — Free".
   - [ ] A banner reading "Unsaved work from [relative time] found" appears, with Restore/Discard buttons, *before* you upload anything new.
7. Click **Restore**.
   - [ ] The saved file loads back into the editor with your edits intact (check the rotation/text/deleted page from steps 2–3 persisted).
   - [ ] The banner disappears.
8. Repeat steps 5–6, this time click **Discard**.
   - [ ] The banner disappears, the drop zone shows normally, and the session is gone from IndexedDB (check DevTools).

## Recent Files panel
9. Open the editor fresh, upload 2–3 different PDFs one at a time (upload, wait for autosave, then use "Recent files" or reload to start a new one — each should get its own session id).
   - [ ] Each upload creates a *separate* row in IndexedDB (distinct `id`s), not overwriting the previous one.
10. Click the "Recent files" button on the drop-zone screen.
    - [ ] All saved sessions list, most recently edited first, each showing filename and a relative time ("2 minutes ago" etc).
11. Click a row.
    - [ ] That file loads into the editor.
12. Reopen the panel, click the ✕ delete on one row.
    - [ ] Only that row disappears from the list and from IndexedDB; others remain.
13. Click "Clear all".
    - [ ] The list empties and shows "No saved sessions yet."; IndexedDB `sessions` store is empty.
14. With zero saved sessions, open "Recent files".
    - [ ] Empty state renders correctly, no error.

## beforeunload warning
15. Upload a PDF, make an edit, and *immediately* (within 3s, before autosave fires) try to close/reload the tab.
    - [ ] The browser's native "leave site?" confirmation appears.
16. Make an edit, wait the full 3s for autosave to complete, *then* try to close/reload.
    - [ ] No confirmation prompt (nothing unsaved).

## Storage cap (20 sessions)
17. Create 21+ distinct sessions (script this via DevTools console if tedious manually — call the app's autosave 21 times with different filenames, or just accept this as a code-review-verified path).
    - [ ] After the 21st save, `getAllSessions()` / the Recent Files panel shows at most 20 entries, and the *oldest* `lastModified` one was evicted, not an arbitrary one.

## Privacy
18. With DevTools Console open and "Preserve log" on, do a full upload → edit → autosave → reload → restore cycle.
    - [ ] No filename, file content, or extracted text appears in any `console.log` output.
19. Open the Network tab during the same cycle.
    - [ ] No request is made to any server carrying the file, filename, or session data — everything after the initial PDF upload's local processing stays on `chrome-extension://`/local IndexedDB calls only (no `fetch`/`XHR` referencing the file).

## Cross-check with existing functionality
20. Confirm normal Download/Export still works and produces an unmodified, correct PDF (this feature reused `handleExport`'s PDF-building logic via a shared `buildPdfBlob()` — verify no regression here).
21. `ai-pdf-form-filler` also renders `PDFEditor` (same component). Sessions are scoped by a `toolId` prop (`"pdf-editor"` vs `"ai-pdf-form-filler"`) so they don't cross-contaminate:
    - [ ] Upload + autosave a file from `/ai-pdf-form-filler`, then visit `/pdf-editor` — no recovery prompt appears there (different tool scope).
    - [ ] Reopen `/ai-pdf-form-filler` itself — the recovery prompt for that session *does* appear there.
