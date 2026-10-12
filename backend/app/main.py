from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    attempts,
    auth,
    dashboard,
    materials,
    quizzes,
    reports,
    subjects,
)
from app.core.config import settings
from app.core.database import create_tables

app = FastAPI(
    title="AI Quiz Generator & Adaptive Learning System",
    description="A full-stack adaptive quiz platform powered by AI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(subjects.router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(materials.router, prefix="/api/materials", tags=["Study Materials"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["Quizzes"])
app.include_router(attempts.router, prefix="/api/attempts", tags=["Attempts"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])


@app.on_event("startup")
def startup_event():
    create_tables()
    _seed_subjects()


def _seed_subjects():
    """Seed predefined subjects and topics into the database."""
    from app.api.routes.subjects import PREDEFINED_SUBJECTS, PREDEFINED_TOPICS
    from app.core.database import SessionLocal
    from app.models.subject import Subject
    from app.models.topic import Topic

    db = SessionLocal()
    try:
        for category, subject_names in PREDEFINED_SUBJECTS.items():
            for name in subject_names:
                existing = db.query(Subject).filter(Subject.name == name).first()
                if not existing:
                    subject = Subject(name=name, category=category, is_custom=False)
                    db.add(subject)
                    db.flush()
                    # Add predefined topics
                    for topic_name in PREDEFINED_TOPICS.get(name, []):
                        topic = Topic(subject_id=subject.id, name=topic_name)
                        db.add(topic)
        db.commit()
    except Exception as e:  # noqa: BLE001
        db.rollback()
        print(f"Seed warning: {e}")
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "AI Quiz Generator API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "healthy"}
