# Task 5 — Online Quiz Maker

## 📋 Description
A full-stack quiz platform where users can create custom quizzes and others can take them with real-time scoring and instant feedback. Built with React, Node.js, Express, and MongoDB.

## ✨ Features
- Create quizzes with multiple-choice questions
- Set time limits for quizzes
- Take quizzes with a live countdown timer
- Instant score calculation with percentage
- Detailed answer review with explanations
- Browse and search public quizzes by category
- User dashboard to manage created quizzes

## 🛠️ Tech Stack
**Frontend:** React.js, React Router, Axios, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth:** JWT, bcryptjs

## 📁 Folder Structure
TASK5-QuizMaker/

├── backend/      → Express API server

└── frontend/     → React client app

## ▶️ How to Run

### Backend
cd backend

npm install

node server.js
Runs on `http://localhost:5001`

### Frontend
cd frontend

npm install

npm start
Runs on `http://localhost:3004`

## 🔑 Environment Variables (backend/.env)
MONGO_URI=mongodb://localhost:27017/quizapp

JWT_SECRET=your_secret_key

PORT=5001

## 👤 Author
Built as part of the CodSoft Web Development Internship.