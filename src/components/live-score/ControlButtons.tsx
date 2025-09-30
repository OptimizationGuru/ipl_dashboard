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
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
      {/* Hidden and disabled: Refresh button */}
      {/* <button
        onClick={onRefresh}
        disabled={true}
        className="text-xs bg-black text-white px-2 sm:px-3 py-1.5 rounded hover:bg-gray-800 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🔄 <span className="hidden sm:inline">Refresh</span>
      </button> */}
      
      <button
        onClick={onNextBall}
        disabled={isLoading}
        className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 sm:px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 shadow-md hover:shadow-lg"
      >
        ⚡ Next Ball
      </button>
      
      <button
        onClick={onReset}
        disabled={isLoading}
        className="text-xs bg-gradient-to-r from-red-500 to-rose-600 text-white px-2 sm:px-3 py-1.5 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50 shadow-md hover:shadow-lg"
      >
        🔄 Reset
      </button>
      
      {/* Hidden and disabled: Random Teams button */}
      {/* <button
        onClick={onRandomTeams}
        disabled={true}
        className="text-xs bg-purple-600 text-white px-2 sm:px-3 py-1.5 rounded hover:bg-purple-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🎲 <span className="hidden sm:inline">Random Teams</span>
      </button> */}
      
      {/* Hidden and disabled: CSK vs KKR button */}
      {/* <button
        onClick={() => onSpecificTeams('Chennai Super Kings', 'Kolkata Knight Riders')}
        disabled={true}
        className="text-xs bg-orange-600 text-white px-2 sm:px-3 py-1.5 rounded hover:bg-orange-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
      >
        🏏 <span className="hidden sm:inline">CSK vs KKR</span>
      </button> */}
    </div>
  );
}
