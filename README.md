# 🤖 AI Quiz Generator & Adaptive Learning System

A production-style full-stack web application that generates AI-powered MCQs and adapts difficulty based on user performance.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **AI Question Generation** | Google Gemini API (auto-fallback to built-in demo bank) |
| **Adaptive Difficulty** | Easy → Medium → Hard → Expert based on answers |
| **Document Upload** | PDF, DOCX, TXT — AI generates questions from your material |
| **50+ Subject Categories** | 9 categories, 40+ subjects, expandable with custom subjects |
| **Performance Reports** | Score, topic-wise & difficulty-wise charts, strengths, weaknesses, recommendations |
| **JWT Authentication** | Secure register/login, bcrypt password hashing |
| **Demo Mode** | Fully functional without any AI API key |

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, Recharts, Axios |
| Backend | FastAPI, Python 3.10+ |
| Database | PostgreSQL + SQLAlchemy ORM |
| Auth | JWT (python-jose), bcrypt (passlib) |
| AI | Google Gemini 1.5 Flash API |
| Document Parsing | PyMuPDF (PDF), python-docx (DOCX) |

---

## 📁 Folder Structure

```
event/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI app entry point
│   │   ├── core/
│   │   │   ├── config.py         # Pydantic settings
│   │   │   ├── database.py       # SQLAlchemy engine & session
│   │   │   └── security.py       # JWT & bcrypt
│   │   ├── models/               # SQLAlchemy ORM models (8 models)
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   ├── api/routes/           # API route handlers (7 modules)
│   │   ├── services/
│   │   │   ├── ai_generator.py   # Gemini API + fallback
│   │   │   ├── document_parser.py
│   │   │   ├── adaptive_engine.py
│   │   │   └── performance_analyzer.py
│   │   └── utils/
│   │       └── demo_questions.py  # Built-in question bank
│   ├── tests/
│   │   └── test_core.py          # Unit tests
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Router & routes
│   │   ├── api/client.js         # Axios client with JWT interceptor
│   │   ├── contexts/AuthContext.jsx
│   │   ├── components/           # Navbar, DifficultyBadge
│   │   └── pages/                # 8 pages
│   ├── tailwind.config.js
│   └── .env
└── README.md
```

---

## 🗄️ Database Schema

```
users               subjects            topics
─────────────       ──────────────      ──────────────
id (PK)             id (PK)             id (PK)
name                name (unique)       subject_id (FK)
email (unique)      category            name
password_hash       is_custom           created_at
created_at          created_at

study_materials     quizzes             questions
───────────────     ────────            ─────────
id (PK)             id (PK)             id (PK)
user_id (FK)        user_id (FK)        quiz_id (FK)
subject_id (FK)     subject_id (FK)     question_text
topic_id (FK)       topic_id (FK)       option_a/b/c/d
title               title               correct_answer
source_type         total_questions     explanation
content             starting_difficulty subject / topic
created_at          created_at          difficulty

quiz_attempts       user_answers
─────────────       ────────────
id (PK)             id (PK)
user_id (FK)        attempt_id (FK)
quiz_id (FK)        question_id (FK)
score               selected_answer
percentage          correct
current_difficulty  difficulty
status              answered_at
started_at
completed_at
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 2. PostgreSQL Setup
```sql
CREATE DATABASE quiz_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE quiz_db TO postgres;
```

### 3. Backend Setup
```powershell
cd G:\event\backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — set DATABASE_URL, SECRET_KEY, and optionally GEMINI_API_KEY

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will auto-create all tables and seed subjects/topics on first startup.

### 4. Frontend Setup
```powershell
cd G:\event\frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Environment Variables

### `backend/.env`
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/quiz_db
SECRET_KEY=your-super-secret-key-change-this
GEMINI_API_KEY=           # Leave blank for demo mode
CORS_ORIGINS=http://localhost:5173
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:8000
```

---

## 🤖 AI Configuration

### With Gemini API Key
1. Get a free key at https://aistudio.google.com/app/apikey
2. Set `GEMINI_API_KEY=your_key` in `backend/.env`
3. Restart the backend

### Demo Mode (No API Key)
The app works fully without a Gemini API key. The `demo_questions.py` module provides 50+ questions across:
- Python, Machine Learning, DBMS, Data Structures, Cybersecurity, General Knowledge

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/subjects/` | List all subjects |
| POST | `/api/subjects/custom` | Add custom subject |
| POST | `/api/materials/upload` | Upload PDF/DOCX/TXT |
| POST | `/api/materials/text` | Save pasted text |
| POST | `/api/quizzes/generate` | Generate quiz |
| GET | `/api/quizzes/{id}` | Get quiz with questions |
| POST | `/api/attempts/start?quiz_id=` | Start an attempt |
| POST | `/api/attempts/{id}/answer` | Submit answer |
| POST | `/api/attempts/{id}/complete` | Complete attempt |
| GET | `/api/reports/{attempt_id}` | Get performance report |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/history` | Quiz history |

Interactive API docs: **http://localhost:8000/docs**

---

## 🧪 Running Tests
```powershell
cd G:\event\backend
.\venv\Scripts\Activate.ps1
pytest tests/ -v
```

Tests cover: adaptive difficulty logic (8 cases), performance analysis, security (JWT/bcrypt), demo question generation, and question validation.

---

## 🎯 Complete User Flow

```
Register / Login → Dashboard → Create New Quiz
→ Select Subject (40+ predefined or custom)
→ Enter Topic + optional material (paste/PDF/DOCX/TXT)
→ Set questions (5/10/15/20) & starting difficulty
→ Generate Quiz (AI or demo mode)
→ Answer MCQs adaptively (difficulty adjusts each question)
→ Submit all answers → Performance Report
→ Topic/difficulty charts, strengths, weaknesses, recommendations
→ View in History anytime
```

---

## 📊 Adaptive Difficulty

```
Correct answer  → Easy → Medium → Hard → Expert (capped)
Incorrect answer → Expert → Hard → Medium → Easy (floored)
```

Questions are never repeated within the same quiz session.
