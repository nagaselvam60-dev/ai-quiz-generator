# AI QUIZ GENERATOR – 10-PAGE REPORT BLUEPRINT

## SECTION A: Report-Writing Prompt (Paste into Kimi AI / any AI writer)

---

You are an academic report writer. Generate a complete, professional 10-page project
report titled "AI Quiz Generator & Adaptive Learning System" for a university student.
Use real, accurate technical details (provided below). Do NOT invent unrelated features.

### STUDENT / COLLEGE PLACEHOLDERS (fill before submission):

- Student Name: [YOUR NAME]
- Register Number: [REG NO]
- Department: [DEPARTMENT]
- College Name: [COLLEGE NAME]
- Guide: [FACULTY GUIDE NAME]
- Academic Year: [2025–2026]

### REAL PROJECT DETAILS (base every page on this — do not contradict):

- Purpose: Web app that generates AI-powered multiple-choice questions (MCQs) and adapts
  question difficulty to the user's live performance.
- Problem with existing systems: static question banks, fixed difficulty, no per-topic
  analytics, no way to build quizzes from a student's own study material.
- AI used: Google Gemini 1.5 Flash API generates questions from a subject + topic (and
  optional uploaded document). If no API key / API fails, the app falls back to a built-in
  demo question bank so it still works offline.
- Adaptive difficulty logic: 4 tiers — Easy → Medium → Hard → Expert. Correct answer raises
  difficulty by one tier; wrong answer lowers it by one tier; capped at ends. Questions are
  never repeated within one quiz session.
- Document upload: PDF / DOCX / TXT parsed (PyMuPDF for PDF, python-docx for DOCX), text
  passed to the AI for question generation.
- Analytics/Reports: score %, topic-wise and difficulty-wise accuracy, strengths, weaknesses,
  recommendations, shown as charts (Recharts).
- Backend: Python 3.13, FastAPI, SQLAlchemy ORM, Uvicorn server.
- Database: PostgreSQL with automatic fallback to SQLite (quiz_db.sqlite).
- Auth: JWT (python-jose) + bcrypt password hashing (passlib).
- Frontend: React 18, Vite, Tailwind CSS, Recharts, Axios, React Router, react-hot-toast.
- AI/parse libraries: google-generativeai, PyMuPDF, python-docx.
- Core modules: ai_generator, adaptive_engine, performance_analyzer, document_parser.
- Main data models/tables: users, subjects, topics, study_materials, quizzes, questions,
  quiz_attempts, user_answers.
- User flow: Register/Login → Dashboard → Create Quiz (pick subject+topic, set #questions
  [5/10/15/20] and starting difficulty, optional material) → Generate Quiz → Answer MCQs
  adaptively → Submit → Performance Report → History.
- API endpoints:
  - POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
  - GET /api/subjects/, POST /api/subjects/custom
  - POST /api/materials/upload, POST /api/materials/text
  - POST /api/quizzes/generate, GET /api/quizzes/{id}
  - POST /api/attempts/start, POST /api/attempts/{id}/answer, POST /api/attempts/{id}/complete
  - GET /api/reports/{attempt_id}, GET /api/dashboard, GET /api/history

### REPORT STRUCTURE — 10 pages:

**Page 1 – Title Page:** Project title, student name, register number, department, college
name, guide, and academic year. (Centered, formal layout.)

**Page 2 – Abstract:** 200–250 words covering project purpose, how AI is used, the quiz
generation + adaptive process, and expected outcome.

**Page 3 – Introduction:** What an AI Quiz Generator is, limitations of the existing system,
and the proposed system (clearly contrast them).

**Page 4 – Objectives and Project Overview:** Bullet-point objectives, main features table,
and a plain-language description of how the system works end to end.

**Page 5 – Concepts and Technologies Used:** AI concepts (LLM-based question generation,
prompt design, JSON output validation), adaptive difficulty algorithm (explain the tier
up/down rule step by step), and programming concepts (REST API, ORM, JWT auth).

**Page 6 – Software and Hardware Requirements:** A Software table (OS, language, framework,
libraries, IDE, database) and a Hardware table (min RAM, CPU, storage, internet) with
realistic values.

**Page 7 – System Design and Workflow:** Describe the 3-tier architecture (React frontend ↔
FastAPI backend ↔ database + Gemini AI), give an Input–Processing–Output breakdown, and
provide a workflow diagram plus a component/module diagram.

**Page 8 – Implementation and Program Description:** Walk through the main modules
(ai_generator, adaptive_engine, performance_analyzer, document_parser) and the key API
routes, explaining the quiz-generation logic and the answer-checking/adaptivity flow.

