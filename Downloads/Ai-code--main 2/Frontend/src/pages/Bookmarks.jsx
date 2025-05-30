import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ProjectCard from '../components/ProjectCard';
import { useBookmarks } from '../context/BookmarkContext';
import { useNavigate } from 'react-router-dom';

const Bookmarks = () => {
  const { bookmarks, loading, error } = useBookmarks();
  const [search, setSearch] = React.useState('');
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/code-review');
  };

  const filtered = bookmarks.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar search={search} setSearch={setSearch} onNewProject={handleNewProject} />
        <div className="dashboard-content">
          <h2>Bookmarked Projects</h2>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Loading bookmarks...
            </div>
          ) : error ? (
            <div style={{ color: '#ff4444', fontSize: '1.1rem' }}>
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              No bookmarks yet.
            </div>
          ) : (
            <div className="project-grid">
              {filtered.map(project => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks; 