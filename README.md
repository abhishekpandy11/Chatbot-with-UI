# 🌟 AI Chatbot with UI & Analytics

A professional-grade, full-stack AI chatbot application featuring persistent conversation history, a dedicated analytics dashboard, and a modern "Calm" user interface.

## 🚀 Features

- **Multi-User Chat History**: Persistent threads and messages stored in PostgreSQL.
- **RAG Integration**: Context-aware AI responses using Qdrant vector search.
- **Analytics Dashboard**: Real-time tracking of token usage, costs, and request logs.
- **"Calm" Theme**: A curated aesthetic with soft pastels and smooth micro-animations.
- **Secure Auth**: JWT-based authentication with auto-refresh tokens.
- **Production Ready**: Fully configured for one-click deployment to Render and Vercel.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TailwindCSS, Axios, Lucide React.
- **Backend**: FastAPI (Python), SQLModel (SQLAlchemy), Groq (LLM), Pydantic Settings.
- **Database**: PostgreSQL (Neon.tech / Local).

## 📥 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` folder:
```env
DATABASE_URL=your_postgres_url
GROQ_API_KEY=your_key
ACCESS_SECRET=random_string
REFRESH_SECRET=random_string
```
Run the server:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Run the app:
```bash
npm run dev
```

## 🌐 Deployment

Follow the [Deployment Guide](./deployment_guide.md) for detailed instructions on hosting with **Render**, **Vercel**, and **Neon**.

---
Built with ❤️ for AI developers.
