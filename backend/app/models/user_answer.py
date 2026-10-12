from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_answer = Column(String(500), nullable=False)
    correct = Column(Boolean, nullable=False)
    difficulty = Column(String(20), nullable=False)
    answered_at = Column(DateTime, default=datetime.utcnow)

    attempt = relationship("QuizAttempt", back_populates="answers")
    question = relationship("Question", back_populates="user_answers")
