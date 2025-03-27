import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Log all environment variables for debugging
      console.log('All environment variables:', process.env);
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      if (!backendUrl) {
        console.error('REACT_APP_BACKEND_URL is not defined. Check your .env file.');
        alert('Backend URL is not configured. Please check the environment setup.');
        return;
      }
      const url = `${backendUrl}/api/login`;
      console.log('Attempting login at:', url);

      const response = await axios.post(url, { email, password });
      console.log('Login response:', response.data);

      // Store userId and username in localStorage
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.username); // Set username

      // Ensure localStorage is updated before navigating
      console.log('Stored username:', localStorage.getItem('username'));

      navigate('/home');
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>
      <button className="home-btn" onClick={() => navigate('/')}>🏠 Home</button>
      <div className="login-card">
        <h2>🔥 Free Fire Tournament Login 🔥</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">🎮 Login</button>
        </form>
        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;