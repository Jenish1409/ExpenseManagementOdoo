import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/countries')
      .then(res => setCountries(res.data.map(c => c.name.common).sort()))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signup(email, password, country);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
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
        
        <div className="form-group">
          <select
            className="form-control"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
