import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ProjectCard from '../components/ProjectCard';
import { useBookmarks } from '../context/BookmarkContext';

const Bookmarks = () => {
  const { bookmarks } = useBookmarks();
  const [search, setSearch] = React.useState('');

  const filtered = bookmarks.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar search={search} setSearch={setSearch} onNewProject={() => {}} />
        <div className="dashboard-content">
          <h2>Bookmarked Projects</h2>
          <div className="project-grid">
            {filtered.length === 0
              ? <div style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>No bookmarks yet.</div>
              : filtered.map(project => <ProjectCard key={project.id} project={project} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookmarks; 