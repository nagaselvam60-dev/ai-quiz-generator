# AI QUIZ GENERATOR & ADAPTIVE LEARNING SYSTEM
## Complete Report Content (10 Pages)

> Font/spacing to apply in Word: Times New Roman — Main headings 16 pt bold,
> Subheadings 14 pt bold, Body 12 pt, Line spacing 1.5, Page numbers bottom.

---

# PAGE 1 — TITLE PAGE

```
        AI QUIZ GENERATOR & ADAPTIVE LEARNING SYSTEM
              A Project Report Submitted in Partial Fulfillment
                 of the Requirements for the Degree of

                    BACHELOR OF TECHNOLOGY
                          in
                    [DEPARTMENT NAME]

                    Submitted by:
                    [YOUR NAME]
                    Register No: [REG NO]

                    Under the Guidance of:
                    [FACULTY GUIDE NAME]

                    [DEPARTMENT NAME]
                    [COLLEGE NAME]
                    [CITY]
                    Academic Year: 2025 – 2026
```

---

# PAGE 2 — ABSTRACT

The AI Quiz Generator and Adaptive Learning System is a full-stack web application that
automates the creation of multiple-choice question (MCQ) assessments using artificial
intelligence and dynamically adjusts question difficulty based on the learner's real-time
performance. Traditional quiz systems rely on static, pre-defined question banks with fixed
difficulty levels, which fail to accommodate individual learning pace and often result in
either frustration (when questions are too difficult) or boredom (when they are too easy).

This project addresses that limitation by integrating the Google Gemini 1.5 Flash large
language model to generate context-aware questions from a selected subject, topic, and
optionally from the learner's own study material such as PDF, DOCX, or plain-text
documents. A custom adaptive difficulty algorithm classifies questions into four tiers
(Easy, Medium, Hard, Expert) and promotes or demotes the difficulty level after every
answered question depending on correctness. A performance analysis module computes
topic-wise and difficulty-wise accuracy and produces an analytical report containing
identifiable strengths, weaknesses, and personalized revision recommendations.

The system is implemented using FastAPI (Python 3.13) as the backend REST framework,
React 18 with Vite and Tailwind CSS as the frontend, and an SQLAlchemy-based database with
PostgreSQL and automatic SQLite fallback. Secure JWT authentication with bcrypt password
hashing protects user data. A graceful fallback mechanism using a built-in question bank
ensures the application remains fully functional even without an active AI API key.

The expected outcome is an intelligent, self-adjusting assessment tool that reduces manual
question-paper preparation effort and provides measurable, analytics-driven feedback for
effective learning.

**Keywords:** Artificial Intelligence, Large Language Model, Gemini API, Adaptive Learning,
Difficulty Algorithm, FastAPI, React, Performance Analytics.

---

# PAGE 3 — INTRODUCTION

## 3.1 What is an AI Quiz Generator

An AI Quiz Generator is a software system that employs artificial intelligence, specifically
large language models (LLMs), to automatically construct assessment questions from a given
topic or source document, rather than depending on a manually curated static question bank.

## 3.2 Existing System

In the conventional approach, question papers are prepared manually by educators and stored
in fixed question banks. The salient limitations of this approach are:

1. Static content — a fixed set of questions is reused for every learner.
2. Uniform difficulty — all students receive the same level regardless of capability.
3. No adaptiveness — the paper cannot respond to a learner's ongoing performance.
4. Absence of granular analytics — results are typically limited to a total score, with no
   topic-wise or difficulty-wise breakdown.
5. No source-material integration — a learner's own notes or textbook cannot be directly
   converted into assessment questions.

## 3.3 Proposed System

The proposed system overcomes the above limitations through the following mechanisms:

1. AI-driven generation — the Gemini LLM creates fresh MCQs with four options, a correct
   answer, and an explanation for the selected subject and topic.
2. Document ingestion — PDF, DOCX, and TXT study material uploaded by the learner is parsed
   and used as the context for question generation.
3. Adaptive difficulty — the next question's difficulty is decided dynamically from the
   correctness of the previous response using a four-tier algorithm.
4. Analytics engine — a performance analyzer generates topic-wise accuracy, difficulty-wise
   accuracy, strengths, weaknesses, and revision recommendations, visualized through charts.
