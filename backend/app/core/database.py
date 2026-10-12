import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SQLITE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'quiz_db.sqlite')}"

db_url = settings.DATABASE_URL or SQLITE_URL
active_db_type = "sqlite"

if db_url.startswith("postgresql") or db_url.startswith("postgres"):
    # Normalize generic postgresql:// to use installed psycopg2
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    elif db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
    
    try:
        # Test connection to PostgreSQL
        pg_engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )
        with pg_engine.connect() as conn:
            pass
        engine = pg_engine
        active_db_type = "postgresql"
        print(f"Connected successfully to PostgreSQL database: {db_url.split('@')[-1]}")
    except Exception as e:
        print(f"PostgreSQL connection failed ({e}). Falling back to local SQLite.")
        engine = create_engine(
            SQLITE_URL,
            connect_args={"check_same_thread": False},
        )
        active_db_type = "sqlite"
else:
    engine = create_engine(
        SQLITE_URL,
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the active database."""
    from app.models import user, subject, topic, study_material, quiz, question, quiz_attempt, user_answer  # noqa
    Base.metadata.create_all(bind=engine)
    print(f"Tables verified/created in {active_db_type.upper()} database.")
