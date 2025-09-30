'use client';

import { MatchData } from '@/types';
import { formatOvers } from '@/lib/utils';

interface TeamScoreDisplayProps {
  match: MatchData;
}

export default function TeamScoreDisplay({ match }: TeamScoreDisplayProps) {
  // Helper function to determine batting team based on actual live score data
  const getBattingTeam = (match: any): 'team1' | 'team2' => {
    if (!match.liveScore) return 'team1'; // Default fallback
    
    // Use actual live score data to determine which team is batting
    // The team with runs > 0 or overs > 0 is the batting team
    const team1Score = match.liveScore.team1;
    const team2Score = match.liveScore.team2;
    
    // If team1 has runs or overs, they're batting
    if (team1Score.runs > 0 || team1Score.overs > 0) {
      return 'team1';
    }
    
    // If team2 has runs or overs, they're batting
    if (team2Score.runs > 0 || team2Score.overs > 0) {
      return 'team2';
    }
    
    // If both teams have 0 runs and 0 overs, use toss information as fallback
    if (match.tossInfo) {
      const currentInnings = match.ballInfo?.currentInnings || 1;
      
      if (currentInnings === 1) {
        // First innings - use toss decision
        if (match.tossInfo.wonBy === match.team1) {
          return match.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
        } else { // Other team won the toss
          return match.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
        }
      } else {
        // Second innings - opposite of first innings
        if (match.tossInfo.wonBy === match.team1) {
          return match.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
        } else { // Other team won the toss
          return match.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
        }
      }
    }
    
    return 'team1'; // Default fallback
  };

  const battingTeam = getBattingTeam(match);
  const battingTeamData = battingTeam === 'team1' ? match.liveScore.team1 : match.liveScore.team2;
  const battingTeamName = battingTeam === 'team1' ? match.team1 : match.team2;
  const bowlingTeam = battingTeam === 'team1' ? 'team2' : 'team1';
  const bowlingTeamData = bowlingTeam === 'team1' ? match.liveScore.team1 : match.liveScore.team2;
  const bowlingTeamName = bowlingTeam === 'team1' ? match.team1 : match.team2;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Batting Team Score */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300 shadow-lg hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">{battingTeamName}</div>
          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
            🏏 BATTING
          </div>
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">
          {battingTeamData.runs}/{Math.min(battingTeamData.wickets, 10)}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          ({formatOvers(battingTeamData.balls || 0)} overs)
        </div>
      </div>

      {/* Bowling Team Score */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">{bowlingTeamName}</div>
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            🏟️ BOWLING
          </div>
        </div>
        <div className="text-4xl font-black text-gray-900 mb-1">
          {bowlingTeamData.runs}/{Math.min(bowlingTeamData.wickets, 10)}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          ({formatOvers(bowlingTeamData.balls || 0)} overs)
        </div>
      </div>
    </div>
  );
}
