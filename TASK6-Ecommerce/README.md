# Task 6 — E-Commerce Website

## 📋 Description
A full-stack e-commerce platform where users can browse products, add items to a shopping cart, and complete checkout. Built with React, Node.js, Express, and MongoDB.

## ✨ Features
- Browse products with category and price filters
- Search functionality
- Sort by price and rating
- Add to cart with quantity controls
- Persistent cart per logged-in user
- Checkout flow with shipping address form
- Multiple payment method options (COD, UPI, Card)
- Order history and tracking
- Demo product seeding button

## 🛠️ Tech Stack
**Frontend:** React.js, React Router, Axios, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Auth:** JWT, bcryptjs

## 📁 Folder Structure
TASK6-Ecommerce/

├── backend/      → Express API server

└── frontend/     → React client app

## ▶️ How to Run

### Backend
cd backend

npm install

node server.js
Runs on `http://localhost:5002`

### Frontend
cd frontend

npm install

npm start
Runs on `http://localhost:3005`

## 🔑 Environment Variables (backend/.env)
MONGO_URI=mongodb://localhost:27017/ecommerceapp

JWT_SECRET=your_secret_key

PORT=5002

## 👤 Author
Built as part of the CodSoft Web Development Internship.