import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails'; 
import SignUp from './pages/SignUp';
import TeamMembers from './pages/TeamMembers';

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Router>
      <Routes>

        <Route 
          path="/login" 
          element={!token ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={token ? <><Navbar /><Dashboard /></> : <Navigate to="/login" />} 
        />
        <Route 
          path="/projects" 
          element={token ? <><Navbar /><Projects /></> : <Navigate to="/login" />} 
        />
        <Route 
          path="/projects/:id" 
          element={token ? <><Navbar /><ProjectDetails /></> : <Navigate to="/login" />} 
        />
        <Route 
          path="/team-members" 
          element={token ? <><Navbar /><TeamMembers /></> : <Navigate to="/login" />} 
        />
        <Route 
          path="/signup" 
          element={!token ? <SignUp /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;