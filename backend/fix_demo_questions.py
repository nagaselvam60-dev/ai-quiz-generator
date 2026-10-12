"""Script to fix the broken get_demo_questions function in demo_questions.py"""
import re

filepath = 'app/utils/demo_questions.py'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find start of function definition
func_start = content.find('\ndef get_demo_questions(')
if func_start == -1:
    func_start = content.find('def get_demo_questions(')
    dict_part = content[:func_start]
else:
    dict_part = content[:func_start + 1]  # keep the newline

new_func = '''def get_demo_questions(subject: str, topic: str, difficulty: str, count: int) -> list:
    """
    Returns demo questions for a given subject/topic/difficulty.
    Falls back to closest available questions if exact match not found.
    """
    difficulty_order = {"Easy": 0, "Medium": 1, "Hard": 2, "Expert": 3}

    # Build pool: exact topic first, then other topics in same subject, then any subject
    combined = []
    if subject in DEMO_QUESTIONS and topic in DEMO_QUESTIONS[subject]:
        combined.extend(DEMO_QUESTIONS[subject][topic])
    if subject in DEMO_QUESTIONS:
        for t, qs in DEMO_QUESTIONS[subject].items():
            if t != topic:
                combined.extend(qs)
    for subj, subj_topics in DEMO_QUESTIONS.items():
        if subj != subject:
            for qs in subj_topics.values():
                combined.extend(qs)

    # Sort by proximity to requested difficulty
    combined.sort(key=lambda q: abs(
        difficulty_order.get(q["difficulty"], 1) - difficulty_order.get(difficulty, 1)
    ))

    # Deduplicate and format
    seen = set()
    result = []
    for q in combined:
        if q["question"] in seen:
            continue
        seen.add(q["question"])
        opts = q["options"]
        result.append({
            "question": q["question"],
            "option_a": opts[0], "option_b": opts[1],
            "option_c": opts[2], "option_d": opts[3],
            "correct_answer": q["correct_answer"],
            "explanation": q["explanation"],
            "subject": subject, "topic": topic,
            "difficulty": q["difficulty"]
        })
        if len(result) >= count:
            break

    return result[:count]
'''

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(dict_part + new_func)

print("Fixed! Verifying syntax...")
import py_compile
py_compile.compile(filepath, doraise=True)
print("Syntax OK!")
