# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

The current implementation has the Mutual NDA Creator (one document type, no AI chat, no auth UI, no document persistence yet).

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
- `POST /api/auth/signup` — create account, returns JWT
- `POST /api/auth/signin` — sign in, returns JWT

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

**Not yet built:** AI chat, document persistence, auth UI (login/signup pages), support for document types beyond Mutual NDA.

