from datetime import datetime, timezone
from typing import Annotated, Any

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Document, User, get_db

router = APIRouter(prefix="/api/documents", tags=["documents"])


class SaveDocumentRequest(BaseModel):
    doc_type: str
    doc_name: str
    filename: str
    field_values: dict[str, Any]


class DocumentResponse(BaseModel):
    id: int
    doc_type: str
    doc_name: str
    filename: str
    field_values: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def save_document(
    body: SaveDocumentRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    doc = Document(
        user_id=current_user.id,
        doc_type=body.doc_type,
        doc_name=body.doc_name,
        filename=body.filename,
        field_values=body.field_values,
        created_at=datetime.now(timezone.utc),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/me", response_model=list[DocumentResponse])
def list_documents(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )
