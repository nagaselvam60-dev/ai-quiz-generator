from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class TopicPerformance(BaseModel):
    topic: str
    correct: int
    total: int
    percentage: float


class DifficultyPerformance(BaseModel):
    difficulty: str
    correct: int
    total: int
    percentage: float


class RecommendationItem(BaseModel):
    type: str  # revise, practice, review
    text: str


class PerformanceReport(BaseModel):
    attempt_id: int
    quiz_id: int
    subject: str
    topic: str
    total_questions: int
    correct: int
    incorrect: int
    score: int
    percentage: float
    time_taken_seconds: Optional[int]
    topic_performance: List[TopicPerformance]
    difficulty_performance: List[DifficultyPerformance]
    strong_topics: List[str]
    weak_topics: List[str]
    recommendations: List[RecommendationItem]
    completed_at: Optional[datetime]
