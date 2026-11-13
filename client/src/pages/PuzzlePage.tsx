import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PuzzleBoard from '../components/PuzzleBoard';
import './PuzzlePage.css';

export const PuzzlePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="puzzle-page">
      <header className="puzzle-header">
        <h1>♔ Chess Puzzle Trainer</h1>
        <nav className="puzzle-nav">
          <a href="/dashboard">Dashboard</a>
          <a href="/history">History</a>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main>
        <PuzzleBoard />
      </main>
    </div>
  );
};

export default PuzzlePage;