5. Resilience — when the AI service is unavailable, the system seamlessly serves questions
   from a local demo bank, guaranteeing uninterrupted operation.

---

# PAGE 4 — OBJECTIVES AND PROJECT OVERVIEW

## 4.1 Objectives

- To automate MCQ generation from a subject and topic using a large language model.
- To generate questions from the learner's own uploaded study material (PDF/DOCX/TXT).
- To implement an adaptive difficulty engine that adjusts question level in real time.
- To provide performance analytics with topic-wise and difficulty-wise breakdown.
- To ensure secure multi-user access through JWT-based authentication.
- To remain fully functional without AI dependency through a fallback question bank.

## 4.2 Main Features

| Feature | Description |
|---------|-------------|
| AI Question Generation | Gemini 1.5 Flash creates MCQs with explanations |
| Adaptive Difficulty | Easy → Medium → Hard → Expert adjustment per answer |
| Document Upload | PDF/DOCX/TXT parsed and used as question context |
| Performance Report | Score, charts, strengths, weaknesses, recommendations |
| Custom Subjects | Learner may add subjects beyond the 40+ predefined ones |
| Attempt History | All past quizzes stored with re-viewable analysis |
| Secure Auth | JWT tokens with bcrypt password hashing |
| Offline Resilience | Built-in demo bank used when AI is unavailable |

## 4.3 How the System Works (End-to-End)

A learner registers and logs in, receiving a JWT token. From the dashboard the learner
selects a subject and topic, chooses the number of questions (5, 10, 15, or 20) and a
starting difficulty level, and optionally uploads or pastes study material. The backend
forwards this to the Gemini API, receives a validated JSON array of questions, and stores
them. The learner answers each MCQ; after every submission the adaptive engine inspects the
previous attempt's accuracy and selects the next question at the promoted or demoted
difficulty tier. Upon completion the performance analyzer aggregates the stored answers and
produces a structured report rendered as charts alongside the stored history.

---

# PAGE 5 — CONCEPTS AND TECHNOLOGIES USED

## 5.1 Artificial Intelligence Concepts

**Large Language Model Inference.** Question generation is performed by prompting Google
Gemini 1.5 Flash with a structured instruction specifying the subject, topic, required
question count, and target difficulty tier, along with a strict output schema.

**Prompt Engineering and Constrained Output.** The prompt mandates a JSON array where each
element contains question_text, option_a, option_b, option_c, option_d, correct_answer,
explanation, and difficulty. Output validation checks that all four options exist and that
the correct answer is among them; malformed items are rejected and regenerated.

**AI Resilience (Fallback Inference).** If no API key is configured or the request fails,
the generator falls back to a deterministic local question bank, preserving functionality.

## 5.2 Adaptive Difficulty Algorithm

Questions are ordered in four tiers: Easy (1) → Medium (2) → Hard (3) → Expert (4).

Algorithm:
```
current_difficulty = starting_difficulty
for each question in session:
    present question at current_difficulty
    if answer is correct:
        current_difficulty = min(current_difficulty + 1, 4)   # promote
    else:
        current_difficulty = max(current_difficulty - 1, 1)   # demote
    exclude used questions from future selection
```

This produces a monotonic adjustment bounded at both ends and prevents question repetition
within the session.

## 5.3 Programming and Architectural Concepts

- **RESTful API architecture** — HTTP resources for auth, subjects, materials, quizzes,
  attempts, reports, and dashboard.
- **ORM abstraction** — SQLAlchemy models map Python classes to relational tables
  (users, subjects, topics, study_materials, quizzes, questions, quiz_attempts,
  user_answers).
- **Stateless token authentication** — JWT bearer tokens carry the user identity; bcrypt
  one-way hashing stores passwords.
- **Single-page application with client routing** — React Router manages protected and
  public routes; Axios interceptors attach the token to every request.
- **Component-based UI with utility-first styling** — Tailwind CSS and reusable card/badge
  components.

---

# PAGE 6 — SOFTWARE AND HARDWARE REQUIREMENTS

## 6.1 Software Requirements

