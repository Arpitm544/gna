import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ProjectCard from '../components/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import axios from 'axios';
import config from '../config';

const Dashboard = () => {
  const { projects, setProjects } = useProjects();
  const [search, setSearch] = React.useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(`${config.API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        if (err.message === 'Authentication required') {
          setError('Please log in to view your projects');
        } else {
          setError('Failed to load projects');
        }
      }
    };

    fetchProjects();
  }, [setProjects]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p._id !== projectId));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <TopBar search={search} setSearch={setSearch} onNewProject={() => navigate('/code-review')} />
        <div className="dashboard-content">
          <h2>My Projects</h2>
          {error && (
            <div 
              style={{
                color: '#ff4444',
                backgroundColor: '#ffebee',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}
            >
              {error}
            </div>
          )}
          <div className="project-grid">
            {filteredProjects.length === 0 ? (
              <div style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>
                {error ? 'Error loading projects' : 'No projects yet. Add one from Code Review!'}
              </div>
            ) : (
              filteredProjects.map(project => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  onDelete={handleDeleteProject}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 