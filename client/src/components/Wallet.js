// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {Link, useNavigate } from 'react-router-dom';
// import './Wallet.css'; // Import the CSS file

// function Wallet() {
//   const [userData, setUserData] = useState(null);
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const userId = localStorage.getItem('userId');
//       const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

//       if (!userId) {
//         console.log('No userId found, redirecting to login');
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
//         console.log('Fetched wallet data:', response.data);
//         setUserData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching wallet data:', error.response?.data?.error || error.message);
//         if (error.response?.status === 401 || error.response?.status === 404) {
//           console.log('Unauthorized or user not found, redirecting to login');
//           localStorage.removeItem('userId');
//           navigate('/login');
//         }
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [navigate]);

//   const handleAddFunds = async (e) => {
//     e.preventDefault();
//     const userId = localStorage.getItem('userId');
//     const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

//     if (!amount || isNaN(amount) || amount <= 0) {
//       alert('Please enter a valid amount');
//       return;
//     }

//     try {
//       const response = await axios.post(`${API_BASE_URL}/api/wallet/add`, {
//         userId,
//         amount: parseFloat(amount),
//       });
//       console.log('Funds added:', response.data);
//       setUserData({ ...userData, wallet: response.data.wallet });
//       setAmount('');
//       alert('Funds added successfully!');
//     } catch (error) {
//       console.error('Error adding funds:', error.response?.data?.error || error.message);
//       alert('Failed to add funds');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('userId');
//     console.log('User logged out');
//     navigate('/login');
//   };

//   if (loading) return <div className="loading">Loading wallet...</div>;
//   if (!userData) return <div className="error">Unable to load wallet data. Please try again.</div>;

//   return (
//     <div className="wallet-container">
//       <nav className="navbar">
//         <Link to="/">Home</Link>
//         <Link to="/profile">Profile</Link>
//         <button onClick={handleLogout} className="logout-btn">Logout</button>
//       </nav>
//       <div className="wallet-card">
//         <h2>Your Wallet</h2>
//         <div className="balance-section">
//           <p className="balance-label">Current Balance:</p>
//           <p className="balance-amount">₹{userData.wallet || 0}</p>
//         </div>

//         <form onSubmit={handleAddFunds} className="add-funds-form">
//           <div className="input-group">
//             <label htmlFor="amount">Add Funds (₹)</label>
//             <input
//               type="number"
//               id="amount"
//               placeholder="Enter amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               min="1"
//             />
//           </div>
//           <button type="submit" className="add-btn">Add Funds</button>
//         </form>

//         <h3>Transaction History</h3>
//         <div className="transaction-history">
//           {userData.transactions && userData.transactions.length > 0 ? (
//             <table className="history-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Type</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {userData.transactions.map((tx, index) => (
//                   <tr key={index}>
//                     <td>{new Date(tx.date).toLocaleDateString()}</td>
//                     <td>₹{tx.amount}</td>
//                     <td>{tx.type}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No transactions yet</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Wallet;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Wallet.css';

function Wallet() {
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use the correct env variable

      if (!userId) {
        console.log('No userId found, redirecting to login');
        navigate('/login');
        return;
      }

      if (!API_BASE_URL) {
        console.error('REACT_APP_BACKEND_URL is not defined. Check your .env file.');
        alert('Backend URL is not configured. Please check the environment setup.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
        console.log('Fetched wallet data:', response.data);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wallet data:', error.response?.data?.error || error.message);
        if (error.response?.status === 401 || error.response?.status === 404) {
          console.log('Unauthorized or user not found, redirecting to login');
          localStorage.removeItem('userId');
          navigate('/login');
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use the correct env variable

    if (!userId) {
      console.log('No userId found, redirecting to login');
      navigate('/login');
      return;
    }

    if (!API_BASE_URL) {
      console.error('REACT_APP_BACKEND_URL is not defined. Check your .env file.');
      alert('Failed to add funds: Backend URL is not configured.');
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/wallet/add`, {
        userId,
        amount: parseFloat(amount),
      });
      console.log('Funds added:', response.data);
      setUserData({ ...userData, wallet: response.data.wallet });
      setAmount('');
      alert('Funds added successfully!');
    } catch (error) {
      console.error('Error adding funds:', error.response?.data?.error || error.message);
      alert('Failed to add funds');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    console.log('User logged out');
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading wallet...</div>;
  if (!userData) return <div className="error">Unable to load wallet data. Please try again.</div>;

  return (
    <div className="wallet-container">
      <nav className="navbar">
        <Link to="/home">Home</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
      <div className="wallet-card">
        <h2>Your Wallet</h2>
        <div className="balance-section">
          <p className="balance-label">Current Balance:</p>
          <p className="balance-amount">₹{userData.wallet || 0}</p>
        </div>

        <form onSubmit={handleAddFunds} className="add-funds-form">
          <div className="input-group">
            <label htmlFor="amount">Add Funds (₹)</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>
          <button type="submit" className="add-btn">Add Funds</button>
        </form>

        <h3>Transaction History</h3>
        <div className="transaction-history">
          {userData.transactions && userData.transactions.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {userData.transactions.map((tx, index) => (
                  <tr key={index}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>₹{tx.amount}</td>
                    <td>{tx.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;