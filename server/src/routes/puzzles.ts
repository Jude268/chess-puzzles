import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { getPuzzleForUser, savePuzzle, fetchPuzzlesFromChessCom } from '../services/puzzleService.js';
import { recordPuzzleAttempt, getUserStats, getFailureStats, getPuzzleHistory } from '../services/attemptService.js';
import { analyzeFailedPuzzle, generateFailureReason } from '../services/aiService.js';

const router = Router();

router.get('/next', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const puzzle = await getPuzzleForUser(userId);

    if (!puzzle) {
      // Fetch new puzzles from Chess.com if none available
      const newPuzzles = await fetchPuzzlesFromChessCom(1);
      if (newPuzzles.length > 0) {
        await savePuzzle(newPuzzles[0]);
        const nextPuzzle = await getPuzzleForUser(userId);
        return res.json(nextPuzzle);
      }
      return res.status(404).json({ error: 'No puzzles available' });
    }

    res.json(puzzle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/attempt', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { puzzleId, solved, userMove, correctMoves, timeSpentMs } = req.body;

    if (!puzzleId || userMove === undefined || !Array.isArray(correctMoves)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let failureReason = '';
    let aiAnalysis = '';

    if (!solved) {
      // Generate failure reason using AI
      failureReason = await generateFailureReason(
        req.body.fen,
        userMove,
        correctMoves[0]
      );

      // Generate detailed analysis
      aiAnalysis = await analyzeFailedPuzzle(
        req.body.fen,
        userMove,
        correctMoves,
        failureReason
      );
    }

    const attemptId = await recordPuzzleAttempt(
      userId,
      puzzleId,
      solved,
      timeSpentMs || 0,
      userMove,
      failureReason,
      aiAnalysis
    );

    res.json({
      attemptId,
      failureReason,
      aiAnalysis,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const stats = await getUserStats(userId);
    const failureStats = await getFailureStats(userId);

    res.json({
      overallStats: stats,
      failureBreakdown: failureStats,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const history = await getPuzzleHistory(userId, limit, offset);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
