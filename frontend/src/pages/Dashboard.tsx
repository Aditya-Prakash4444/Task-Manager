import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/useAuthStore';
import './Dashboard.css';


interface Task {
  _id: string;
  title: string;
  status: string;
  dueDate?: string;
  projectId?: {
    _id: string;
    name: string;
  };
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let isMounted = true;

    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        if (isMounted) {
          setTasks(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <h2 className="dashboard-loading">Loading dashboard...</h2>;

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome back, {user?.name}</h1>
      <div className="status-cards-container">
        <div className="status-card total">
          <h3>Total Tasks</h3>
          <p>{totalTasks}</p>
        </div>
        <div className="status-card in-progress">
          <h3>In Progress</h3>
          <p>{inProgressTasks}</p>
        </div>
        <div className="status-card overdue">
          <h3>Overdue</h3>
          <p>{overdueTasks}</p>
        </div>
        <div className="status-card completed">
          <h3>Completed</h3>
          <p>{completedTasks}</p>
        </div>
      </div>
      <div className="tasks-section">
        <h2>All Tasks</h2>
        
        {tasks.length === 0 ? (
          <p>No tasks found. Go to a project to create some!</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Project</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';
                
                return (
                  <tr key={task._id}>
                    <td className="task-name">{task.title}</td>
                    <td>
                      {task.projectId ? (
                        <Link to={`/projects/${task.projectId._id}`} className="task-project-link">
                          {task.projectId.name}
                        </Link>
                      ) : 'Unknown Project'}
                    </td>
                    <td className={`task-due-date ${isOverdue ? 'overdue' : ''}`}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                    </td>
                    <td>
                      <span className={`task-status-badge ${task.status === 'Completed' ? 'completed' : task.status === 'In Progress' ? 'in-progress' : 'pending'}`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;