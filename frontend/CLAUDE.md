# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation supports all 12 document types with AI chat (no auth UI, no document persistence yet).

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Technical design

The entire project is packaged into a single Docker container (multi-stage build).  
The backend is in `backend/` — a uv project using FastAPI, served at http://localhost:8000.  
The frontend is in `frontend/` — Next.js, statically exported (`output: 'export'`) and served by FastAPI.  
The database is SQLite, created fresh each time the Docker container is brought up, with a `users` table for sign up and sign in.  
Scripts in `scripts/` handle start/stop:
```bash
# Mac
scripts/start-mac.sh    # Build image and start container
scripts/stop-mac.sh     # Stop and remove container

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```

### Backend API endpoints
- `GET  /api/health` — health check
- `GET  /api/catalog` — returns the full document catalog (catalog.json)
- `GET  /api/template-text/{doc_type}` — returns stripped plain-text of the template for a given doc type
- `POST /api/auth/signup` — create account, returns JWT
- `POST /api/auth/signin` — sign in, returns JWT
- `POST /api/chat` — AI chat turn; accepts `doc_type`, `messages` history, and `field_values` (current filled fields), returns AI `message` + `field_updates` for the selected document
- `POST /api/documents` — save a downloaded document to the authenticated user's history (requires `Authorization: Bearer <token>`)
- `GET  /api/documents/me` — list the authenticated user's saved documents, ordered by date desc

### Local development (without Docker)
```bash
# Backend (terminal 1)
cd backend && uv run uvicorn main:app --reload --port 8000

# Frontend (terminal 2)
cd frontend && npm run dev   # → http://localhost:3000
```

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation status

| Ticket | Feature | Status |
|--------|---------|--------|
| PL-1 | Legal document templates (12 types in `templates/`, `catalog.json`) | Done |
| PL-2 | Mutual NDA Creator UI (form + live preview + PDF download) | Done |
| PL-3 | V1 foundation: FastAPI backend, SQLite auth, Docker, scripts | Done |
| PL-4 | AI chat for Mutual NDA (replaces form; Cerebras/OpenRouter structured outputs) | Done |
| PL-5 | Expand AI chat to all 12 supported document types (dynamic `/create/[docType]` route) | Done |
| PL-6 | Multi-user auth UI, document history, legal disclaimer, SaaS polish | Done (PR #8) |

### PL-6 architecture notes

**Auth:** `AuthProvider` context (`frontend/lib/auth-context.tsx`) stores JWT in `localStorage`. `AuthModal` handles sign in / sign up. `HeaderNav` (`frontend/components/HeaderNav.tsx`) is the shared header across all pages — replaces per-page inline headers.

**Document history:** Saved automatically when a user downloads a PDF (only if signed in). `POST /api/documents` creates a record; `GET /api/documents/me` lists them. `/my-documents/` page (`frontend/app/my-documents/page.tsx`) shows history with re-download. Documents store `field_values` as JSON so the PDF can be regenerated client-side.

**Soft gate:** Unauthenticated users can browse and chat freely. Downloads work without auth but don't save to history (info toast nudges them to sign in).

**Toast system:** `ToastProvider` + `ToastContainer` (`frontend/lib/toast-context.tsx`, `frontend/components/ToastContainer.tsx`). Call `useToast().addToast(message, variant)` from any client component.

**Download utility:** All PDF downloads go through `triggerBlobDownload(blob, filename)` in `frontend/lib/download-utils.ts`. Uses `pdf().toBlob()` from `@react-pdf/renderer` (not `PDFDownloadLink`) so a proper async callback exists for the save API call.

**Legal disclaimer:** Amber banner at the bottom of `DocumentPreview` and a styled block in all PDF documents (`DocumentPdfDocument`, `NDAPdfDocument`).

