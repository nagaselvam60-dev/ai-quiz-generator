from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.user_answer import UserAnswer
from app.services.performance_analyzer import analyze_performance

router = APIRouter()


@router.get("/{attempt_id}")
def get_report(attempt_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    attempt = db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id, QuizAttempt.user_id == user_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
    user_answers = db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt_id).all()

    answers_data = []
    for ua in user_answers:
        q = db.query(Question).filter(Question.id == ua.question_id).first()
        answers_data.append({
            "question_id": ua.question_id,
            "question_text": q.question_text if q else "",
            "topic": q.topic if q else "General",
            "subject": q.subject if q else "General",
            "difficulty": ua.difficulty,
            "correct": ua.correct,
            "selected_answer": ua.selected_answer,
            "correct_answer": q.correct_answer if q else ""
        })

    analysis = analyze_performance(answers_data)
    time_taken = None
    if attempt.completed_at and attempt.started_at:
        time_taken = int((attempt.completed_at - attempt.started_at).total_seconds())

    parts = quiz.title.split(" - ", 1) if quiz else ["Unknown", "General"]
    return {
        "attempt_id": attempt_id, "quiz_id": attempt.quiz_id,
        "subject": parts[0], "topic": parts[1] if len(parts) > 1 else "General",
        "total_questions": analysis["total_questions"],
        "correct": analysis["correct"], "incorrect": analysis["incorrect"],
        "score": analysis["score"], "percentage": analysis["percentage"],
        "time_taken_seconds": time_taken,
        "topic_performance": analysis["topic_performance"],
        "difficulty_performance": analysis["difficulty_performance"],
        "strong_topics": analysis["strong_topics"],
        "weak_topics": analysis["weak_topics"],
        "recommendations": analysis["recommendations"],
        "completed_at": attempt.completed_at
    }
