import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

interface AuthProps {
  type: 'login' | 'register';
}

export const Auth: React.FC<AuthProps> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response =
        type === 'login'
          ? await authService.login(email, password)
          : await authService.register(email, username, password);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{type === 'login' ? 'Login' : 'Register'}</h1>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {type === 'register' && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : type === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          {type === 'login' ? (
            <>
              Don't have an account? <a href="/register">Register here</a>
            </>
          ) : (
            <>
              Already have an account? <a href="/login">Login here</a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
