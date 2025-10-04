import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <a href="/dashboard" style={{ fontSize: '20px', fontWeight: 'bold' }}>
              Expense Management
            </a>
          </div>
          
          <div>
            {user ? (
              <>
                <span style={{ color: '#fff', marginRight: '20px' }}>
                  Welcome, {user.email}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a href="/signup">Sign Up</a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
