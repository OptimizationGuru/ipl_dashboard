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
    <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6">
      {/* Hidden: Refresh button (redundant with Next Ball) */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="hidden px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🔄 Refresh
      </button>
      
      <button
        onClick={onNextBall}
        disabled={isLoading}
        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ⚡ Next Ball
      </button>
      
      <button
        onClick={onReset}
        disabled={isLoading}
        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🔄 Reset
      </button>
      
      <button
        onClick={onRandomTeams}
        disabled={isLoading}
        className="hidden px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🎲 Random Teams
      </button>
      
      {/* Hidden: CSK vs KKR button (redundant with Random Teams) */}
      <button
        onClick={() => onSpecificTeams('Chennai Super Kings', 'Kolkata Knight Riders')}
        disabled={isLoading}
        className="hidden px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🏏 CSK vs KKR
      </button>
    </div>
  );
}
