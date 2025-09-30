'use client';

import { MatchData } from '@/types';

interface RunRatesAndProgressProps {
  match: MatchData;
}

export default function RunRatesAndProgress({ match }: RunRatesAndProgressProps) {
  if (!match.liveScore) {
    return (
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-3">Run Rates</div>
        <div className="text-center text-gray-500 py-4">No live score data available</div>
      </div>
    );
  }

  // Use the same batting team detection logic as BatsmanStats
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

  const battingTeamKey = getBattingTeam(match);
  const battingTeam = match.liveScore[battingTeamKey];
  const ballsPlayed = battingTeam.balls || 0;
  const runsScored = battingTeam.runs || 0;

  // Calculate run rate: runs per over (6 balls = 1 over)
  const currentRR = ballsPlayed > 0 ? +(runsScored / (ballsPlayed / 6)).toFixed(2) : 0;

  return (
    <div>
      <div className="text-sm font-semibold text-gray-700 mb-3">Run Rates</div>
      <div className="space-y-3">
        {/* Current Run Rate */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-gray-600 mb-1">Current Run Rate</div>
          <div className="text-2xl font-bold text-blue-600">{currentRR.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}