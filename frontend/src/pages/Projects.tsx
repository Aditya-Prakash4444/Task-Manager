import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Projects.css';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);

  const handleFetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        if (isMounted) {
          setProjects(response.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/projects', { name, description });
      
    
      setName('');
      setDescription('');
      
      
      handleFetchProjects();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create project.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await api.delete(`/projects/${projectId}`);
        handleFetchProjects();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          alert(err.response?.data?.message || 'Failed to delete project.');
        } else {
          alert('An unexpected error occurred.');
        }
      }
    }
  };

  if (loading) return <h2 className="projects-loading">Loading projects...</h2>;

  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>

      {user?.role === 'Admin' && (
        <div className="create-project-section">
          <h3>Create New Project</h3>
          {error && <p className="create-project-error">{error}</p>}
          
          <form onSubmit={handleCreateProject} className="create-project-form">
            <div className="form-input-group">
              <input 
                type="text" 
                placeholder="Project Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-input-group description">
              <input 
                type="text" 
                placeholder="Project Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>
            <button type="submit" className="create-btn">
              Create
            </button>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project._id} className="project-card">
            <Link to={`/projects/${project._id}`}>
                <h3 className="project-card-title">{project.name}</h3>
            </Link>
            <p className="project-card-description">{project.description}</p>
            <small className="project-card-creator">Created by: {project.createdBy?.name || 'Unknown'}</small>
            {user?.role === 'Admin' && (
              <button 
                onClick={() => handleDeleteProject(project._id)}
                className="delete-project-btn"
              >
                Delete Project
              </button>
            )}
        </div>
        ))}
        
        {projects.length === 0 && (
          <p className="no-projects-message">No projects found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Projects;