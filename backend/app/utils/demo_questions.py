"""
Demo question bank for fallback mode (no AI API key needed).
Covers major subjects with Easy, Medium, Hard, Expert difficulty levels.
"""

DEMO_QUESTIONS = {
    "Python": {
        "Functions": [
            {
                "question": "What keyword is used to define a function in Python?",
                "options": ["func", "def", "define", "function"],
                "correct_answer": "def",
                "explanation": "In Python, the `def` keyword is used to define a function.",
                "difficulty": "Easy"
            },
            {
                "question": "What does *args allow in a Python function?",
                "options": ["Keyword arguments only", "A fixed number of arguments", "Variable positional arguments", "Default argument values"],
                "correct_answer": "Variable positional arguments",
                "explanation": "*args allows a function to accept any number of positional arguments as a tuple.",
                "difficulty": "Medium"
            },
            {
                "question": "What is a closure in Python?",
                "options": ["A function that closes the program", "A nested function that remembers the enclosing scope's variables", "A function with no return value", "A function that cannot be called"],
                "correct_answer": "A nested function that remembers the enclosing scope's variables",
                "explanation": "A closure is a nested function that captures and remembers variables from its enclosing lexical scope.",
                "difficulty": "Hard"
            },
            {
                "question": "What is the output of: (lambda x, y: x**y)(2, 10)?",
                "options": ["20", "210", "1024", "12"],
                "correct_answer": "1024",
                "explanation": "The lambda computes 2**10 = 1024.",
                "difficulty": "Expert"
            },
            {
                "question": "What does the `return` statement do in a function?",
                "options": ["Exits the program", "Exits the function and returns a value", "Prints output", "Restarts the function"],
                "correct_answer": "Exits the function and returns a value",
                "explanation": "The `return` statement terminates the function and optionally sends a value back to the caller.",
                "difficulty": "Easy"
            }
        ],
        "Data Types": [
            {
                "question": "Which of the following is an immutable data type in Python?",
                "options": ["list", "dict", "set", "tuple"],
                "correct_answer": "tuple",
                "explanation": "Tuples are immutable in Python; their elements cannot be changed after creation.",
                "difficulty": "Easy"
            },
            {
                "question": "What is the result of type(3.14).__name__?",
                "options": ["int", "float", "double", "number"],
                "correct_answer": "float",
                "explanation": "3.14 is a floating-point literal, so its type is `float`.",
                "difficulty": "Medium"
            },
            {
                "question": "What does the `id()` function return in Python?",
                "options": ["The hash value of an object", "The memory address of an object", "The type of an object", "The size of an object"],
                "correct_answer": "The memory address of an object",
                "explanation": "`id()` returns the identity (memory address) of an object, unique per object lifetime.",
                "difficulty": "Hard"
            },
            {
                "question": "What is the difference between `is` and `==` in Python?",
                "options": ["No difference", "`is` checks value equality, `==` checks identity", "`is` checks identity, `==` checks value equality", "`is` is faster"],
                "correct_answer": "`is` checks identity, `==` checks value equality",
                "explanation": "`is` checks if two variables point to the same object in memory, while `==` checks if their values are equal.",
                "difficulty": "Medium"
            },
            {
                "question": "What is a frozen set in Python?",
                "options": ["A set that is sorted", "An immutable version of a set", "A set frozen in memory", "A set restricted to numbers"],
                "correct_answer": "An immutable version of a set",
                "explanation": "A frozenset is an immutable, hashable version of a set that cannot be modified after creation.",
                "difficulty": "Hard"
            }
        ]
    },
    "Machine Learning": {
        "Decision Trees": [
            {
                "question": "Which criterion is commonly used to split nodes in a decision tree?",
                "options": ["Information Gain", "Gradient Descent", "Euclidean Distance", "Learning Rate"],
                "correct_answer": "Information Gain",
                "explanation": "Information Gain measures the reduction in entropy after splitting the dataset on a feature.",
                "difficulty": "Medium"
            },
            {
                "question": "What is overfitting in a decision tree?",
                "options": ["The tree is too shallow", "The tree memorizes training data and performs poorly on new data", "The tree ignores noise", "The tree has too few leaves"],
                "correct_answer": "The tree memorizes training data and performs poorly on new data",
                "explanation": "Overfitting occurs when a model is too complex, capturing noise in the training data, leading to poor generalization.",
                "difficulty": "Easy"
            },
            {
                "question": "What is the purpose of pruning in decision trees?",
                "options": ["To add more nodes", "To reduce overfitting by removing branches", "To increase training accuracy", "To split leaf nodes further"],
                "correct_answer": "To reduce overfitting by removing branches",
                "explanation": "Pruning reduces the size of the tree by removing sections that provide little predictive power, improving generalization.",
                "difficulty": "Medium"
            },
            {
                "question": "What is the Gini Impurity used for in decision trees?",
                "options": ["Measuring model speed", "Measuring node impurity to determine the best split", "Calculating euclidean distances", "Regularizing the model"],
                "correct_answer": "Measuring node impurity to determine the best split",
                "explanation": "Gini Impurity measures how often a randomly chosen element would be incorrectly classified, guiding split selection.",
                "difficulty": "Hard"
            },
            {
                "question": "In a Random Forest, how do individual trees differ from each other?",
                "options": ["They use different loss functions", "They are trained on random subsets of data and features", "They all see the full dataset", "They use different activation functions"],
                "correct_answer": "They are trained on random subsets of data and features",
                "explanation": "Random Forests use bagging (bootstrap aggregating) and random feature selection to create diverse, uncorrelated trees.",
                "difficulty": "Expert"
            }
        ],
        "Classification": [
            {
                "question": "Which algorithm is commonly used for binary classification?",
                "options": ["Logistic Regression", "Linear Regression", "K-Means", "PCA"],
                "correct_answer": "Logistic Regression",
                "explanation": "Logistic Regression is a statistical model used for binary classification, outputting probabilities.",
                "difficulty": "Easy"
            },
            {
                "question": "What does precision measure in a classification model?",
                "options": ["True Positives / (True Positives + False Negatives)", "True Positives / (True Positives + False Positives)", "Accuracy of predictions", "Number of correct predictions"],
                "correct_answer": "True Positives / (True Positives + False Positives)",
                "explanation": "Precision measures the ratio of correctly predicted positive cases to all predicted positives.",
                "difficulty": "Medium"
            },
            {
                "question": "What is the F1-Score?",
                "options": ["Geometric mean of precision and recall", "Harmonic mean of precision and recall", "Arithmetic mean of precision and recall", "Sum of precision and recall"],
                "correct_answer": "Harmonic mean of precision and recall",
                "explanation": "The F1-Score is the harmonic mean of precision and recall, balancing both metrics into a single score.",
                "difficulty": "Medium"
            },
            {
                "question": "What is the ROC-AUC score used for?",
                "options": ["Measuring regression accuracy", "Evaluating classification model performance across thresholds", "Calculating model training time", "Selecting optimal features"],
                "correct_answer": "Evaluating classification model performance across thresholds",
                "explanation": "ROC-AUC (Receiver Operating Characteristic - Area Under Curve) measures a classifier's ability to discriminate between classes at various threshold settings.",
                "difficulty": "Hard"
            },
            {
                "question": "Which method addresses class imbalance in classification?",
                "options": ["Gradient clipping", "SMOTE (Synthetic Minority Oversampling Technique)", "Batch normalization", "L2 regularization"],
                "correct_answer": "SMOTE (Synthetic Minority Oversampling Technique)",
                "explanation": "SMOTE generates synthetic samples for the minority class to balance the dataset and improve classifier performance.",
                "difficulty": "Expert"
            }
        ]
    },
    "DBMS": {
        "Normalization": [
            {
                "question": "What is the purpose of database normalization?",
                "options": ["To increase data redundancy", "To eliminate data redundancy and ensure data integrity", "To speed up queries", "To encrypt data"],
                "correct_answer": "To eliminate data redundancy and ensure data integrity",
                "explanation": "Normalization organizes database tables to reduce data redundancy and improve data integrity.",
                "difficulty": "Easy"
            },
            {
                "question": "A table is in 2NF when:",
                "options": ["It has no multi-valued dependencies", "It is in 1NF and all non-key attributes are fully dependent on the primary key", "It has no transitive dependencies", "It has minimal attributes"],
                "correct_answer": "It is in 1NF and all non-key attributes are fully dependent on the primary key",
                "explanation": "Second Normal Form (2NF) requires 1NF compliance plus the elimination of partial dependencies.",
                "difficulty": "Medium"
            },
            {
                "question": "What does 3NF eliminate?",
                "options": ["Partial dependencies", "Transitive dependencies", "Multi-valued dependencies", "Join dependencies"],
                "correct_answer": "Transitive dependencies",
                "explanation": "Third Normal Form (3NF) removes transitive dependencies, where non-key attributes depend on other non-key attributes.",
                "difficulty": "Medium"
            },
            {
                "question": "BCNF (Boyce-Codd Normal Form) is a stricter version of which normal form?",
                "options": ["1NF", "2NF", "3NF", "4NF"],
                "correct_answer": "3NF",
                "explanation": "BCNF is a stronger version of 3NF, ensuring that for every functional dependency X→Y, X must be a superkey.",
                "difficulty": "Hard"
            },
            {
                "question": "Which normal form deals with multi-valued dependencies?",
                "options": ["2NF", "3NF", "BCNF", "4NF"],
                "correct_answer": "4NF",
                "explanation": "Fourth Normal Form (4NF) eliminates multi-valued dependencies, where one attribute determines multiple independent attributes.",
                "difficulty": "Expert"
            }
        ]
    },
    "Data Structures": {
        "Arrays": [
            {
                "question": "What is the time complexity of accessing an element in an array by index?",
                "options": ["O(n)", "O(log n)", "O(1)", "O(n²)"],
                "correct_answer": "O(1)",
                "explanation": "Array elements are stored contiguously in memory, allowing O(1) direct access via index.",
                "difficulty": "Easy"
            },
            {
                "question": "What is the worst-case time complexity of binary search on a sorted array?",
                "options": ["O(n)", "O(1)", "O(n²)", "O(log n)"],
                "correct_answer": "O(log n)",
                "explanation": "Binary search halves the search space each step, resulting in O(log n) comparisons in the worst case.",
                "difficulty": "Medium"
            },
            {
                "question": "What is the space complexity of merge sort?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct_answer": "O(n)",
                "explanation": "Merge sort requires O(n) extra space for the temporary arrays used during the merge step.",
                "difficulty": "Hard"
            },
            {
                "question": "In a dynamic array (like Python's list), when the size doubles, what is the amortized time complexity of append?",
                "options": ["O(n)", "O(n²)", "O(1)", "O(log n)"],
                "correct_answer": "O(1)",
                "explanation": "While occasional doubling takes O(n), the amortized cost per append across n operations is O(1).",
                "difficulty": "Expert"
            },
            {
                "question": "Which sorting algorithm has best-case O(n) time complexity?",
                "options": ["Quick Sort", "Merge Sort", "Bubble Sort (optimized)", "Heap Sort"],
                "correct_answer": "Bubble Sort (optimized)",
                "explanation": "An optimized Bubble Sort detects if no swaps occurred in a pass, achieving O(n) on already-sorted input.",
                "difficulty": "Medium"
            }
        ]
    },
    "Cybersecurity": {
        "Phishing Detection": [
            {
                "question": "What is phishing?",
                "options": ["A network scanning technique", "Fraudulent attempt to obtain sensitive information by disguising as a trusted entity", "A type of encryption", "A firewall configuration"],
                "correct_answer": "Fraudulent attempt to obtain sensitive information by disguising as a trusted entity",
                "explanation": "Phishing is a social engineering attack where attackers impersonate legitimate entities to steal credentials or sensitive data.",
                "difficulty": "Easy"
            },
            {
                "question": "Which indicator helps detect a phishing email?",
                "options": ["The email has an attachment", "The sender's email domain doesn't match the claimed organization", "The email is sent in HTML format", "The email contains images"],
                "correct_answer": "The sender's email domain doesn't match the claimed organization",
                "explanation": "Mismatched domains (e.g., security@paypa1.com instead of paypal.com) are a key phishing indicator.",
                "difficulty": "Medium"
            },
            {
                "question": "What is spear phishing?",
                "options": ["Mass phishing targeting everyone", "Targeted phishing aimed at a specific individual or organization", "Phishing via SMS", "Phishing using fake websites only"],
                "correct_answer": "Targeted phishing aimed at a specific individual or organization",
                "explanation": "Spear phishing uses personalized information to craft convincing attacks against specific targets.",
                "difficulty": "Medium"
            },
            {
                "question": "What machine learning technique is commonly used for phishing URL detection?",
                "options": ["K-Means Clustering", "Random Forest Classifier", "Linear Regression", "PCA"],
                "correct_answer": "Random Forest Classifier",
                "explanation": "Random Forests are effective for phishing detection due to their ability to handle high-dimensional URL features.",
                "difficulty": "Hard"
            },
            {
                "question": "Which URL feature is NOT typically used in ML-based phishing detection?",
                "options": ["URL length", "Number of special characters", "Server response time", "Presence of IP address in URL"],
                "correct_answer": "Server response time",
                "explanation": "Server response time is not a static URL feature used in ML models for phishing detection; structural features are preferred.",
                "difficulty": "Expert"
            }
        ]
    },
    "General Knowledge": {
        "General Knowledge": [
            {
                "question": "What is the chemical symbol for gold?",
                "options": ["Gd", "Go", "Au", "Ag"],
                "correct_answer": "Au",
                "explanation": "Gold's symbol Au comes from its Latin name 'Aurum'.",
                "difficulty": "Easy"
            },
            {
                "question": "Which planet is known as the Red Planet?",
                "options": ["Venus", "Jupiter", "Mars", "Saturn"],
                "correct_answer": "Mars",
                "explanation": "Mars appears red due to iron oxide (rust) on its surface.",
                "difficulty": "Easy"
            },
            {
                "question": "What is the speed of light in a vacuum (approximately)?",
                "options": ["3 × 10^6 m/s", "3 × 10^8 m/s", "3 × 10^10 m/s", "3 × 10^4 m/s"],
                "correct_answer": "3 × 10^8 m/s",
                "explanation": "The speed of light in vacuum is approximately 299,792,458 metres per second, or ~3 × 10^8 m/s.",
                "difficulty": "Medium"
            },
            {
                "question": "What is the Turing Test designed to evaluate?",
                "options": ["Internet speed", "Machine's ability to exhibit intelligent behavior indistinguishable from a human", "Cryptographic strength", "Database performance"],
                "correct_answer": "Machine's ability to exhibit intelligent behavior indistinguishable from a human",
                "explanation": "The Turing Test, proposed by Alan Turing, evaluates whether a machine can converse in a way that is indistinguishable from a human.",
                "difficulty": "Medium"
            },
            {
                "question": "Which algorithmic paradigm is used by TCP congestion control?",
                "options": ["Greedy algorithms", "Dynamic programming", "Additive Increase Multiplicative Decrease (AIMD)", "Divide and conquer"],
                "correct_answer": "Additive Increase Multiplicative Decrease (AIMD)",
                "explanation": "TCP uses AIMD to control congestion: gradually increases throughput until congestion is detected, then rapidly decreases it.",
                "difficulty": "Expert"
            }
        ]
    }
}


def get_demo_questions(subject: str, topic: str, difficulty: str, count: int) -> list:
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
