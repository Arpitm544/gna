import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get('/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Add a new project via backend
  const addProject = async (project) => {
    try {
      const res = await axiosInstance.post('/api/projects', project);
      setProjects(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Error adding project:', err);
      throw new Error(err.response?.data?.message || 'Failed to add project');
    }
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, loading, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);