import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
