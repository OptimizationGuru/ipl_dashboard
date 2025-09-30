import { useState, useEffect } from 'react';
import { MatchData } from '@/types';

interface MatchResult {
  winner: string;
  margin: string;
  method: string;
}

export function useMatchResult(match: MatchData) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const calculateResult = (match: MatchData): MatchResult | null => {
    if (match.status !== 'completed' || !match.liveScore) return null;

    const team1Score = match.liveScore.team1;
    const team2Score = match.liveScore.team2;
    
    if (team1Score.runs > team2Score.runs) {
      return {
        winner: match.team1,
        margin: `${team1Score.runs - team2Score.runs} runs`,
        method: 'Runs'
      };
    } else if (team2Score.runs > team1Score.runs) {
      return {
        winner: match.team2,
        margin: `${team2Score.runs - team1Score.runs} runs`,
        method: 'Runs'
      };
    } else {
      return {
        winner: 'Match Tied',
        margin: '0 runs',
        method: 'Tie'
      };
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  // Check for match completion
  useEffect(() => {
    const result = calculateResult(match);
    if (result) {
      setMatchResult(result);
      triggerConfetti();
    }
  }, [match.status, match.liveScore, match.team1, match.team2]);

  return {
    showConfetti,
    matchResult,
  };
}
