"""
Backend tests for the AI Quiz Generator & Adaptive Learning System.
Run with: pytest tests/ -v
"""
import pytest


# ─────────────────────────────────────────────
# Adaptive Engine Tests
# ─────────────────────────────────────────────
class TestAdaptiveEngine:
    def test_correct_easy_gives_medium(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Easy", True) == "Medium"

    def test_correct_medium_gives_hard(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Medium", True) == "Hard"

    def test_correct_hard_gives_expert(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Hard", True) == "Expert"

    def test_correct_expert_stays_expert(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Expert", True) == "Expert"

    def test_incorrect_expert_gives_hard(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Expert", False) == "Hard"

    def test_incorrect_hard_gives_medium(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Hard", False) == "Medium"

    def test_incorrect_medium_gives_easy(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Medium", False) == "Easy"

    def test_incorrect_easy_stays_easy(self):
        from app.services.adaptive_engine import get_next_difficulty
        assert get_next_difficulty("Easy", False) == "Easy"

    def test_no_repeat_questions(self):
        from app.services.adaptive_engine import select_next_question
        questions = [
            {"id": 1, "difficulty": "Easy"},
            {"id": 2, "difficulty": "Medium"},
            {"id": 3, "difficulty": "Hard"},
        ]
        q = select_next_question(questions, "Easy", asked_question_ids=[1])
        assert q is not None
        assert q["id"] != 1

    def test_returns_none_when_all_asked(self):
        from app.services.adaptive_engine import select_next_question
        questions = [{"id": 1, "difficulty": "Easy"}]
        assert select_next_question(questions, "Easy", asked_question_ids=[1]) is None


# ─────────────────────────────────────────────
# Performance Analyzer Tests
# ─────────────────────────────────────────────
class TestPerformanceAnalyzer:
    def _sample_answers(self, correct_count=4, total=5, topic="Functions", subject="Python", difficulty="Medium"):
        answers = []
        for i in range(total):
            answers.append({"topic": topic, "subject": subject, "difficulty": difficulty, "correct": i < correct_count, "selected_answer": "A", "correct_answer": "A" if i < correct_count else "B"})
        return answers

    def test_score_calculation(self):
        from app.services.performance_analyzer import analyze_performance
        answers = self._sample_answers(correct_count=4, total=5)
        result = analyze_performance(answers)
        assert result["correct"] == 4
        assert result["incorrect"] == 1
        assert result["percentage"] == 80.0

    def test_perfect_score(self):
        from app.services.performance_analyzer import analyze_performance
        answers = self._sample_answers(correct_count=5, total=5)
        result = analyze_performance(answers)
        assert result["percentage"] == 100.0

    def test_zero_score(self):
        from app.services.performance_analyzer import analyze_performance
        answers = self._sample_answers(correct_count=0, total=5)
        result = analyze_performance(answers)
        assert result["percentage"] == 0.0

    def test_strong_topic_detected(self):
        from app.services.performance_analyzer import analyze_performance
        answers = self._sample_answers(correct_count=4, total=5)
        result = analyze_performance(answers)
        assert "Functions" in result["strong_topics"]

    def test_weak_topic_detected(self):
        from app.services.performance_analyzer import analyze_performance
        answers = self._sample_answers(correct_count=2, total=5)
        result = analyze_performance(answers)
        assert "Functions" in result["weak_topics"]

    def test_recommendations_not_empty(self):
        from app.services.performance_analyzer import analyze_performance
        answers = self._sample_answers(correct_count=1, total=5)
        result = analyze_performance(answers)
        assert len(result["recommendations"]) > 0


# ─────────────────────────────────────────────
# Security Tests
# ─────────────────────────────────────────────
class TestSecurity:
    def test_password_hashing(self):
        from app.core.security import hash_password, verify_password
        hashed = hash_password("mysecretpassword")
        assert hashed != "mysecretpassword"
        assert verify_password("mysecretpassword", hashed)

    def test_wrong_password_fails(self):
        from app.core.security import hash_password, verify_password
        hashed = hash_password("correctpassword")
        assert not verify_password("wrongpassword", hashed)

    def test_jwt_create_and_decode(self):
        from app.core.security import create_access_token, decode_token
        token = create_access_token({"sub": "42"})
        payload = decode_token(token)
        assert payload["sub"] == "42"


# ─────────────────────────────────────────────
# Demo Questions Tests
# ─────────────────────────────────────────────
class TestDemoQuestions:
    def test_returns_correct_count(self):
        from app.utils.demo_questions import get_demo_questions
        questions = get_demo_questions("Machine Learning", "Classification", "Medium", 5)
        assert len(questions) == 5

    def test_question_has_required_fields(self):
        from app.utils.demo_questions import get_demo_questions
        questions = get_demo_questions("Python", "Functions", "Easy", 3)
        for q in questions:
            assert "question" in q
            assert "option_a" in q
            assert "option_b" in q
            assert "option_c" in q
            assert "option_d" in q
            assert "correct_answer" in q
            assert q["correct_answer"] in [q["option_a"], q["option_b"], q["option_c"], q["option_d"]]

    def test_fallback_for_unknown_subject(self):
        from app.utils.demo_questions import get_demo_questions
        questions = get_demo_questions("Quantum Mechanics", "Superposition", "Hard", 3)
        # Should still return questions (fallback to any subject)
        assert len(questions) >= 1

    def test_no_duplicate_questions(self):
        from app.utils.demo_questions import get_demo_questions
        questions = get_demo_questions("Data Structures", "Arrays", "Easy", 5)
        texts = [q["question"] for q in questions]
        assert len(texts) == len(set(texts))


# ─────────────────────────────────────────────
# Question Validation Tests
# ─────────────────────────────────────────────
class TestQuestionValidation:
    def test_valid_question_passes(self):
        from app.services.ai_generator import validate_question
        q = {
            "question": "What is 2 + 2?",
            "option_a": "3", "option_b": "4", "option_c": "5", "option_d": "6",
            "correct_answer": "4", "difficulty": "Easy"
        }
        assert validate_question(q) is True

    def test_question_with_wrong_correct_answer_fails(self):
        from app.services.ai_generator import validate_question
        q = {
            "question": "What is 2 + 2?",
            "option_a": "3", "option_b": "4", "option_c": "5", "option_d": "6",
            "correct_answer": "100", "difficulty": "Easy"  # not one of the options
        }
        assert validate_question(q) is False

    def test_question_with_missing_field_fails(self):
        from app.services.ai_generator import validate_question
        q = {"question": "Something", "option_a": "A", "option_b": "B", "correct_answer": "A", "difficulty": "Easy"}
        # Missing option_c and option_d
        assert validate_question(q) is False
