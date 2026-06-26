import os
import json
import re
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import init_db
from auth import router as auth_router
from chat import router as chat_router, FILENAME_TO_DOC_TYPE
from documents import router as documents_router

load_dotenv(Path(__file__).parent.parent / ".env")

STATIC_DIR = Path(__file__).parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(documents_router)


CATALOG_PATH = Path(__file__).parent.parent / "catalog.json"
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

# Build slug → filename mapping from catalog
_DOC_TYPE_TO_FILENAME: dict[str, str] = {
    v: k for k, v in FILENAME_TO_DOC_TYPE.items()
}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/catalog")
def get_catalog():
    if not CATALOG_PATH.exists():
        raise HTTPException(status_code=404, detail="catalog.json not found")
    with open(CATALOG_PATH) as f:
        catalog = json.load(f)
    # Attach docType slug to each catalog entry
    for entry in catalog:
        stem = Path(entry["filename"]).stem
        doc_type = FILENAME_TO_DOC_TYPE.get(stem)
        if doc_type is None:
            raise HTTPException(
                status_code=500,
                detail=f"No docType mapping for catalog template stem: {stem!r}. "
                       "Update FILENAME_TO_DOC_TYPE in chat.py.",
            )
        entry["docType"] = doc_type
    return catalog


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


@app.get("/api/template-text/{doc_type}")
def get_template_text(doc_type: str):
    stem = _DOC_TYPE_TO_FILENAME.get(doc_type)
    if not stem:
        raise HTTPException(status_code=404, detail=f"Unknown document type: {doc_type}")
    md_file = TEMPLATES_DIR / f"{stem}.md"
    if not md_file.exists():
        raise HTTPException(status_code=404, detail="Template file not found")
    raw = md_file.read_text()
    cleaned = _strip_html(raw)
    return {"text": cleaned}


# Serve the static Next.js export if it exists
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="frontend")
