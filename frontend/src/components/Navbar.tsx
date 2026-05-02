import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div>
        <h3>Task Manager</h3>
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/team-members">Team Members</Link>
      </div>
      <div className="navbar-welcome-container">
        <span className="navbar-welcome-text">Welcome <strong>{user?.name}</strong> ({user?.role})</span>
        <button onClick={handleLogout} className="navbar-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;