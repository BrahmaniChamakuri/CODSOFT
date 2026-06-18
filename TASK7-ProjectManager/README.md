# Task 7 — Project Management Tool

## 📋 Description
A full-stack Kanban-style project management tool where users can create projects, organize tasks across stages, and track progress visually. Built with React, Node.js, Express, and MongoDB.

## ✨ Features
- Create multiple projects with custom colors and icons
- Kanban board with 4 columns: To Do, In Progress, Review, Done
- Add tasks with priority levels (Low, Medium, High, Urgent)
- Move tasks between stages
- Project progress bar based on completed tasks
- Project statistics dashboard
- Delete projects and tasks

## 🛠️ Tech Stack
**Frontend:** React.js, React Router, Axios, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth:** JWT, bcryptjs

## 📁 Folder Structure
TASK7-ProjectManager/

├── backend/      → Express API server

└── frontend/     → React client app

## ▶️ How to Run

### Backend
cd backend

npm install

node server.js
Runs on `http://localhost:5003`

### Frontend
cd frontend

npm install

npm start
Runs on `http://localhost:3006`

## 🔑 Environment Variables (backend/.env)
MONGO_URI=mongodb://localhost:27017/projectmanagerapp

JWT_SECRET=your_secret_key

PORT=5003

## 👤 Author
Built as part of the CodSoft Web Development Internship.