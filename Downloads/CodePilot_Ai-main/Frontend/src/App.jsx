import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CodeReview from './pages/CodeReview';
import ProtectedRoute from './pages/ProtectedRoute';
import Profile from './pages/Profile';
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import rehypeHighlight from "rehype-highlight";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import axios from 'axios';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Dashboard from './pages/Dashboard';
import { ProjectProvider } from './context/ProjectContext';
import { BookmarkProvider } from './context/BookmarkContext';
import Bookmarks from './pages/Bookmarks';

const App = () => {
  const [count, setCount] = useState(0);

  const [code,setCode]=useState(`function sum(){ 
  return 1+1
}`)

const [review,setReview]=useState(``);
const [loading, setLoading] = useState(false);

 useEffect(() => {
  prism.highlightAll();
 })

async function reviewCode(){
  setLoading(true); 
  setReview("");    
  try {
    const response=await axios.post("http://localhost:5000/ai/get-review",{code});
    setReview(response.data);
  } catch (err) {
    setReview("Error fetching review.");
  }
  setLoading(false);
}

  return (
    <ThemeProvider>
      <ProjectProvider>
        <BookmarkProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ThemeToggle />
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route 
                path="/code-review" 
                element={
                  <ProtectedRoute>
                    <CodeReview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Routes>
          </Router>
        </BookmarkProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App
