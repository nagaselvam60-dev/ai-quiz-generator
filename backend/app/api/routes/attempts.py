from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.quiz_attempt import QuizAttempt
from app.models.user_answer import UserAnswer
from app.services.adaptive_engine import get_next_difficulty, select_next_question
from app.schemas.quiz import AnswerSubmitRequest

router = APIRouter()


def _q_to_dict(q: Question) -> dict:
    return {"id": q.id, "quiz_id": q.quiz_id, "question_text": q.question_text,
            "option_a": q.option_a, "option_b": q.option_b, "option_c": q.option_c,
            "option_d": q.option_d, "correct_answer": q.correct_answer, "explanation": q.explanation,
            "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty}


@router.post("/start")
def start_attempt(quiz_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == user_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    existing = db.query(QuizAttempt).filter(
        QuizAttempt.quiz_id == quiz_id, QuizAttempt.user_id == user_id,
        QuizAttempt.status == "in_progress"
    ).first()
    if existing:
        answered_ids = [ua.question_id for ua in db.query(UserAnswer).filter(UserAnswer.attempt_id == existing.id).all()]
        questions = [_q_to_dict(q) for q in db.query(Question).filter(Question.quiz_id == quiz_id).all()]
        next_q = select_next_question(questions, existing.current_difficulty, answered_ids)
        return {"attempt_id": existing.id, "current_difficulty": existing.current_difficulty,
                "status": existing.status, "first_question": next_q, "total_questions": quiz.total_questions}

    attempt = QuizAttempt(user_id=user_id, quiz_id=quiz_id,
                          current_difficulty=quiz.starting_difficulty, status="in_progress")
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    questions = [_q_to_dict(q) for q in db.query(Question).filter(Question.quiz_id == quiz_id).all()]
    first_q = select_next_question(questions, quiz.starting_difficulty, [])
    return {"attempt_id": attempt.id, "current_difficulty": attempt.current_difficulty,
            "status": attempt.status, "first_question": first_q, "total_questions": quiz.total_questions}


@router.post("/{attempt_id}/answer")
def submit_answer(attempt_id: int, answer: AnswerSubmitRequest,
                  user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    attempt = db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id, QuizAttempt.user_id == user_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.status == "completed":
        raise HTTPException(status_code=400, detail="Quiz already completed")

    question = db.query(Question).filter(Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    already = db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt_id,
                                          UserAnswer.question_id == answer.question_id).first()
    if already:
        raise HTTPException(status_code=400, detail="Question already answered")

    is_correct = answer.selected_answer.strip() == question.correct_answer.strip()
    user_answer = UserAnswer(attempt_id=attempt_id, question_id=answer.question_id,
                             selected_answer=answer.selected_answer, correct=is_correct, difficulty=question.difficulty)
    db.add(user_answer)

    if is_correct:
        attempt.score += 1
    attempt.current_question_index += 1
    next_difficulty = get_next_difficulty(attempt.current_difficulty, is_correct)
    attempt.current_difficulty = next_difficulty
    db.commit()

    answered_ids = [ua.question_id for ua in db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt_id).all()]
    quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
    is_complete = len(answered_ids) >= quiz.total_questions

    next_question_data = None
    if not is_complete:
        all_questions = [_q_to_dict(q) for q in db.query(Question).filter(Question.quiz_id == attempt.quiz_id).all()]
        next_question_data = select_next_question(all_questions, next_difficulty, answered_ids)

    return {"correct": is_correct, "correct_answer": question.correct_answer,
            "explanation": question.explanation, "next_difficulty": next_difficulty,
            "next_question": next_question_data, "is_quiz_complete": is_complete,
            "current_score": attempt.score, "questions_answered": len(answered_ids),
            "total_questions": quiz.total_questions}


@router.post("/{attempt_id}/complete")
def complete_attempt(attempt_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    attempt = db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id, QuizAttempt.user_id == user_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    total_answered = db.query(UserAnswer).filter(UserAnswer.attempt_id == attempt_id).count()
    attempt.status = "completed"
    attempt.completed_at = datetime.utcnow()
    attempt.percentage = round((attempt.score / total_answered * 100) if total_answered > 0 else 0, 1)
    db.commit()
    return {"attempt_id": attempt_id, "status": "completed", "score": attempt.score,
            "total": total_answered, "percentage": attempt.percentage}


@router.get("/{attempt_id}/status")
def get_attempt_status(attempt_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    attempt = db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id, QuizAttempt.user_id == user_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return {"attempt_id": attempt.id, "quiz_id": attempt.quiz_id, "status": attempt.status,
            "score": attempt.score, "current_question_index": attempt.current_question_index,
            "current_difficulty": attempt.current_difficulty}