| Component | Specification |
|-----------|---------------|
| Operating System | Windows 10/11 (64-bit) or equivalent Linux/macOS |
| Programming Language | Python 3.13 |
| Backend Framework | FastAPI 0.115+ with Uvicorn ASGI server |
| ORM / Database | SQLAlchemy 2.x; PostgreSQL 14+ (auto fallback to SQLite 3) |
| Frontend Language | JavaScript (ES2022), React 18 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3, Recharts (charting) |
| HTTP Client | Axios |
| Authentication | python-jose (JWT), passlib + bcrypt |
| AI SDK | google-generativeai (Google Gemini 1.5 Flash) |
| Document Parsing | PyMuPDF (PDF), python-docx (DOCX) |
| IDE / Editor | Visual Studio Code / Qoder IDE |
| Runtime | Node.js 18+ |

## 6.2 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 / equivalent | Intel Core i5 or higher |
| RAM | 4 GB | 8 GB |
| Storage | 10 GB free | 20 GB SSD |
| Display | 1366 × 768 | 1920 × 1080 |
| Internet | 1 Mbps (required only for Gemini API) | 5 Mbps+ |

Note: the application runs entirely offline when the built-in demo question bank is used.

---

# PAGE 7 — SYSTEM DESIGN AND WORKFLOW

## 7.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION TIER   React 18 + Vite + Tailwind CSS         │
│  Pages: Login, Register, Dashboard, CreateQuiz, Quiz,       │
│         Results, History, Profile                           │
└───────────────────────────┬─────────────────────────────────┘
                            │  Axios REST calls + JWT header
┌───────────────────────────▼─────────────────────────────────┐
│  APPLICATION TIER    FastAPI (Python 3.13) + Uvicorn        │
│  Routes: auth, subjects, materials, quizzes, attempts,      │
│          reports, dashboard                                 │
│  Services: ai_generator, adaptive_engine,                   │
│            performance_analyzer, document_parser            │
└──────────┬──────────────────────────────────────┬───────────┘
           │ SQLAlchemy ORM                       │ HTTPS
┌──────────▼──────────────┐          ┌────────────▼────────────┐
│  DATA TIER              │          │  EXTERNAL AI SERVICE    │
│  PostgreSQL / SQLite    │          │  Google Gemini 1.5 Flash│
│  8 relational tables    │          │  (with local fallback)  │
└─────────────────────────┘          └─────────────────────────┘
```

## 7.2 Module Dependency Diagram

```
main.py
 ├── core/      config.py · database.py · security.py
 ├── models/    user · subject · topic · study_material
 │              quiz · question · quiz_attempt · user_answer
 ├── schemas/   user · subject · quiz · report
 ├── api/routes auth · subjects · materials · quizzes
 │              attempts · reports · dashboard
 └── services/  ai_generator → document_parser
               adaptive_engine
               performance_analyzer
 utils/         demo_questions
```

## 7.3 Input – Processing – Output

| Stage | Description |
|-------|-------------|
| **Input** | Subject, topic, question count, starting difficulty, optional PDF/DOCX/TXT material, learner responses |
| **Processing** | Document text extraction → prompt construction → Gemini inference → JSON validation → persistence → adaptive selection → correctness evaluation → statistical aggregation |
| **Output** | Generated quiz, per-question difficulty feedback, score percentage, topic-wise and difficulty-wise analytics, strengths/weaknesses list, recommendations, stored attempt history |

## 7.4 Workflow Diagram

```
Register/Login ──> Dashboard ──> Create Quiz
                                     │
             (Subject + Topic + Count + Difficulty + Material)
                                     │
                              Document Parser ──> extracted text
                                     │
                            AI Generator ──> Gemini API
                                     │            │
                                     │      (fail ──> Demo Bank)
                                     ▼
                              Questions Stored
                                     │
                            Start Attempt (adaptive)
                                     │
                    Answer Q ──> Check ──> Adjust Difficulty
                     ▲                       │
                     └────── Next Q ◄────────┘
                                     │
                              Complete Attempt
                                     │
                    Performance Analyzer ──> Report + Charts
                                     │
                    Strengths · Weaknesses · Recommendations
                                     │
                              Saved to History
```

---

# PAGE 8 — IMPLEMENTATION AND PROGRAM DESCRIPTION

## 8.1 Project Structure

```
backend/app/
  main.py                        FastAPI application entry point
  core/    config.py             Environment settings and CORS
         database.py             Engine, session, fallback to SQLite
         security.py             JWT encode/decode, bcrypt hashing
  models/  8 SQLAlchemy entities
  schemas/ Pydantic request/response contracts
  api/routes/  7 route modules
  services/    ai_generator, adaptive_engine,
               performance_analyzer, document_parser
  utils/       demo_questions.py
