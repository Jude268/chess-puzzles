import React, { useState, useEffect } from 'react';
import { puzzleService } from '../services/api';
import './Dashboard.css';

interface Stats {
  overallStats: {
    total_attempts: number;
    puzzles_solved: number;
    puzzles_failed: number;
    success_rate: number;
    avg_time_solved_ms: number;
  };
  failureBreakdown: Array<{
    failure_reason: string;
    count: number;
    percentage: number;
  }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await puzzleService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading stats...</p></div>;
  }

  if (!stats) {
    return <div className="dashboard-container"><p>No stats available</p></div>;
  }

  const { overallStats, failureBreakdown } = stats;

  return (
    <div className="dashboard-container">
      <h1>Your Chess Puzzle Stats</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <p className="stat-value">{overallStats.total_attempts}</p>
        </div>

        <div className="stat-card">
          <h3>Puzzles Solved</h3>
          <p className="stat-value">{overallStats.puzzles_solved}</p>
        </div>

        <div className="stat-card">
          <h3>Puzzles Failed</h3>
          <p className="stat-value">{overallStats.puzzles_failed}</p>
        </div>

        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">{overallStats.success_rate || 0}%</p>
        </div>

        <div className="stat-card">
          <h3>Avg Time (Solved)</h3>
          <p className="stat-value">
            {overallStats.avg_time_solved_ms
              ? (overallStats.avg_time_solved_ms / 1000).toFixed(1) + 's'
              : '-'}
          </p>
        </div>
      </div>

      <div className="failure-breakdown">
        <h2>Why You Failed Puzzles</h2>
        {failureBreakdown.length > 0 ? (
          <div className="failure-list">
            {failureBreakdown.map((failure, idx) => (
              <div key={idx} className="failure-item">
                <div className="failure-label">
                  {failure.failure_reason.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div className="failure-stats">
                  <span className="count">{failure.count} times</span>
                  <span className="percentage">{failure.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${failure.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No failures recorded yet. Keep solving puzzles!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
