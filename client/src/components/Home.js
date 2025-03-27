import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './Home.css';

const socket = io('http://localhost:5000');

function Home() {
  const [gameModes, setGameModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(''); // State for username
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch username from localStorage on mount
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.log('No username found, redirecting to login');
      navigate('/login');
    }

    const fetchGameModes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/game-modes');
        console.log('Fetched game modes:', response.data);
        setGameModes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game modes:', error);
        setLoading(false);
      }
    };
    fetchGameModes();

    socket.on('slotUpdate', (updatedGameMode) => {
      console.log('Slot update received:', updatedGameMode);
      setGameModes((prevModes) =>
        prevModes.map((mode) =>
          mode._id === updatedGameMode._id ? updatedGameMode : mode
        )
      );
    });

    return () => socket.off('slotUpdate');
  }, [navigate]);

  const bookSlot = async (gameId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('No userId found, redirecting to login');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/game-modes/${gameId}/book`, { userId });
      console.log('Slot booked:', response.data);
    } catch (error) {
      console.error('Error booking slot:', error.response?.data?.error || error.message);
      if (error.response?.status === 401) {
        console.log('Unauthorized userId, clearing and redirecting');
        localStorage.removeItem('userId');
        localStorage.removeItem('username'); // Clear username too
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username'); // Clear username on logout
    console.log('User logged out');
    navigate('/login');
  };

  const formatPrizes = (prizes) => {
    return Object.entries(prizes)
      .map(([position, amount]) => `${position === '1' ? '1st' : position === '2' ? '2nd' : position === '3' ? '3rd' : position}: ₹${amount}`)
      .join(' | ');
  };

  if (loading) return <div className="loading">Loading tournaments...</div>;

  return (
    <div className="home-container">
      <nav className="navbar">
        <span className="username-display">Welcome, {username || 'User'}</span>
        <Link to="/profile">Profile</Link>
        <Link to="/wallet">Wallet</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <h2>Available Tournaments</h2>
      <div className="game-cards">
        {gameModes.length > 0 ? (
          gameModes.map((game) => (
            <div className="game-card" key={game._id}>
              <h3>{game.title}</h3>
              <p className="entry-fee">Entry Fee: ₹{game.entryFee}</p>
              <p className="prizes">{formatPrizes(game.prizes)}</p>
              <p className="slots">
                Slots: {game.filledSlots}/{game.maxSlots} (
                {game.maxSlots - game.filledSlots} available)
              </p>
              <button
                onClick={() => bookSlot(game._id)}
                disabled={game.filledSlots >= game.maxSlots}
                className={game.filledSlots >= game.maxSlots ? 'book-btn full' : 'book-btn'}
              >
                {game.filledSlots >= game.maxSlots ? 'Full' : 'Book Slot'}
              </button>
            </div>
          ))
        ) : (
          <p className="no-tournaments">No tournaments available</p>
        )}
      </div>
    </div>
  );
}

export default Home;