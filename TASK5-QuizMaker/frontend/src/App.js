import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar       from './components/Navbar';
import Home         from './pages/Home';
import QuizList     from './pages/QuizList';
import TakeQuiz     from './pages/TakeQuiz';
import Result       from './pages/Result';
import CreateQuiz   from './pages/CreateQuiz';
import Login        from './pages/Login';
import Register     from './pages/Register';
import MyDashboard  from './pages/MyDashboard';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/quizzes"       element={<QuizList />} />
          <Route path="/quiz/:id/take" element={<TakeQuiz />} />
          <Route path="/result"        element={<Result />} />
          <Route path="/create"        element={<CreateQuiz />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/dashboard"     element={<MyDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}