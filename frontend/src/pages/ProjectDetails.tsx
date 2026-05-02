import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import './ProjectDetails.css';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string; 
  assignedTo?: { name: string };
}
interface UserData {
  _id: string;
  name: string;
  email: string;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>(); 
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(''); 
  const [loading, setLoading] = useState(true);

  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [teamMessage, setTeamMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        const response = await api.get(`/tasks?projectId=${id}`);
        if (isMounted) {
          setTasks(response.data);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const fetchUsers = async () => {
      if (user?.role === 'Admin') {
        try {
          const response = await api.get('/auth/users');
          if (isMounted) {
            setAllUsers(response.data);
          }
        } catch (err) {
          console.error('Error fetching users:', err);
        }
      }
    };

    fetchTasks();
    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [id, user?.role]);

  const handleFetchTasks = async () => {
    try {
      const response = await api.get(`/tasks?projectId=${id}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { title, description, dueDate, projectId: id });
      setTitle('');
      setDescription('');
      setDueDate(''); 
      handleFetchTasks();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      handleFetchTasks(); 
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        handleFetchTasks();
      } catch (err) {
        console.error('Failed to delete task', err);
        alert('Failed to delete task');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this entire project? This action cannot be undone.')) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (err) {
        console.error('Failed to delete project', err);
        alert('Failed to delete project');
      }
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamMessage({ text: '', type: '' });

    if (!selectedUserId) {
      setTeamMessage({ text: 'Please select a user first.', type: 'error' });
      return;
    }

    try {
      await api.post(`/projects/${id}/members`, { userId: selectedUserId });
      setTeamMessage({ text: 'Team member added successfully!', type: 'success' });
      setSelectedUserId(''); 
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setTeamMessage({ text: err.response?.data?.message || 'Failed to add member.', type: 'error' });
      } else {
        setTeamMessage({ text: 'An unexpected error occurred.', type: 'error' });
      }
    }
  };

  if (loading) return <h2 className="project-loading">Loading Project...</h2>;

  return (
    <div className="project-details-container">
      <div className="project-header">
        <Link to="/projects" className="back-link">
          &larr; Back to Projects
        </Link>
        {user?.role === 'Admin' && (
          <button 
            onClick={handleDeleteProject}
            className="delete-project-btn"
          >
            Delete Project
          </button>
        )}
      </div>
      
      <h1 className="project-details-title">Project Workspace</h1>

      {user?.role === 'Admin' && (
        <div className="admin-section">
          
          {/* TASK CREATION FORM */}
          <div className="form-section task-form">
            <h3>Add New Task</h3>
            <form onSubmit={handleCreateTask} className="task-form-fields">
              <div className="task-form-row">
                <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button type="submit" className="add-task-btn">Add Task</button>
            </form>
          </div>
          <div className="form-section invite-section">
            <h3>Invite to Team</h3>
            
            {teamMessage.text && (
              <p className={`team-message ${teamMessage.type}`}>
                {teamMessage.text}
              </p>
            )}

            <form onSubmit={handleAddMember} className="invite-form">
              <select 
                value={selectedUserId} 
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- Select a User --</option>
                {allUsers.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <button type="submit" className="add-member-btn">
                Add to Project
              </button>
            </form>
          </div>

        </div>
      )}

      
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="no-tasks-message">No tasks found for this project.</p>
        ) : (
          tasks.map((task) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
            return (
              <div key={task._id} className={`task-item ${isOverdue ? 'overdue' : 'normal'}`}>
                <div className="task-content">
                  <h3 className={isOverdue ? 'overdue' : ''}>
                    {task.title} {isOverdue && <span className="overdue-badge">(Overdue)</span>}
                  </h3>
                  <p>{task.description}</p>
                  <small className="task-due-date">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                  </small>
                </div>
                <div className="task-actions">
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className={`status-select ${task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'in-progress' : 'pending'}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {user?.role === 'Admin' && (
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      className="delete-task-btn"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;