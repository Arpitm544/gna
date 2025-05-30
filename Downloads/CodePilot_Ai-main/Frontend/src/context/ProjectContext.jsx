import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

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

        const res = await axios.get(`${config.API_URL}/api/projects`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        if (err.response?.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          localStorage.removeItem('email');
        }
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [config.API_URL]); // Added dependency

  // Add a new project via backend
  const addProject = async (project) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.post(`${config.API_URL}/api/projects`, project, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setProjects(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Error adding project:', err);
      if (err.response?.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
      }
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