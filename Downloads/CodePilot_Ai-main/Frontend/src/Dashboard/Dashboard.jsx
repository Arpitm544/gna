import "./Dashboard.css";
import { useNavigate } from "react-router-dom"; // If using React Router

const features = [
  {
    title: "Security Scans",
    desc: "Detect vulnerabilities and security flaws in your code before they become problems.",
    icon: "🛡"
  },
  {
    title: "Best Practices",
    desc: "Get recommendations aligned with industry standard best practices and coding conventions.",
    icon: "✅"
  },
  {
    title: "Github Syncs",
    desc: "Seamlessly integrate with your GitHub repositories for continuous code reviews.",
    icon: "🐙"
  },
  {
    title: "Performance Syncs",
    desc: "Identify performance bottlenecks and get optimization suggestions.",
    icon: "⚡"
  },
  {
    title: "AI Powered Fields",
    desc: "Leverage advanced AI to analyze your code and provide intelligent feedback.",
    icon: "🤖"
  },
  {
    title: "Health Score",
    desc: "Get a comprehensive health score to track the quality of your codebase over time.",
    icon: "📈"
  }
];

const aiMission = `
🌟 Role: Expert Code Reviewer & Development Consultant 🌟

Your Mission:
You are a highly skilled code reviewer with deep expertise in software development. Your primary objective is to analyze, critique, and enhance the quality of codebases. For each code review, you will provide a comprehensive assessment and a standardized "Code Health Score" out of 100.

Our AI helps you:
- Detect vulnerabilities and security flaws before they become problems.
- Get recommendations aligned with industry best practices.
- Integrate seamlessly with your workflow for continuous code reviews.
- Track the quality of your codebase over time with a comprehensive health score.
`;

export default function Dashboard() {
  const navigate = useNavigate(); // If using React Router

  const handleGetStarted = () => {
    navigate("/signup"); // Redirect to signup page
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <span className="logo">Code<span style={{color:"#00bfff"}}>Pilot</span></span>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>LOGIN</button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>SIGNUP</button>
        </div>
      </header>

      {/* AI Mission Section */}
      <section className="ai-mission-section">
        <h1 className="dashboard-title">AI Powered Code Review in Seconds</h1>
        <p className="ai-mission-text">
          Integrated GEMINI 2.0 Flash which can review 1000 lines of code at a time.<br />
          Get instant feedback on bugs, security flaws, and best practices directly in the workflow.<br /><br />
          <span style={{fontWeight: "bold"}}>Our Mission:</span> {aiMission}
        </p>
        <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
      </section>

      <div className="dashboard-cards">
        {features.map((f, i) => (
          <div className="dashboard-card" key={i}>
            <div className="dashboard-icon">{f.icon}</div>
            <div className="dashboard-card-title">{f.title}</div>
            <div className="dashboard-card-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}