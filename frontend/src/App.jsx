import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

// Separate Navbar Component so it can use navigation and track user state
function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Redirect to login immediately after logout
  };

  return (
    <nav style={{ padding: '15px 20px', background: '#333', color: '#fff', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>DevBlog</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ fontSize: '14px', color: '#ddd' }}>Hi, {user.username}</span>
            <button 
              onClick={handleLogout} 
              style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const Home = ({ user }) => {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Welcome to DevBlog</h2>
      {user ? (
        <p>You are successfully logged in as <strong>{user.email}</strong> ({user.role}).</p>
      ) : (
        <p>Please login or register to start writing and reading posts.</p>
      )}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app boots up
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}