**Page 9 – Output, Testing and Conclusion:** UI screenshots, Test Case table (minimum 6 rows
covering adaptive logic, auth, fallback mode and upload), Conclusion, and Future Enhancements.

**Page 10 – References:** IEEE-style numbered references for Google Gemini docs, FastAPI
docs, React/Vite docs, SQLAlchemy, python-jose/passlib, PyMuPDF/python-docx, and tutorials.

### FORMATTING RULES (apply throughout):

- Main headings: 16 pt bold; Subheadings: 14 pt bold; Body text: 12 pt.
- Font: Times New Roman; Line spacing: 1.5; Left-aligned body paragraphs.
- Page numbers at the bottom of every page except the Title Page.
- Formal academic tone, no marketing language, no emojis.
- Use tables where a table is asked for. Keep each page roughly one printed page of content.
- Insert the placeholder fields ([YOUR NAME], etc.) unchanged so they can be filled.

Now write the full report page by page, labeling each section "Page 1", "Page 2", etc.

---

## SECTION B: Screenshot Plan (for Page 9)

| # | Screen / URL | What to Capture | Caption |
|---|---|---|---|
| 1 | `/register` | Registration form filled | Fig 9.1 – User Registration Screen |
| 2 | `/login` | Login form with credentials | Fig 9.2 – Secure Login (JWT Authentication) |
| 3 | `/dashboard` | Stats cards + recent quizzes (after 1–2 attempts) | Fig 9.3 – Learner Dashboard with Performance Analytics |
| 4 | `/create-quiz` | Subject pills + topic + settings selected | Fig 9.4 – Quiz Configuration (Subject, Topic, Difficulty) |
| 5 | `/create-quiz` (upload) | Green "uploaded" badge after PDF/DOCX upload | Fig 9.5 – Study Material Upload & Parsing |
| 6 | Generation modal | "Generating AI Questions" spinner | Fig 9.6 – AI Question Generation in Progress |
| 7 | `/quiz/:id` | Question with 4 options, one selected | Fig 9.7 – Adaptive Quiz – Answering an MCQ |
| 8 | `/quiz/:id` (feedback) | Correct/incorrect colored + difficulty badge | Fig 9.8 – Real-time Feedback & Difficulty Change |
| 9 | `/results/:id` | Score + topic/difficulty charts | Fig 9.9 – Performance Report with Analytics |
| 10 | `/history` | Past attempts list | Fig 9.10 – Quiz Attempt History |

Tip: Take 1–2 quiz attempts first so dashboard/reports aren't empty.
Use Win+Shift+S (Snipping Tool) at consistent window size.

---

## SECTION C: Test Cases (for Page 9)

| TC# | Scenario | Input | Expected Output | Actual | Status |
|-----|----------|-------|-----------------|--------|--------|
| TC1 | Valid registration | New email + password | Account created, redirect to dashboard | | Pass |
| TC2 | Invalid login | Wrong password | Toast: "Invalid email or password" | | Pass |
| TC3 | Quiz generation | Subject=Python, Topic=Functions, 5 Qs | 5 MCQs generated (AI or demo) | | Pass |
| TC4 | Adaptive (correct) | Answer Easy question correctly | Next question → Medium difficulty | | Pass |
| TC5 | Adaptive (wrong) | Answer Hard question incorrectly | Next question → Medium difficulty | | Pass |
| TC6 | Demo mode (no key) | GEMINI_API_KEY empty | Built-in demo question bank used | | Pass |
| TC7 | Document upload | Upload valid .pdf | File parsed, questions from text | | Pass |
| TC8 | Invalid file type | Upload .exe/.jpg | Rejected with "Only PDF/DOCX/TXT" | | Pass |
| TC9 | Report | Complete a quiz | Score %, charts, strengths/weaknesses | | Pass |
| TC10 | JWT expiry | Access protected route after expiry | Redirected to login | | Pass |

Fill "Actual" column by running each case on the live app.

---

## SECTION D: Quick Checklist Before Submission

- [ ] Fill [YOUR NAME], [REG NO], [DEPARTMENT], [COLLEGE], [GUIDE], [YEAR]
- [ ] All 10 pages present with headings
- [ ] Times New Roman, 16/14/12 pt sizing hierarchy
- [ ] Line spacing 1.5 throughout
- [ ] Page numbers at bottom (not on Page 1)
- [ ] Tables for Features, Requirements, Test Cases, References
- [ ] Diagrams (workflow + architecture) for Page 7
- [ ] 10 screenshots inserted on Page 9
- [ ] No AI-generated marketing fluff or emojis