frontend/src/
  App.jsx · api/client.js · contexts/AuthContext.jsx
  components/ · pages/ (8 page components)
```

## 8.2 Authentication Module (`core/security.py`, `routes/auth.py`)

Registration hashes the password using bcrypt and persists the user. Login verifies the
hash and issues a signed JWT containing the user identifier with an expiry window. A shared
dependency extracts and validates the bearer token from the Authorization header on every
protected route, so unauthenticated requests are rejected with HTTP 401. On the frontend,
an Axios interceptor attaches the stored token automatically, and route guards redirect
unauthenticated users to the login screen.

## 8.3 AI Generator Module (`services/ai_generator.py`)

The generator builds a prompt containing the subject, topic, desired question count, and
difficulty tier, appended with an instruction to return only a JSON array of MCQ objects.
If a study material identifier or pasted text is supplied, the extracted document text is
inserted as grounding context. The response is parsed and each item is validated: all four
options must be present, the declared correct answer must match one of them, and difficulty
must belong to the permitted set. Valid questions are persisted to the `questions` table.
On missing API key, malformed key, network failure, or invalid response, the module
delegates to `utils/demo_questions.py`, which returns deterministic questions filtered by
subject and difficulty.

## 8.4 Document Parser Module (`services/document_parser.py`)

For PDF, the module extracts page text using PyMuPDF; for DOCX it iterates paragraphs via
python-docx; for TXT it reads the decoded content directly. Extracted text is normalized and
length-bounded before being passed as AI context. Upload validation enforces the allowed
extension set and a maximum file size limit.

## 8.5 Adaptive Engine Module (`services/adaptive_engine.py`)

The engine maintains the ordered tier list [Easy, Medium, Hard, Expert]. When the next
question is requested, it computes the current tier from the attempt record, inspects the
most recent answer, and moves the index +1 for correct or −1 for incorrect, clamped to the
list bounds. It then queries an unattempted question at that tier for the quiz, guaranteeing
no repetition within the session, and updates `current_difficulty` on the attempt.

## 8.6 Performance Analyzer Module (`services/performance_analyzer.py`)

On attempt completion, the analyzer aggregates the stored answers: it computes total score
and percentage, groups accuracy per topic and per difficulty tier, and derives the highest
and lowest performing groups. Thresholds convert these statistics into human-readable
strengths, weaknesses, and actionable revision recommendations returned in the report schema.

## 8.7 Key API Implementation Notes

| Endpoint | Behaviour |
|----------|-----------|
| POST /api/quizzes/generate | Creates quiz + N questions; returns quiz id |
| GET /api/quizzes/{id} | Returns questions with correct answers withheld |
| POST /api/attempts/{id}/answer | Validates choice, stores result, returns correctness + explanation + next difficulty |
| POST /api/attempts/{id}/complete | Finalizes score and percentage, sets status completed |
| GET /api/reports/{attempt_id} | Returns aggregated analytics payload |

---

# PAGE 9 — OUTPUT, TESTING AND CONCLUSION

## 9.1 Output Description

The application output comprises the following verified screens:

1. **Registration / Login** — form validation, success toast, JWT-based session creation.
2. **Dashboard** — six analytics cards (total quizzes, average score, best score, questions
   attempted, strongest topic, focus area), popular topic tiles, and recent quiz rows.
3. **Create Quiz** — nine subject categories with 40+ predefined subjects, custom subject
   entry, topic input with per-subject suggestions, three source modes (AI Knowledge Base,
   Paste Notes, Upload Document), question count selector (5/10/15/20), and starting
   difficulty selector with an animated generation progress modal.
4. **Quiz Session** — single question view with four options, immediate correct/incorrect
   colour feedback, explanation display, live difficulty badge, and progress indicator.
5. **Performance Report** — score percentage, topic-wise and difficulty-wise charts,
   strengths and weakness lists, and personalized recommendations.
6. **History** — previously completed attempts with score and analysis links.

*(Insert the 10 screenshots listed in REPORT_BLUEPRINT.md — Section B here as Fig 9.1 – 9.10.)*

## 9.2 Test Cases

| TC# | Scenario | Input | Expected Output | Status |
|-----|----------|-------|-----------------|--------|
| TC1 | Valid registration | New email + password | Account created, redirected to dashboard | Pass |
| TC2 | Invalid login | Incorrect password | Error message "Invalid email or password" | Pass |
| TC3 | Quiz generation | Python / Functions / 5 questions | 5 validated MCQs generated | Pass |
| TC4 | Adaptive promotion | Correct answer at Easy tier | Next question served at Medium | Pass |
| TC5 | Adaptive demotion | Incorrect answer at Hard tier | Next question served at Medium | Pass |
| TC6 | Tier boundary | Correct answer at Expert tier | Difficulty remains Expert (capped) | Pass |
| TC7 | Demo fallback mode | API key absent | Questions served from built-in bank | Pass |
| TC8 | Document upload | Valid PDF within size limit | Text extracted and used as context | Pass |
| TC9 | Invalid file type | .jpg or .exe upload | Rejected with format error message | Pass |
| TC10 | Unauthenticated access | Protected route without token | Redirected to login screen | Pass |

## 9.3 Conclusion

The AI Quiz Generator and Adaptive Learning System successfully demonstrates the
integration of a large language model with a rule-based adaptive algorithm to produce a
self-adjusting assessment platform. All stated objectives were achieved: AI-driven question
generation from topics and from learner-supplied documents, a functioning four-tier adaptive
difficulty engine, analytics reporting with topic-wise and difficulty-wise granularity,
secure JWT-based multi-user authentication, and dependable offline operation through a
fallback question bank. The application was validated through unit tests covering the
adaptive logic, security functions, and question validation, along with end-to-end manual
testing of the complete user flow. The system reduces the manual effort of question-paper
preparation and delivers measurable, individualized learning feedback.

## 9.4 Future Enhancements

- Additional question formats: fill-in-the-blank, matching, and subjective answers with AI evaluation.
- Spaced-repetition scheduling to recommend revision timing per weak topic.
- Longitudinal learner profiling with cross-quiz trend analysis.
- Exportable reports in PDF and printable question papers for educators.
- Support for image-based questions and mathematical notation rendering.
- Multi-language question generation and real-time collaborative quizzes.

---

# PAGE 10 — REFERENCES

[1] Google LLC, "Gemini API — Large Language Model Documentation," Google AI for
    Developers, 2024. [Online]. Available: https://ai.google.dev/docs

[2] FastAPI Documentation, "FastAPI — Modern Web Framework for Building APIs," 2024.
    [Online]. Available: https://fastapi.tiangolo.com

[3] SQLAlchemy Documentation, "SQLAlchemy 2.0 ORM," 2024. [Online]. Available:
    https://docs.sqlalchemy.org

[4] React Documentation, "React 18 — Library for Web and Native User Interfaces," 2024.
    [Online]. Available: https://react.dev

[5] Vite Documentation, "Vite — Next Generation Frontend Tooling," 2024. [Online].
    Available: https://vitejs.dev

[6] Tailwind CSS, "Tailwind CSS Documentation," 2024. [Online]. Available:
    https://tailwindcss.com/docs

[7] jsonsec, "python-jose — JSON Object Signing and Encryption for Python," 2024.
    [Online]. Available: https://python-jose.readthedocs.io

[8] Passlib, "Passlib Password Hashing Library — bcrypt Scheme," 2024. [Online].
    Available: https://passlib.readthedocs.io

[9] Artifx Software, "PyMuPDF — High Performance PDF Library for Python," 2024. [Online].
    Available: https://pymupdf.readthedocs.io

[10] python-docx Development Team, "python-docx — Create and Update Word Files," 2024.
     [Online]. Available: https://python-docx.readthedocs.io

[11] Recharts, "Recharts — Redefined Chart Library for React," 2024. [Online]. Available:
     https://recharts.org

[12] Uvicorn, "Uvicorn — ASGI Web Server for Python," 2024. [Online]. Available:
     https://www.uvicorn.org

[13] PostgreSQL Global Development Group, "PostgreSQL Documentation," 2024. [Online].
     Available: https://www.postgresql.org/docs

[14] SQLite Consortium, "SQLite Documentation," 2024. [Online]. Available:
     https://www.sqlite.org/docs.html

[15] Axoss Development Team, "Axios — Promise Based HTTP Client," 2024. [Online].
     Available: https://axios-http.com/docs
