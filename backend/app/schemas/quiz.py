from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class QuizGenerateRequest(BaseModel):
    subject: str
    topic: str
    num_questions: int = 5
    starting_difficulty: str = "Medium"
    study_material_id: Optional[int] = None
    custom_text: Optional[str] = None


class QuestionResponse(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    explanation: Optional[str]
    subject: str
    topic: str
    difficulty: str

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: int
    user_id: int
    title: str
    total_questions: int
    starting_difficulty: str
    subject_id: Optional[int]
    topic_id: Optional[int]
    created_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class MaterialUploadResponse(BaseModel):
    id: int
    title: str
    source_type: str
    content_preview: str


class AnswerSubmitRequest(BaseModel):
    question_id: int
    selected_answer: str


class AnswerResult(BaseModel):
    correct: bool
    correct_answer: str
    explanation: Optional[str]
    next_difficulty: str
    next_question: Optional[QuestionResponse]
    is_quiz_complete: bool


class AttemptResponse(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    status: str
    current_question_index: int
    current_difficulty: str
    score: int
    started_at: datetime

    class Config:
        from_attributes = True
