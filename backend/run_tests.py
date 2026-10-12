# Direct test runner - tests pure Python logic only (no DB needed)
import sys
sys.path.insert(0, '.')

passed = 0
failed = 0

def check(name, actual, expected):
    global passed, failed
    if actual == expected:
        print(f"  PASS: {name}")
        passed += 1
    else:
        print(f"  FAIL: {name} -> got '{actual}', expected '{expected}'")
        failed += 1

print("=" * 50)
print("TEST 1: Adaptive Engine - Difficulty Transitions")
print("=" * 50)
from app.services.adaptive_engine import get_next_difficulty, select_next_question

check("Easy + correct -> Medium",    get_next_difficulty("Easy", True),   "Medium")
check("Medium + correct -> Hard",    get_next_difficulty("Medium", True), "Hard")
check("Hard + correct -> Expert",    get_next_difficulty("Hard", True),   "Expert")
check("Expert + correct -> Expert",  get_next_difficulty("Expert", True), "Expert")
check("Expert + wrong -> Hard",      get_next_difficulty("Expert", False),"Hard")
check("Hard + wrong -> Medium",      get_next_difficulty("Hard", False),  "Medium")
check("Medium + wrong -> Easy",      get_next_difficulty("Medium", False),"Easy")
check("Easy + wrong -> Easy",        get_next_difficulty("Easy", False),  "Easy")

# No-repeat test
pool = [{"id": 1, "difficulty": "Easy"}, {"id": 2, "difficulty": "Medium"}]
q1 = select_next_question(pool, "Easy", asked_question_ids=[1])
check("Skip asked question", q1 is not None and q1["id"] != 1, True)
q_none = select_next_question(pool, "Easy", asked_question_ids=[1, 2])
check("Returns None when all answered", q_none is None, True)

print()
print("=" * 50)
print("TEST 2: Performance Analyzer")
print("=" * 50)
from app.services.performance_analyzer import analyze_performance

answers_4_5 = [{"topic": "Functions", "subject": "Python", "difficulty": "Medium", "correct": i < 4,
                "selected_answer": "A", "correct_answer": "A"} for i in range(5)]
result = analyze_performance(answers_4_5)
check("Correct count = 4",           result["correct"], 4)
check("Incorrect count = 1",         result["incorrect"], 1)
check("Percentage = 80.0",           result["percentage"], 80.0)
check("Strong topics detected",      "Functions" in result["strong_topics"], True)

answers_0_5 = [{"topic": "Trees", "subject": "DSA", "difficulty": "Hard", "correct": False,
                "selected_answer": "B", "correct_answer": "A"} for _ in range(5)]
result0 = analyze_performance(answers_0_5)
check("Weak topics detected",        "Trees" in result0["weak_topics"], True)
check("Recommendations not empty",   len(result0["recommendations"]) > 0, True)

print()
print("=" * 50)
print("TEST 3: Security - Password Hashing")
print("=" * 50)
from app.core.security import hash_password, verify_password

h = hash_password("mysecretpassword123")
check("Hash is not plaintext",       h != "mysecretpassword123", True)
check("Correct password verifies",   verify_password("mysecretpassword123", h), True)
check("Wrong password fails",        verify_password("wrongpassword", h), False)

print()
print("=" * 50)
print("TEST 4: JWT Token")
print("=" * 50)
from app.core.security import create_access_token, decode_token

token = create_access_token({"sub": "42"})
check("Token is a string",           isinstance(token, str), True)
payload = decode_token(token)
check("Token decodes correctly",     payload.get("sub"), "42")

print()
print("=" * 50)
print("TEST 5: Demo Questions Bank")
print("=" * 50)
from app.utils.demo_questions import get_demo_questions

qs = get_demo_questions("Machine Learning", "Decision Trees", "Medium", 5)
check("Returns 5 questions",         len(qs), 5)
check("All have question field",     all("question" in q for q in qs), True)
check("All have 4 options",         all(all(k in q for k in ["option_a","option_b","option_c","option_d"]) for q in qs), True)
check("Correct answer is in options",all(q["correct_answer"] in [q["option_a"],q["option_b"],q["option_c"],q["option_d"]] for q in qs), True)
texts = [q["question"] for q in qs]
check("No duplicate questions",      len(texts) == len(set(texts)), True)

fallback_qs = get_demo_questions("Quantum Physics", "Superposition", "Expert", 3)
check("Fallback gives questions for unknown subject", len(fallback_qs) >= 1, True)

print()
print("=" * 50)
print("TEST 6: AI Generator Validation")
print("=" * 50)
from app.services.ai_generator import validate_question

good_q = {"question": "What is 2+2?", "option_a": "3", "option_b": "4",
          "option_c": "5", "option_d": "6", "correct_answer": "4", "difficulty": "Easy"}
check("Valid question passes",       validate_question(good_q), True)

bad_answer = {**good_q, "correct_answer": "100"}
check("Wrong answer fails",          validate_question(bad_answer), False)

missing_field = {"question": "Q", "option_a": "A", "option_b": "B", "correct_answer": "A", "difficulty": "Easy"}
check("Missing options fails",       validate_question(missing_field), False)

print()
print("=" * 50)
print(f"RESULTS: {passed} passed, {failed} failed out of {passed+failed} tests")
print("=" * 50)
