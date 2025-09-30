'use client';

import { MatchData } from '@/types';

interface BatsmanStatsProps {
  match: MatchData;
}

export default function BatsmanStats({ match }: BatsmanStatsProps) {
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

  if (!match.batsmanStats) {
    return null;
  }

  const currentBattingTeam = getBattingTeam(match);
  const currentBatsmen = match.batsmanStats[currentBattingTeam]
    .filter(b => !b.isOut) // Only show batsmen who are not out
    .sort((a, b) => {
      if (a.isOnStrike && !b.isOnStrike) return -1;
      if (!a.isOnStrike && b.isOnStrike) return 1;
      return b.runs - a.runs;
    })
    .slice(0, 2); // Only show the first 2 batsmen (current batsmen at crease)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-700">Current Batsmen</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentBatsmen.map((batsman, index) => (
          <div key={index} className={`p-5 rounded-xl border-2 transition-all ${
            batsman.isOnStrike 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md' 
              : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
          }`}>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-lg leading-tight">{batsman.name}</span>
                    {batsman.isOnStrike && (
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Runs & Balls */}
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900 mb-1">{batsman.runs}</div>
                <div className="text-xs text-gray-500 font-medium">RUNS</div>
                <div className="text-xs text-gray-400 mt-1">({batsman.balls} balls)</div>
              </div>
              
              {/* Strike Rate */}
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {batsman.balls > 0 ? batsman.strikeRate.toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-gray-500 font-medium">STRIKE RATE</div>
              </div>
              
              {/* Boundaries */}
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="flex justify-center space-x-3 mb-1">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{batsman.fours}</div>
                    <div className="text-xs text-gray-500">4s</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{batsman.sixes}</div>
                    <div className="text-xs text-gray-500">6s</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium">BOUNDARIES</div>
              </div>
            </div>
            
            {/* Performance Indicator */}
            <div className="flex items-center justify-center">
              <div className={`w-full h-2 rounded-full ${
                batsman.strikeRate >= 150 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                batsman.strikeRate >= 120 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                batsman.strikeRate >= 100 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                'bg-gradient-to-r from-gray-300 to-gray-400'
              }`}>
                <div className="h-full bg-white bg-opacity-30 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
