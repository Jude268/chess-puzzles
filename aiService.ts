// import { OpenAI } from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const analyzeFailedPuzzle = async (
  fen: string,
  userMove: string,
  correctMoves: string[],
  failureReason: string
): Promise<string> => {
  // TODO: Re-enable when OpenAI key is added
  return 'AI analysis coming soon';
};

export const generateFailureReason = async (
  fen: string,
  userMove: string,
  correctMove: string
): Promise<string> => {
  // TODO: Re-enable when OpenAI key is added
  return 'wrong_move';
};
