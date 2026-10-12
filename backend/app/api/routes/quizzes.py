from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.study_material import StudyMaterial
from app.services.ai_generator import generate_questions
from app.schemas.quiz import QuizGenerateRequest, QuizResponse

router = APIRouter()


@router.post("/generate", response_model=QuizResponse)
def generate_quiz(
    request: QuizGenerateRequest,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if request.num_questions not in [5, 10, 15, 20]:
        raise HTTPException(status_code=400, detail="Number of questions must be 5, 10, 15, or 20")
    if request.starting_difficulty not in ["Easy", "Medium", "Hard"]:
        raise HTTPException(status_code=400, detail="Starting difficulty must be Easy, Medium, or Hard")

    study_material_text = None
    if request.study_material_id:
        material = db.query(StudyMaterial).filter(
            StudyMaterial.id == request.study_material_id,
            StudyMaterial.user_id == user_id
        ).first()
        if not material:
            raise HTTPException(status_code=404, detail="Study material not found")
        study_material_text = material.content
    elif request.custom_text:
        study_material_text = request.custom_text

    try:
        questions_data = generate_questions(
            subject=request.subject, topic=request.topic,
            difficulty=request.starting_difficulty, count=request.num_questions,
            study_material=study_material_text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")

    if not questions_data:
        raise HTTPException(status_code=500, detail="No questions were generated")

    quiz = Quiz(
        user_id=user_id,
        study_material_id=request.study_material_id,
        title=f"{request.subject} - {request.topic}",
        total_questions=len(questions_data),
        starting_difficulty=request.starting_difficulty
    )
    db.add(quiz)
    db.flush()

    question_objects = []
    for q in questions_data:
        question = Question(
            quiz_id=quiz.id,
            question_text=q["question"], option_a=q["option_a"], option_b=q["option_b"],
            option_c=q["option_c"], option_d=q["option_d"], correct_answer=q["correct_answer"],
            explanation=q.get("explanation", ""), subject=q.get("subject", request.subject),
            topic=q.get("topic", request.topic), difficulty=q.get("difficulty", request.starting_difficulty)
        )
        db.add(question)
        question_objects.append(question)

    db.commit()
    db.refresh(quiz)

    return {
        "id": quiz.id, "user_id": quiz.user_id, "title": quiz.title,
        "total_questions": quiz.total_questions, "starting_difficulty": quiz.starting_difficulty,
        "subject_id": quiz.subject_id, "topic_id": quiz.topic_id, "created_at": quiz.created_at,
        "questions": [{"id": q.id, "quiz_id": q.quiz_id, "question_text": q.question_text,
            "option_a": q.option_a, "option_b": q.option_b, "option_c": q.option_c,
            "option_d": q.option_d, "correct_answer": q.correct_answer, "explanation": q.explanation,
            "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty} for q in question_objects]
    }


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: int, user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == user_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    questions = db.query(Question).filter(Question.quiz_id == quiz_id).all()
    return {
        "id": quiz.id, "user_id": quiz.user_id, "title": quiz.title,
        "total_questions": quiz.total_questions, "starting_difficulty": quiz.starting_difficulty,
        "subject_id": quiz.subject_id, "topic_id": quiz.topic_id, "created_at": quiz.created_at,
        "questions": [{"id": q.id, "quiz_id": q.quiz_id, "question_text": q.question_text,
            "option_a": q.option_a, "option_b": q.option_b, "option_c": q.option_c,
            "option_d": q.option_d, "correct_answer": q.correct_answer, "explanation": q.explanation,
            "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty} for q in questions]
    }
