"""
Adaptive difficulty engine.
Adjusts question difficulty based on user performance.
"""

DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard", "Expert"]
DIFFICULTY_INDEX = {d: i for i, d in enumerate(DIFFICULTY_LEVELS)}


def get_next_difficulty(current_difficulty: str, was_correct: bool) -> str:
    """
    Advance or retreat difficulty based on answer correctness.
    Correct: Easy→Medium→Hard→Expert (stays at Expert)
    Incorrect: Expert→Hard→Medium→Easy (stays at Easy)
    """
    idx = DIFFICULTY_INDEX.get(current_difficulty, 1)  # default Medium
    if was_correct:
        new_idx = min(idx + 1, len(DIFFICULTY_LEVELS) - 1)
    else:
        new_idx = max(idx - 1, 0)
    return DIFFICULTY_LEVELS[new_idx]


def select_next_question(
    questions: list,
    target_difficulty: str,
    asked_question_ids: list
) -> dict | None:
    """
    Pick the next question matching the target difficulty, never repeating asked ones.
    Falls back to adjacent difficulties if no exact match is available.
    """
    available = [q for q in questions if q["id"] not in asked_question_ids]
    if not available:
        return None

    # Try exact difficulty match
    exact = [q for q in available if q["difficulty"] == target_difficulty]
    if exact:
        return exact[0]

    # Try adjacent difficulties
    idx = DIFFICULTY_INDEX.get(target_difficulty, 1)
    for offset in [1, -1, 2, -2, 3]:
        neighbor_idx = idx + offset
        if 0 <= neighbor_idx < len(DIFFICULTY_LEVELS):
            neighbor_difficulty = DIFFICULTY_LEVELS[neighbor_idx]
            candidates = [q for q in available if q["difficulty"] == neighbor_difficulty]
            if candidates:
                return candidates[0]

    # Last resort: return any available question
    return available[0]


def analyze_topic_performance(answers: list) -> dict:
    """
    Analyze per-topic performance from a list of answer dicts.
    Each answer dict: {topic, correct, difficulty}
    Returns dict: {topic -> {correct, total, percentage}}
    """
    topic_stats = {}
    for answer in answers:
        topic = answer.get("topic", "Unknown")
        if topic not in topic_stats:
            topic_stats[topic] = {"correct": 0, "total": 0}
        topic_stats[topic]["total"] += 1
        if answer.get("correct"):
            topic_stats[topic]["correct"] += 1

    for topic, stats in topic_stats.items():
        stats["percentage"] = round(
            (stats["correct"] / stats["total"] * 100) if stats["total"] > 0 else 0, 1
        )
    return topic_stats


def get_topic_recommendation(topic: str, percentage: float) -> str:
    """Generate a recommendation string based on topic performance."""
    if percentage >= 90:
        return f"Excellent mastery of {topic}. You can move to advanced topics."
    elif percentage >= 70:
        return f"Good understanding of {topic}. Review edge cases."
    elif percentage >= 50:
        return f"Moderate understanding of {topic}. Revisit core concepts."
    else:
        return f"Needs significant improvement in {topic}. Study fundamentals thoroughly."
