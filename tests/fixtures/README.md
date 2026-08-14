# QA test fixtures

Synthetic, non-sensitive files for manual and automated (Playwright) testing of every PDF/AI tool. Nothing here contains real personal data — all text is placeholder ("QA Test", "Widget A", Lorem-style filler).

| File | Purpose |
|---|---|
| `normal-test.pdf` | Baseline 2-page clean text PDF |
| `100-page.pdf` | Multi-page stress test |
| `scanned-test.pdf` | Image-only page, no text layer — OCR input |
| `fillable-form.pdf` | Real AcroForm fields: `full_name`, `email`, `dob`, `agree_terms` (checkbox), `signature` |
| `password-protected.pdf` | AES-128 encrypted, password `qatest123` |
| `tables.pdf` | Tabular layout |
| `image-heavy.pdf` | 6 pages, each with a large embedded JPEG |
| `links-bookmarks.pdf` | Has an outline (2 bookmarks) and a URI link annotation |
| `comments.pdf` | Has a Text/sticky-note annotation |
| `corrupted.pdf` | `normal-test.pdf` truncated to 40% of its bytes — fails `qpdf --check` |
| `empty.pdf` | 0-byte file |
| `large-file.pdf` | ~5.7 MB image-heavy PDF for large-upload testing (a separate ~100 MB variant is generated on demand for one-off max-size tests, not committed here) |
| `bangla-test.pdf` | Bangla-script body text (rendered via macOS "Bangla Sangam MN") — translator/OCR input |
| `sample.docx` / `.xlsx` / `.pptx` | Minimal valid Office Open XML files |
| `sample.png` / `.jpg` | Minimal valid images |
| `unsupported.exe` | Not a real executable — fake bytes for "unsupported file type" error-handling tests |
| `plain-text.txt` | Plain text, not a PDF |
| `file with spaces.pdf`, `test(1)[final].pdf`, `বাংলা ফাইল.pdf`, `quote'test.pdf`, `very-long-filename-...pdf` | Copies of `normal-test.pdf` under filenames that stress special characters, brackets, Unicode/Bangla, apostrophes, and length |

Regenerate everything with the generator script kept alongside the QA report (not checked in here to avoid duplicating `pdf-lib`/`sharp`/`jszip` usage examples in the repo).
