'use client';

import { MatchData } from '@/types';

interface MatchResultDisplayProps {
  match: MatchData;
  matchResult: {
    winner: string;
    margin: string;
    method: string;
  } | null;
}

export default function MatchResultDisplay({ match, matchResult }: MatchResultDisplayProps) {
  if (match.status !== 'completed' || !matchResult) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-4">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🏆</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-green-800 mb-1">
              {matchResult.winner} WINS!
            </h2>
            <p className="text-green-700 font-semibold">
              Won by {matchResult.margin}
            </p>
          </div>
        </div>
        <div className="text-sm text-green-600">
          🎉 Congratulations to the winning team! 🎉
        </div>
      </div>
    </div>
  );
}
