from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.study_material import StudyMaterial
from app.services.document_parser import extract_text_from_file
from app.schemas.quiz import MaterialUploadResponse
from typing import Optional

router = APIRouter()
MAX_FILE_SIZE_MB = 10


@router.post("/upload", response_model=MaterialUploadResponse)
async def upload_material(
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    topic: Optional[str] = Form(None),
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    allowed_extensions = {"pdf", "docx", "txt", "text"}
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: .{ext}. Allowed: PDF, DOCX, TXT")

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=413, detail=f"File too large ({size_mb:.1f}MB). Max: {MAX_FILE_SIZE_MB}MB")

    try:
        text, source_type = extract_text_from_file(file.filename, content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the uploaded file.")

    material = StudyMaterial(user_id=user_id, title=file.filename, source_type=source_type, content=text)
    db.add(material)
    db.commit()
    db.refresh(material)
    return MaterialUploadResponse(id=material.id, title=material.title, source_type=material.source_type,
                                   content_preview=text[:200] + "..." if len(text) > 200 else text)


@router.post("/text", response_model=MaterialUploadResponse)
def add_text_material(
    text: str = Form(...),
    title: Optional[str] = Form("Pasted Material"),
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text content cannot be empty.")
    if len(text) > 50000:
        raise HTTPException(status_code=400, detail="Text too long. Maximum 50,000 characters.")
    material = StudyMaterial(user_id=user_id, title=title or "Pasted Material", source_type="text", content=text.strip())
    db.add(material)
    db.commit()
    db.refresh(material)
    return MaterialUploadResponse(id=material.id, title=material.title, source_type=material.source_type,
                                   content_preview=text[:200] + "..." if len(text) > 200 else text)
