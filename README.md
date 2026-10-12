# 🤖 AI Quiz Generator & Adaptive Learning System

A full-stack web application that uses **AI (Google Gemini)** to generate multiple-choice
quizzes from any subject, topic, or uploaded study material — and **adapts question
difficulty in real time** based on your answers, then delivers performance analytics.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **AI Question Generation** | Google Gemini API creates MCQs with explanations (auto-fallback to a built-in demo bank) |
| **Adaptive Difficulty** | Easy → Medium → Hard → Expert, adjusted after every answer |
| **Document Upload** | PDF, DOCX, TXT — AI generates questions from your own material |
| **40+ Subjects** | 9 categories with predefined topics, plus custom subjects |
| **Performance Reports** | Score, topic-wise & difficulty-wise charts, strengths, weaknesses, recommendations |
| **JWT Authentication** | Secure register/login with bcrypt password hashing |
| **Demo Mode** | Fully functional even without any AI API key |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Axios, React Router |
| Backend | FastAPI (Python 3.13), Uvicorn |
| Database | PostgreSQL with automatic SQLite fallback (SQLAlchemy ORM) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| AI | Google Gemini 1.5 Flash |
| Parsing | PyMuPDF (PDF), python-docx (DOCX) |

---

## 📁 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point
│   │   ├── core/                 # config, database, security
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── api/routes/           # auth, subjects, materials, quizzes, attempts, reports, dashboard
│   │   ├── services/             # ai_generator, adaptive_engine, performance_analyzer, document_parser
│   │   └── utils/                # demo_questions (fallback bank)
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/                # Login, Register, Dashboard, CreateQuiz, Quiz, Results, History, Profile
    │   ├── components/ · contexts/ · api/
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.13
- Node.js 18+

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # then edit .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Tables are auto-created and subjects/topics seeded on first start. API docs: http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install
npm run dev                    # http://localhost:5174
```

---

## ⚙️ Environment Variables

### `backend/.env`
```
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/quiz_db   # leave unset to use SQLite
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=                # leave blank for demo mode
CORS_ORIGINS=http://localhost:5174
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:8000
```

> ⚠️ Never commit real secrets. `.env` files are ignored by `.gitignore`; add values in your
> hosting dashboard's Environment tab when deploying.

---

## ☁️ Deploying to Render

**Backend (Web Service)**
- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Env vars: `SECRET_KEY`, `DATABASE_URL` (use a Render PostgreSQL for persistence), `GEMINI_API_KEY`, `CORS_ORIGINS`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`

**Frontend (Static Site)**
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Publish Directory: `dist`
- Env var: `VITE_API_URL = https://<your-backend>.onrender.com`

Deploy order: create DB → deploy backend → deploy frontend with backend URL → set backend
`CORS_ORIGINS` to the frontend URL.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/subjects/` | List subjects |
| POST | `/api/subjects/custom` | Add custom subject |
| POST | `/api/materials/upload` | Upload PDF/DOCX/TXT |
| POST | `/api/materials/text` | Save pasted text |
| POST | `/api/quizzes/generate` | Generate quiz |
| GET | `/api/quizzes/{id}` | Get quiz with questions |
| POST | `/api/attempts/start` | Start an attempt |
| POST | `/api/attempts/{id}/answer` | Submit answer (adaptive) |
| POST | `/api/attempts/{id}/complete` | Complete attempt |
| GET | `/api/reports/{attempt_id}` | Performance report |
| GET | `/api/dashboard` | Dashboard stats |
| GET | `/api/history` | Quiz history |

---

## 🎯 How It Works

```
Register/Login → Dashboard → Create Quiz
→ Pick Subject + Topic (+ optional PDF/DOCX/TXT) → set #questions & starting difficulty
→ AI generates MCQs → Answer adaptively (difficulty rises/falls per answer)
→ Submit → Performance Report (charts, strengths, weaknesses, recommendations) → History
```

### Adaptive Difficulty
```
Correct answer   → Easy → Medium → Hard → Expert   (capped)
Incorrect answer → Expert → Hard → Medium → Easy    (floored)
```
Questions are never repeated within a quiz session.

---

## 🧪 Testing
```bash
cd backend
pytest tests/ -v
```
Covers adaptive difficulty logic, performance analysis, JWT/bcrypt security, and demo fallback.
