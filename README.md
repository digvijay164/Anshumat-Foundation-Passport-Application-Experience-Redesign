# Passport Application Experience Redesign

A modern, user-centric web application designed to simplify the complex and often anxiety-inducing process of applying for a passport. This project transforms a traditionally tedious form-filling exercise into a guided, step-by-step digital experience.

## 🎯 The Problem

Traditional passport applications suffer from:
1. **Confusing, lengthy forms** that overwhelm users.
2. **Lack of guidance** regarding document requirements.
3. **High drop-off rates** due to fear of making unrecoverable mistakes.
4. **Poor navigation** and no clear progress indication.

## ✨ UX Decisions & Solutions

This redesign focuses heavily on **clarity, usability, and anxiety reduction** for non-technical users, students, and first-time applicants:

- **Step-by-Step Wizard:** We broke down a massive form into 6 logical, bite-sized steps. Users focus on one context at a time (e.g., Personal Info, then Address).
- **Auto-save & Drafts:** The application autosaves after every step. Users see a real-time `Saved just now` indicator, completely eliminating the fear of losing progress.
- **Clear Document Checklist:** Instead of a vague list, users get a clear UI showing exactly what to upload with real-time feedback when a document is successfully attached.
- **Visual Progress Bar:** Users always know exactly where they are in the process and how many steps are left.
- **Frictionless Appointment Booking:** Mocked slot booking right inside the app, preventing invalid selections.

## 🛠 Tech Stack

**Frontend:**
- **React.js** (via Vite for fast builds)
- **Tailwind CSS** (for clean, responsive, modern styling)
- **Zustand** (for lightweight, boilerplate-free state management)
- **React Router v6** (for protected routes and navigation)
- **Lucide React** (for crisp, accessible icons)

**Backend:**
- **Node.js + Express** (REST API)
- **MongoDB + Mongoose** (Database and object modeling)
- **JSON Web Tokens (JWT)** (Secure authentication)
- **Multer** (Handling document file uploads)

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or Atlas). By default, the app tries to connect to `mongodb://127.0.0.1:27017/passport_db`.

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js # To create the demo user
node server.js # Runs on port 5001
```

### 2. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm run dev # Runs on port 5173 by default
```

### 3. Demo User Credentials
A demo user is available to test the dashboard right away:
- **Email:** `hire-me@anshumat.org`
- **Password:** `HireMe@2025!`

## 📁 System Architecture
- `/backend`: Contains the REST API, schemas, routes, and `uploads/` dir for files.
- `/frontend`: Contains the React SPA with a centralized store, page components, and routing logic.

*Built as a showcase for product engineering, focusing on the intersection of UX and full-stack architecture.*
