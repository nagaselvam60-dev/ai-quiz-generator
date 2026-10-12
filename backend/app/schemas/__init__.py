from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.schemas.subject import SubjectCreate, SubjectResponse, TopicCreate, TopicResponse, SubjectWithTopics
from app.schemas.quiz import (
    QuizGenerateRequest, QuestionResponse, QuizResponse,
    MaterialUploadResponse, AnswerSubmitRequest, AnswerResult, AttemptResponse
)
from app.schemas.report import PerformanceReport, TopicPerformance, DifficultyPerformance

__all__ = [
    "UserCreate", "UserLogin", "UserResponse", "Token",
    "SubjectCreate", "SubjectResponse", "TopicCreate", "TopicResponse", "SubjectWithTopics",
    "QuizGenerateRequest", "QuestionResponse", "QuizResponse",
    "MaterialUploadResponse", "AnswerSubmitRequest", "AnswerResult", "AttemptResponse",
    "PerformanceReport", "TopicPerformance", "DifficultyPerformance"
]
