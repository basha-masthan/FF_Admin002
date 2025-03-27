import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css"; // Import the updated CSS

function Landing() {
  return (
    <div className="landing">
      <div className="overlay"></div> 
      <div className="content">
        <h1>🔥 Welcome to Free Fire Tournaments 🔥</h1>
        <p className="tagline">Join Now & Become the Ultimate Champion!</p>

        {/* Live Stats Section */}
        <div className="live-stats">
          <div className="stat-box">
            <h3>🏆 500+</h3>
            <p>Ongoing Matches</p>
          </div>
          <div className="stat-box">
            <h3>🎮 10K+</h3>
            <p>Registered Players</p>
          </div>
          <div className="stat-box">
            <h3>💰 $50K+</h3>
            <p>Prize Money Distributed</p>
          </div>
        </div>

        {/* Offers & Rewards */}
        <div className="offers">
          <p>🎁 <span>New Users:</span> Get 50% Bonus on First Deposit</p>
          <p>🏆 <span>Top Gamers:</span> Exclusive Rewards Await</p>
        </div>

        {/* Action Buttons */}
        <div className="buttons">
          <Link to="/signup" className="btn neon-btn">🚀 Register</Link>
          <Link to="/login" className="btn neon-btn">🎮 Login</Link>
        </div>

        {/* Upcoming Tournaments */}
        <div className="tournaments">
          <h2>🎯 Upcoming Tournaments</h2>
          <ul>
            <li><strong>🔥 Battle Royale Mega Event</strong> - March 30, 2025</li>
            <li><strong>⚔️ Solo Survivor Challenge</strong> - April 5, 2025</li>
            <li><strong>💣 Squad Showdown</strong> - April 10, 2025</li>
          </ul>
        </div>

        {/* Leaderboard Preview */}
        <div className="leaderboard">
          <h2>🏆 Top Players</h2>
          <ul>
            <li>🥇 <strong>GamerX</strong> - 15 Wins</li>
            <li>🥈 <strong>ShadowKill</strong> - 12 Wins</li>
            <li>🥉 <strong>FireStorm</strong> - 10 Wins</li>
          </ul>
          <Link to="/leaderboard" className="btn neon-btn">View Leaderboard</Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
