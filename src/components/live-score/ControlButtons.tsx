'use client';

import { MatchData } from '@/types';

interface ControlButtonsProps {
  matchId: string;
  isLoading: boolean;
  onRefresh: () => void;
  onNextBall: () => void;
  onReset: () => void;
  onRandomTeams: () => void;
  onSpecificTeams: (team1: string, team2: string) => void;
}

export default function ControlButtons({
  matchId,
  isLoading,
  onRefresh,
  onNextBall,
  onReset,
  onRandomTeams,
  onSpecificTeams
}: ControlButtonsProps) {
  return (
    <div className="flex items-center justify-center space-x-3 mb-6">
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🔄 Refresh
      </button>
      
      <button
        onClick={onNextBall}
        disabled={isLoading}
        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        ⚡ Next Ball
      </button>
      
      <button
        onClick={onReset}
        disabled={isLoading}
        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🔄 Reset
      </button>
      
      <button
        onClick={onRandomTeams}
        disabled={isLoading}
        className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🎲 Random Teams
      </button>
      
      <button
        onClick={() => onSpecificTeams('Chennai Super Kings', 'Kolkata Knight Riders')}
        disabled={isLoading}
        className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🏏 CSK vs KKR
      </button>
    </div>
  );
}
