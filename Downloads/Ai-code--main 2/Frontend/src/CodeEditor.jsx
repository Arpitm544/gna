import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import "highlight.js/styles/github-dark.css";
import rehypeHighlight from "rehype-highlight"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import axios from 'axios'
import './App.css'



function App() {
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
    const response=await axios.post(" http://localhost:5000/ai/get-review",{code});
    setReview(response.data);
  } catch (err) {
    setReview("Error fetching review.");
  }
  setLoading(false);
}

  return (
    <>
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
            <button 
              onClick={reviewCode}
              className="review-button"
              disabled={loading} 
            >
              {loading ? "Reviewing..." : "Review"}
            </button>
          </div>
        </div>
        <div className="right">
          {loading ? (
            <div>Loading review...</div>
          ) : (
            <Markdown
            rehypePlugins={[rehypeHighlight]}
            
            >{review}</Markdown>
          )}
        </div>
      </main>
    </>
  );
}

export default App
