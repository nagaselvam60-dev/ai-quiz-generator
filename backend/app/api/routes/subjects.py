from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.subject import SubjectCreate, SubjectResponse

router = APIRouter()

PREDEFINED_SUBJECTS = {
    "Computer Science": ["Python", "Java", "C", "C++", "Data Structures", "Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Software Engineering"],
    "Artificial Intelligence & Data": ["Artificial Intelligence", "Machine Learning", "Deep Learning", "Data Science", "Natural Language Processing", "Computer Vision", "Generative AI"],
    "Web Development": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Web Development"],
    "Cybersecurity": ["Cybersecurity", "Network Security", "Cryptography", "Ethical Hacking", "Cyber Forensics", "Information Security"],
    "Mathematics": ["Algebra", "Calculus", "Statistics", "Probability", "Discrete Mathematics"],
    "Science": ["Physics", "Chemistry", "Biology", "Environmental Science"],
    "General Education": ["English", "History", "Geography", "Economics", "General Knowledge"],
    "Management": ["Business Management", "Marketing", "Finance", "Entrepreneurship"],
    "Emerging Technology": ["Internet of Things", "Cloud Computing", "Blockchain", "Mobile Application Development", "Robotics"]
}

PREDEFINED_TOPICS = {
    "Python": ["Functions", "Data Types", "Classes & Objects", "File Handling", "Exception Handling", "Decorators", "Generators", "List Comprehensions", "Modules & Packages"],
    "Machine Learning": ["Decision Trees", "Classification", "Regression", "Clustering", "Neural Networks", "Feature Engineering", "Model Evaluation", "Ensemble Methods"],
    "Data Structures": ["Arrays", "Linked Lists", "Stacks & Queues", "Trees", "Graphs", "Hashing", "Sorting Algorithms", "Searching Algorithms"],
    "DBMS": ["Normalization", "SQL Queries", "Transactions", "Indexing", "ER Diagrams", "Relational Algebra"],
    "Cybersecurity": ["Phishing Detection", "Encryption", "Firewalls", "Vulnerability Assessment", "Incident Response"],
    "Computer Networks": ["OSI Model", "TCP/IP", "Routing", "DNS", "HTTP/HTTPS", "Network Security"],
    "Operating Systems": ["Process Management", "Memory Management", "File Systems", "Scheduling Algorithms", "Deadlocks"],
    "Artificial Intelligence": ["Search Algorithms", "Knowledge Representation", "Expert Systems", "Fuzzy Logic", "Planning"],
    "Deep Learning": ["Backpropagation", "CNN", "RNN", "Transformers", "GANs", "Transfer Learning"],
}


@router.get("/", response_model=Dict[str, Any])
def get_subjects(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    categories = []
    for category, subjects in PREDEFINED_SUBJECTS.items():
        cat_subjects = []
        for name in subjects:
            topics = PREDEFINED_TOPICS.get(name, [])
            cat_subjects.append({"name": name, "category": category, "is_custom": False, "topics": topics})
        categories.append({"category": category, "subjects": cat_subjects})

    custom_subjects = db.query(Subject).filter(Subject.is_custom == True).all()
    if custom_subjects:
        categories.append({
            "category": "Custom",
            "subjects": [{"id": s.id, "name": s.name, "category": "Custom", "is_custom": True, "topics": [t.name for t in s.topics]} for s in custom_subjects]
        })
    return {"categories": categories}


@router.post("/custom", response_model=SubjectResponse)
def create_custom_subject(subject_data: SubjectCreate, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Subject).filter(Subject.name == subject_data.name).first()
    if existing:
        return existing
    subject = Subject(name=subject_data.name, category=subject_data.category or "Custom", is_custom=True)
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


@router.get("/topics/{subject_name}")
def get_topics_for_subject(subject_name: str, user_id: int = Depends(get_current_user)):
    topics = PREDEFINED_TOPICS.get(subject_name, [])
    return {"subject": subject_name, "topics": topics}
