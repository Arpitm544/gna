import React, { useState, useEffect } from 'react';
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import axios from 'axios';
import config from '../config';
import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import { useProjects } from '../context/ProjectContext';
import { useLocation } from 'react-router-dom';

const CodeReview = () => {
  const location = useLocation();
  const project = location.state?.project;

  const [code, setCode] = useState(project?.code || `function sum(){ 
  return 1+1
}`);
  const [review, setReview] = useState(project?.review || '');
  const [loading, setLoading] = useState(false);
  const { addProject } = useProjects();

  useEffect(() => {
    prism.highlightAll();
  });

  const reviewCode = async () => {
    setLoading(true);
    setReview('');
    try {
      const response = await axios.post(`${config.API_URL}/ai/get-review`, { code });
      setReview(response.data);
    } catch (err) {
      setReview("Error fetching review. Please try again.");
    }
    setLoading(false);
  };

  const handleAddProject = () => {
    const name = prompt('Enter project name:', project?.name || '');
    if (!name) return;
    const language = prompt('Enter language (e.g. JavaScript, Python, etc):', project?.language || 'JavaScript');
    if (!language) return;
    const healthScore = project?.healthScore || Math.floor(Math.random() * 41) + 60; // 60-100 random for demo
    addProject({
      name,
      language,
      code,
      review,
      healthScore
    });
    alert('Project added to dashboard!');
  };

  return (
    <div className="code-review-container">
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                borderRadius: "5px",
                border: "1px solid #444",
                color: "#ffffff",
                width: "100%",
                background: "transparent",
              }}
            />
          </div>
          <div className="button-group">
            <button 
              onClick={reviewCode}
              className="review-button"
              disabled={loading} 
            >
              {loading ? "Reviewing..." : "Review Code"}
            </button>
            <button 
              onClick={handleAddProject}
              className="add-project-button"
              disabled={loading}
            >
              Add to My Projects
            </button>
          </div>
        </div>
        <div className="right">
          {loading ? (
            <div className="loading">Analyzing your code...</div>
          ) : (
            <div className="review-content">
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
// CodeReview.jsx
export default CodeReview; 