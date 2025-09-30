'use client';

import { MatchData } from '@/types';
import { formatOvers } from '@/lib/utils';

interface CurrentBowlerProps {
  match: MatchData;
}

export default function CurrentBowler({ match }: CurrentBowlerProps) {
  // Helper function to determine batting team
  const getBattingTeam = (match: any): 'team1' | 'team2' => {
    if (!match.liveScore) return 'team1';
    
    const team1Score = match.liveScore.team1;
    const team2Score = match.liveScore.team2;
    
    if (team1Score.runs > 0 || team1Score.overs > 0) {
      return 'team1';
    }
    
    if (team2Score.runs > 0 || team2Score.overs > 0) {
      return 'team2';
    }
    
    return 'team1';
  };

  if (!match.bowlerStats) {
    return null;
  }

  const currentBowlingTeam = getBattingTeam(match) === 'team1' ? 'team2' : 'team1';
  const currentBowlers = match.bowlerStats[currentBowlingTeam].filter(b => b.isBowling);

  return (
    <div>
      <div className="text-sm font-semibold text-gray-700 mb-3">Current Bowler</div>
      {currentBowlers.map((bowler, index) => (
        <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 text-base">{bowler.name}</span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
              BOWLING
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{formatOvers(bowler.balls || 0)}</div>
              <div className="text-xs text-gray-600">Overs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{bowler.runs}/{bowler.wickets}</div>
              <div className="text-xs text-gray-600">Runs/Wkts</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${
                bowler.economy < 6 ? 'text-green-600' :
                bowler.economy < 8 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {bowler.economy.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Economy</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
