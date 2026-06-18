# Task 4 — Job Board Website

## 📋 Description
A full-stack job board platform where employers can post job openings and job seekers can search and apply for jobs. Built with React, Node.js, Express, and MongoDB.

## ✨ Features
- User authentication (Employer / Candidate roles)
- Employers can post, edit, and delete job listings
- Candidates can browse, search, and filter jobs
- Job application system with cover letters
- Employer dashboard to manage applicants
- Candidate dashboard to track application status
- Search by job title, company, and job type

## 🛠️ Tech Stack
**Frontend:** React.js, React Router, Axios, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth:** JWT, bcryptjs

## 📁 Folder Structure
TASK4-JobBoard/

├── backend/      → Express API server

└── frontend/     → React client app

## ▶️ How to Run

### Backend
cd backend

npm install

node server.js
Runs on `http://localhost:5000`

### Frontend
cd frontend

npm install

npm start
Runs on `http://localhost:3003`

## 🔑 Environment Variables (backend/.env)
MONGO_URI=mongodb://localhost:27017/jobboard2

JWT_SECRET=your_secret_key

PORT=5000

## 👤 Author
Built as part of the CodSoft Web Development Internship.