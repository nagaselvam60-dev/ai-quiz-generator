"""
Document parser service.
Extracts and cleans text from PDF, DOCX, and TXT files.
"""
import re
import io
from typing import Tuple


def parse_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes using PyMuPDF."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return clean_text(text)
    except ImportError:
        raise ValueError("PyMuPDF not installed. Cannot parse PDF files.")
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")


def parse_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX bytes using python-docx."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        return clean_text(text)
    except ImportError:
        raise ValueError("python-docx not installed. Cannot parse DOCX files.")
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX: {str(e)}")


def parse_txt(file_bytes: bytes) -> str:
    """Decode and clean TXT file bytes."""
    for encoding in ["utf-8", "latin-1", "cp1252"]:
        try:
            text = file_bytes.decode(encoding)
            return clean_text(text)
        except UnicodeDecodeError:
            continue
    raise ValueError("Could not decode text file with supported encodings.")


def clean_text(text: str) -> str:
    """Remove excessive whitespace and non-printable characters."""
    # Remove non-printable chars except standard whitespace
    text = re.sub(r'[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]', ' ', text)
    # Collapse multiple spaces/newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()


def chunk_text(text: str, max_chunk_size: int = 3000) -> list:
    """Split long text into manageable chunks, splitting on paragraph/sentence boundaries."""
    if len(text) <= max_chunk_size:
        return [text]
    chunks = []
    paragraphs = text.split('\n\n')
    current_chunk = ""
    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 <= max_chunk_size:
            current_chunk += para + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks or [text[:max_chunk_size]]


def extract_text_from_file(filename: str, file_bytes: bytes) -> Tuple[str, str]:
    """
    Detect filetype by extension and extract text.
    Returns (extracted_text, source_type)
    """
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext == "pdf":
        return parse_pdf(file_bytes), "pdf"
    elif ext == "docx":
        return parse_docx(file_bytes), "docx"
    elif ext in ("txt", "text", "md"):
        return parse_txt(file_bytes), "txt"
    else:
        raise ValueError(f"Unsupported file type: .{ext}. Supported: PDF, DOCX, TXT")
