import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axiosInstance';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setError('');       
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, result } = response.data;
    
      login(result, token);
      
      navigate('/');
    } 
    catch(err){
        if(axios.isAxiosError(err)){
            setError(err.response?.data?.message || 'Something went wrong while logging in.');
        }
        else{
            setError('An unexpected error occured.');
        }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Task Manager Login</h2>
        
        {error && <p className="login-error">{error}</p>}
        
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group password-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Log In
        </button>
        <p className="login-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;