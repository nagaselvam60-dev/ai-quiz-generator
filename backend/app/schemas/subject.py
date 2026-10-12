from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class SubjectCreate(BaseModel):
    name: str
    category: str


class SubjectResponse(BaseModel):
    id: int
    name: str
    category: str
    is_custom: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TopicCreate(BaseModel):
    name: str
    subject_id: int


class TopicResponse(BaseModel):
    id: int
    subject_id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class SubjectWithTopics(BaseModel):
    id: int
    name: str
    category: str
    is_custom: bool
    topics: List[TopicResponse] = []

    class Config:
        from_attributes = True
