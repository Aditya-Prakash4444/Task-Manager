import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import axios from 'axios';
import './SignUp.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member'); 
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/signup', { name, email, password, role });
      
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to sign up.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup} className="signup-form">
        <h2>Create an Account</h2>
        
        {error && <p className="signup-error">{error}</p>}
        
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group role-group">
          <label>Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;