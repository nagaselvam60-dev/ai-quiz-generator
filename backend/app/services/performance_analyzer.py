"""
Performance analyzer service.
Computes overall score, topic-wise, difficulty-wise breakdowns,
strong/weak topics, and personalized recommendations.
"""
from typing import List, Dict, Any


DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Expert"]


def analyze_performance(answers: List[Dict]) -> Dict:
    """
    Full performance analysis from a list of user answer dicts.
    Each dict: {question_id, question_text, topic, subject, difficulty, correct, selected_answer, correct_answer}
    """
    total = len(answers)
    correct_count = sum(1 for a in answers if a.get("correct"))
    incorrect_count = total - correct_count
    percentage = round((correct_count / total * 100) if total > 0 else 0, 1)

    # Topic-wise
    topic_stats: Dict[str, Dict] = {}
    subject_stats: Dict[str, Dict] = {}
    difficulty_stats: Dict[str, Dict] = {d: {"correct": 0, "total": 0} for d in DIFFICULTY_LEVELS}

    for a in answers:
        topic = a.get("topic", "General")
        subject = a.get("subject", "General")
        difficulty = a.get("difficulty", "Medium")

        # Topic
        if topic not in topic_stats:
            topic_stats[topic] = {"correct": 0, "total": 0}
        topic_stats[topic]["total"] += 1
        if a.get("correct"):
            topic_stats[topic]["correct"] += 1

        # Subject
        if subject not in subject_stats:
            subject_stats[subject] = {"correct": 0, "total": 0}
        subject_stats[subject]["total"] += 1
        if a.get("correct"):
            subject_stats[subject]["correct"] += 1

        # Difficulty
        if difficulty in difficulty_stats:
            difficulty_stats[difficulty]["total"] += 1
            if a.get("correct"):
                difficulty_stats[difficulty]["correct"] += 1

    # Calculate percentages
    topic_performance = []
    for topic, stats in topic_stats.items():
        pct = round((stats["correct"] / stats["total"] * 100) if stats["total"] > 0 else 0, 1)
        topic_performance.append({"topic": topic, "correct": stats["correct"], "total": stats["total"], "percentage": pct})

    difficulty_performance = []
    for diff in DIFFICULTY_LEVELS:
        stats = difficulty_stats[diff]
        if stats["total"] > 0:
            pct = round(stats["correct"] / stats["total"] * 100, 1)
            difficulty_performance.append({"difficulty": diff, "correct": stats["correct"], "total": stats["total"], "percentage": pct})

    # Strong/weak topics (threshold: 70%)
    strong_topics = [t["topic"] for t in topic_performance if t["percentage"] >= 70]
    weak_topics = [t["topic"] for t in topic_performance if t["percentage"] < 70]

    # Generate recommendations
    recommendations = generate_recommendations(weak_topics, topic_performance, percentage)

    return {
        "total_questions": total,
        "correct": correct_count,
        "incorrect": incorrect_count,
        "score": correct_count,
        "percentage": percentage,
        "topic_performance": topic_performance,
        "difficulty_performance": difficulty_performance,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics,
        "recommendations": recommendations
    }


def generate_recommendations(weak_topics: List[str], topic_performance: List[Dict], overall_percentage: float) -> List[Dict]:
    """Generate personalized revision recommendations."""
    recs = []

    # Weak topic-specific recommendations
    for topic in weak_topics:
        stats = next((t for t in topic_performance if t["topic"] == topic), None)
        if stats:
            pct = stats["percentage"]
            if pct < 40:
                recs.append({"type": "revise", "text": f"Thoroughly revise {topic} fundamentals — your score is {pct}%."})
            else:
                recs.append({"type": "practice", "text": f"Practice more {topic} questions to strengthen your understanding ({pct}%)."})

    # Overall performance recommendations
    if overall_percentage < 50:
        recs.append({"type": "review", "text": "Review the difference between core concepts in each topic."})
        recs.append({"type": "practice", "text": "Attempt easier questions first to build confidence."})
    elif overall_percentage < 75:
        recs.append({"type": "practice", "text": "Challenge yourself with hard and expert difficulty questions."})
    else:
        recs.append({"type": "review", "text": "Excellent performance! Explore advanced topics in this subject."})

    # Deduplicate and limit
    if not recs:
        recs.append({"type": "review", "text": "Continue practicing regularly to maintain your performance."})

    return recs[:6]
