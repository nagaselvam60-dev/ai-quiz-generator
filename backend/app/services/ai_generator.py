"""
AI Question Generator Service.
Uses Google Gemini API when key is available, falls back to demo question bank.
"""
import json
import logging
import re
import warnings

from app.core.config import settings

logger = logging.getLogger(__name__)

VALID_DIFFICULTIES = {"Easy", "Medium", "Hard", "Expert"}


def validate_question(q: dict) -> bool:
    """Validate a generated question dict."""
    required = ["question", "option_a", "option_b", "option_c", "option_d", "correct_answer", "difficulty"]
    for field in required:
        if not q.get(field):
            return False
    # Correct answer must be one of the options
    options = {q["option_a"], q["option_b"], q["option_c"], q["option_d"]}
    if q["correct_answer"] not in options:
        return False
    # Difficulty must be valid
    if q["difficulty"] not in VALID_DIFFICULTIES:
        q["difficulty"] = "Medium"
    return True


def generate_questions_ai(
    subject: str,
    topic: str,
    difficulty: str,
    count: int,
    study_material: str | None = None
) -> list[dict]:
    """
    Generate questions using Google Gemini API.
    Raises exception if API call fails.
    """
    try:
        with warnings.catch_warnings():
            # Suppress deprecated-package FutureWarning banner; SDK still works fine.
            warnings.simplefilter("ignore", FutureWarning)
            import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")

        material_context = ""
        if study_material:
            # Use first 2000 chars to stay within token limits
            material_context = f"\n\nBase the questions on this study material:\n{study_material[:2000]}"

        prompt = f"""Generate {count} multiple choice questions for:
Subject: {subject}
Topic: {topic}
Difficulty: {difficulty}
{material_context}

Return ONLY a valid JSON array with this exact structure for each question:
[
  {{
    "question": "Question text here?",
    "option_a": "First option",
    "option_b": "Second option",
    "option_c": "Third option",
    "option_d": "Fourth option",
    "correct_answer": "One of the four option texts (exact match)",
    "explanation": "Why this answer is correct",
    "difficulty": "{difficulty}"
  }}
]

Rules:
- All 4 options must be unique and plausible
- correct_answer must exactly match one of the option values
- Questions must be specific to {subject} - {topic}
- Vary difficulty within {difficulty} range
- Return ONLY the JSON array, no other text"""

        response = model.generate_content(prompt)
        text = response.text.strip()

        # Extract JSON from response
        json_match = re.search(r'\[.*\]', text, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON array found in AI response")

        questions_raw = json.loads(json_match.group())
        validated = []
        seen_questions = set()

        for q in questions_raw:
            # Normalize keys
            normalized = {
                "question": q.get("question", ""),
                "option_a": q.get("option_a", ""),
                "option_b": q.get("option_b", ""),
                "option_c": q.get("option_c", ""),
                "option_d": q.get("option_d", ""),
                "correct_answer": q.get("correct_answer", ""),
                "explanation": q.get("explanation", ""),
                "subject": subject,
                "topic": topic,
                "difficulty": q.get("difficulty", difficulty)
            }
            if normalized["question"] in seen_questions:
                continue
            if validate_question(normalized):
                seen_questions.add(normalized["question"])
                validated.append(normalized)

        return validated[:count]

    except Exception as e:
        logger.error(f"AI generation failed: {e}")
        raise


def generate_questions(
    subject: str,
    topic: str,
    difficulty: str,
    count: int,
    study_material: str | None = None
) -> list[dict]:
    """
    Main entry point for question generation.
    Uses AI if API key is available, otherwise falls back to demo bank.
    """
    if settings.GEMINI_API_KEY:
        try:
            questions = generate_questions_ai(subject, topic, difficulty, count, study_material)
            if len(questions) >= count:
                return questions
            logger.warning(f"AI returned only {len(questions)} questions, supplementing with demo bank")
        except Exception as e:  # noqa: BLE001
            logger.warning(f"AI generation failed ({e}), using demo question bank")

    # Fallback: demo question bank
    from app.utils.demo_questions import get_demo_questions
    questions = get_demo_questions(subject, topic, difficulty, count)
    logger.info(f"Using demo question bank: {len(questions)} questions for {subject}/{topic}")
    return questions


def generate_additional_questions(
    subject: str,
    topic: str,
    difficulty: str,
    count: int,
    existing_questions: list[str],
    study_material: str | None = None
) -> list[dict]:
    """
    Generate new questions avoiding those already asked.
    Used by the adaptive engine when more questions are needed.
    """
    all_questions = generate_questions(subject, topic, difficulty, count + len(existing_questions), study_material)
    # Filter out duplicates
    return [q for q in all_questions if q["question"] not in existing_questions][:count]
