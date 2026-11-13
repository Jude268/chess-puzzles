import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeFailedPuzzle = async (
  fen: string,
  userMove: string,
  correctMoves: string[],
  failureReason: string
): Promise<string> => {
  try {
    const prompt = `
You are a chess master analyzing why a player failed a puzzle.

FEN Position: ${fen}
User's Move: ${userMove}
Correct Solution: ${correctMoves.join(' → ')}
Failure Reason: ${failureReason}

Please provide:
1. Why this puzzle was failed
2. Key concepts the player missed
3. What to study to improve
4. Practical tips for similar positions

Keep the analysis concise and actionable.
    `;

    const message = await openai.messages.create({
      model: 'gpt-4',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text;
    }

    return 'Unable to generate analysis';
  } catch (error) {
    console.error('Error analyzing puzzle with OpenAI:', error);
    return 'Analysis temporarily unavailable';
  }
};

export const generateFailureReason = async (
  fen: string,
  userMove: string,
  correctMove: string
): Promise<string> => {
  try {
    const prompt = `
Analyze this failed chess move and categorize the failure reason.

FEN: ${fen}
User played: ${userMove}
Correct move was: ${correctMove}

Choose ONE of these categories:
- wrong_move: Illegal or invalid move
- time_expired: Ran out of time
- incomplete_sequence: Didn't complete the full sequence
- missed_best_move: Played inferior move instead of best
- blundered: Played a move that hangs material
- misunderstood_position: Misread the position

Respond with ONLY the category code (e.g., "wrong_move"), nothing else.
    `;

    const message = await openai.messages.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      return textContent.text.trim().toLowerCase();
    }

    return 'wrong_move';
  } catch (error) {
    console.error('Error generating failure reason:', error);
    return 'wrong_move';
  }
};
