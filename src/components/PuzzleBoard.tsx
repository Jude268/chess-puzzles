import React, { useState, useEffect } from 'react';
import { puzzleService } from '../services/api';
import './PuzzleBoard.css';

interface Puzzle {
  id: number;
  fen: string;
  moves: string[];
  rating: number;
}

interface PuzzleAnalysis {
  failureReason: string;
  aiAnalysis: string;
}

export const PuzzleBoard: React.FC = () => {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMove, setUserMove] = useState('');
  const [solved, setSolved] = useState(false);
  const [analysis, setAnalysis] = useState<PuzzleAnalysis | null>(null);
  const [timeStarted] = useState(Date.now());

  useEffect(() => {
    loadNextPuzzle();
  }, []);

  const loadNextPuzzle = async () => {
    try {
      setLoading(true);
      setAnalysis(null);
      setSolved(false);
      setUserMove('');
      const response = await puzzleService.getNextPuzzle();
      setPuzzle(response.data);
    } catch (error) {
      console.error('Error loading puzzle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMove = async () => {
    if (!puzzle || !userMove) return;

    const timeSpent = Date.now() - timeStarted;
    const isSolved = puzzle.moves[0] === userMove;

    try {
      const response = await puzzleService.recordAttempt({
        puzzleId: puzzle.id,
        solved: isSolved,
        userMove,
        correctMoves: puzzle.moves,
        fen: puzzle.fen,
        timeSpentMs: timeSpent,
      });

      setSolved(isSolved);
      setAnalysis({
        failureReason: response.data.failureReason || '',
        aiAnalysis: response.data.aiAnalysis || '',
      });
    } catch (error) {
      console.error('Error submitting move:', error);
    }
  };

  if (loading) {
    return (
      <div className="puzzle-container">
        <div className="puzzle-main">
          <div className="puzzle-board">
            <div className="loading-spinner">
              <p>Loading puzzle...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="puzzle-container">
        <div className="puzzle-main">
          <div className="puzzle-board">
            <p>No puzzle available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="puzzle-container">
      <div className="puzzle-main">
        <div className="puzzle-board">
          <h2>Chess Puzzle Challenge</h2>
          <div className="puzzle-info">
            <span className="rating">Rating: {puzzle.rating}</span>
            <span className="difficulty">Difficulty: {puzzle.rating > 1800 ? 'Hard' : puzzle.rating > 1400 ? 'Medium' : 'Easy'}</span>
          </div>
          <div className="fen-display">
            <strong>Position:</strong> {puzzle.fen}
          </div>
          <div className="solution-display">
            <strong>Solution:</strong>
            <div className="moves-sequence">
              {puzzle.moves.map((move, idx) => (
                <span key={idx} className="move-badge">{move}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="puzzle-input">
          <input
            type="text"
            placeholder="Enter your move (e.g., e4, Nxe5)"
            value={userMove}
            onChange={(e) => setUserMove(e.target.value.toUpperCase())}
            disabled={solved}
            autoFocus
          />
          <button onClick={handleSubmitMove} disabled={!userMove || solved}>
            {solved ? '✓ Submitted' : 'Submit'}
          </button>
        </div>

        {solved && (
          <div className={`puzzle-result ${solved ? 'success' : 'failure'}`}>
            <h3>{solved ? '✓ Excellent! Correct Move!' : '✗ Incorrect'}</h3>
          </div>
        )}
      </div>

      {analysis && (
        <div className="puzzle-analysis">
          <h3>AI Analysis & Insights</h3>
          {analysis.failureReason && !solved && (
            <div className="failure-reason">
              <strong>Why You Failed</strong>
              <p>{analysis.failureReason}</p>
            </div>
          )}
          {analysis.aiAnalysis && (
            <div className="ai-insights">
              <strong>Learning Insights</strong>
              <p>{analysis.aiAnalysis}</p>
            </div>
          )}
          <button onClick={loadNextPuzzle} className="next-button">
            ➜ Next Puzzle
          </button>
        </div>
      )}
    </div>
  );
};

export default PuzzleBoard;
