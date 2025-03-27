import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.BACKEND_URL}/api/signup`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert(res.data.message);
      setShowOtpField(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`, {
        email: formData.email,
        otp,
      });
      alert(res.data.message);
      navigate('/login', { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="signup-container">
      <div className="overlay"></div>

      {/* Home Button Correctly Positioned Outside the Card */}
      <button className="home-btn" onClick={() => navigate('/')}>🏠 Home</button>

      <div className="signup-card">
        <h2>{showOtpField ? 'Verify OTP' : 'Signup'}</h2>

        {!showOtpField ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Get OTP</button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="input-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
            </div>
            <button type="submit" className="submit-btn">Verify OTP</button>
          </form>
        )}
        <p className="login-link" onClick={() => navigate('/login')}>
          Already have an account? <span>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;