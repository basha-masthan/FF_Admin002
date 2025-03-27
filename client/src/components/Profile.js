import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; // Import the new CSS file

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      console.log('Retrieved userId from localStorage:', userId);

      if (!userId) {
        console.log('No userId found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Making API call to fetch user data for ID:', userId);
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        console.log('User data received:', response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 401 || error.response?.status === 404) {
          console.log('Unauthorized or user not found, clearing userId and redirecting');
          localStorage.removeItem('userId');
          navigate('/login');
        } else {
          console.log('Non-auth error occurred, keeping user logged in');
          setUserData(null);
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    console.log('User logged out');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!userData) return <div className="error">Unable to load profile data. Please try again later.</div>;

  return (
    <div className="profile-container">
      <nav className="navbar">
        <Link to="/home">Home</Link>
        <Link to="/wallet">Wallet</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="profile-card">
        <h2>Your Profile</h2>
        <div className="user-details">
          <p><strong>Username:</strong> {userData.username || 'N/A'}</p>
          <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
          <p><strong>Wallet Balance:</strong> ₹{userData.wallet || 0}</p>
          <p><strong>Total Games Played:</strong> {userData.totalGamesPlayed || userData.gameHistory?.length || 0}</p>
          <p><strong>Total Wins:</strong> {userData.totalWins || 0}</p>
        </div>

        <h3>Game History</h3>
        <div className="game-history">
          {userData.gameHistory && userData.gameHistory.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Game Mode</th>
                  <th>Entry Fee</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {userData.gameHistory.map((game, index) => (
                  <tr key={index}>
                    <td>{game.mode || 'Unknown'}</td>
                    <td>₹{game.entryFee || 0}</td>
                    <td>{game.date ? new Date(game.date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No games played yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;