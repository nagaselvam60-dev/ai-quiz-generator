from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.quiz import Quiz
from app.models.quiz_attempt import QuizAttempt
from app.models.user_answer import UserAnswer
from app.models.question import Question

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user_id, QuizAttempt.status == "completed"
    ).all()

    total_quizzes = len(attempts)
    avg_score = round(sum(a.percentage for a in attempts) / total_quizzes, 1) if total_quizzes > 0 else 0
    best_score = max((a.percentage for a in attempts), default=0)

    total_questions = 0
    topic_stats = {}
    for attempt in attempts:
        uas = db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt.id).all()
        total_questions += len(uas)
        for ua in uas:
            q = db.query(Question).filter(Question.id == ua.question_id).first()
            if q:
                t = q.topic
                if t not in topic_stats:
                    topic_stats[t] = {"correct": 0, "total": 0}
                topic_stats[t]["total"] += 1
                if ua.correct:
                    topic_stats[t]["correct"] += 1

    sorted_topics = sorted(topic_stats.items(), key=lambda x: x[1]["correct"] / max(x[1]["total"], 1), reverse=True)
    strongest_topic = sorted_topics[0][0] if sorted_topics else "N/A"
    weakest_topic = sorted_topics[-1][0] if sorted_topics else "N/A"

    recent = (db.query(QuizAttempt, Quiz)
              .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
              .filter(QuizAttempt.user_id == user_id)
              .order_by(QuizAttempt.started_at.desc())
              .limit(5).all())

    recent_quizzes = []
    for attempt, quiz in recent:
        total_q = db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt.id).count()
        recent_quizzes.append({
            "attempt_id": attempt.id, "quiz_id": quiz.id, "title": quiz.title,
            "score": attempt.score, "total": total_q, "percentage": attempt.percentage,
            "status": attempt.status, "date": attempt.started_at
        })

    return {
        "total_quizzes": total_quizzes, "average_score": avg_score,
        "best_score": best_score, "questions_attempted": total_questions,
        "strongest_topic": strongest_topic, "weakest_topic": weakest_topic,
        "recent_quizzes": recent_quizzes
    }


@router.get("/history")
def get_history(user_id: int = Depends(get_current_user), db: Session = Depends(get_db),
                skip: int = Query(0, ge=0), limit: int = Query(20, le=100)):
    results = (db.query(QuizAttempt, Quiz)
               .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
               .filter(QuizAttempt.user_id == user_id)
               .order_by(QuizAttempt.started_at.desc())
               .offset(skip).limit(limit).all())

    history = []
    for attempt, quiz in results:
        total_q = db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt.id).count()
        history.append({
            "attempt_id": attempt.id, "quiz_id": quiz.id, "title": quiz.title,
            "questions": total_q, "score": attempt.score, "percentage": attempt.percentage,
            "status": attempt.status, "date": attempt.started_at, "completed_at": attempt.completed_at
        })

    return {"history": history, "total": len(history)}


@router.get("/system/info")
def get_system_info():
    from app.core.database import active_db_type
    return {
        "database": "PostgreSQL" if active_db_type == "postgresql" else "SQLite (local fallback)",
        "database_connected": active_db_type == "postgresql",
        "ai_engine": "Google Gemini 1.5 Flash",
        "auth": "PBKDF2-SHA256 + JWT (HS256)",
        "adaptive_engine": "Dynamic Calibration",
        "version": "1.0.0"
    }

