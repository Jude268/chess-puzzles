# Chess Puzzle Platform

A full-stack chess puzzle training platform with AI-powered insights for analyzing failed puzzles.

## Features

✨ **Core Features:**
- User authentication (register/login with JWT)
- Dynamic puzzle loading from Chess.com API
- Smart puzzle selection (never repeats solved puzzles)
- Real-time puzzle attempt recording
- AI-powered failure analysis using OpenAI

📊 **Analytics:**
- Comprehensive statistics dashboard
- Failure reason categorization
- Success rate tracking
- Average solve time metrics
- Historical puzzle performance

🧠 **AI Insights:**
- Automatic failure reason detection
- Detailed move analysis
- Learning recommendations
- Position understanding guidance

## Project Structure

```
chess-puzzle-platform/
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── db.ts          # Database configuration
│   │   ├── middleware/    # Authentication middleware
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── database/      # Migrations
│   ├── package.json
│   └── tsconfig.json
└── client/                 # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── services/      # API client
    │   ├── App.tsx        # Main app component
    │   └── index.tsx      # Entry point
    ├── package.json
    └── public/            # Static files
```

## Tech Stack

**Backend:**
- Node.js with Express
- TypeScript
- PostgreSQL (database)
- OpenAI GPT API (AI analysis)
- JWT (authentication)

**Frontend:**
- React 18
- TypeScript
- React Router
- Axios (HTTP client)

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 12+
- OpenAI API key
- Chess.com API access

### 1. Install Dependencies

```bash
npm run setup
```

This will install dependencies for both server and client.

### 2. Configure Environment Variables

**Server (server/.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/chess_puzzle_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=3001
CHESS_COM_API_BASE=https://api.chess.com/pub
OPENAI_API_KEY=your_openai_key_here
FRONTEND_URL=http://localhost:3000
```

**Client (client/.env):**
```
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Create PostgreSQL Database

```sql
CREATE DATABASE chess_puzzle_db;
```

The server will automatically run migrations on startup.

### 4. Start Development

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)

### Puzzles
- `GET /api/puzzles/next` - Get next unsolved puzzle
- `POST /api/puzzles/attempt` - Record puzzle attempt
- `GET /api/puzzles/stats` - Get user statistics
- `GET /api/puzzles/history` - Get puzzle history with pagination

## Features in Detail

### Smart Puzzle Selection
The platform automatically selects puzzles the user hasn't solved yet, preventing repetition while building a personalized puzzle experience.

### Failure Reason Categories
When a puzzle is failed, the system categorizes the failure as:
- `wrong_move` - Illegal or invalid move
- `time_expired` - Ran out of time
- `incomplete_sequence` - Didn't complete the full sequence
- `missed_best_move` - Played inferior move
- `blundered` - Hung material
- `misunderstood_position` - Misread the position

### AI Analysis
Each failed puzzle receives:
1. **Automatic Categorization** - ML-based failure reason detection
2. **Detailed Analysis** - Specific insights about why the puzzle was missed
3. **Learning Recommendations** - Concepts to study for improvement
4. **Position Guidance** - Practical tips for similar positions

## Deployment

### Vercel (Frontend)
```bash
cd client
npm run build
vercel deploy
```

### Heroku/Railway (Backend)
```bash
cd server
npm run build
```

Set environment variables on your hosting platform and deploy.

## Future Enhancements

- [ ] Real-time chess board visualization
- [ ] Puzzle difficulty ratings
- [ ] Spaced repetition algorithm
- [ ] Social features (leaderboards)
- [ ] Puzzle collections by theme
- [ ] Move suggestions
- [ ] Video analysis integration
- [ ] Mobile app (React Native)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
