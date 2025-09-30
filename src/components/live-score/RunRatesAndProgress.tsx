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

  const ballInfo = (match as any).ballInfo;
  const target = ballInfo?.target || 0;
  const battingTeamKey = (ballInfo?.currentBattingTeam || 'team1') as 'team1' | 'team2';
  const battingTeam = match.liveScore[battingTeamKey];
  const ballsPlayed = battingTeam.balls || 0;
  const runsScored = battingTeam.runs || 0;

  // Overs in decimal format (e.g., 1.0 after 6 balls)
  const overs = Math.floor(ballsPlayed / 6) + (ballsPlayed % 6) / 6;

  // Current Run Rate
  const currentRR = ballsPlayed > 0 ? +(runsScored / overs).toFixed(2) : 0;

  // Required Run Rate
  const oversLeft = Math.max(0, 20 - overs);
  const runsLeft = Math.max(0, target - runsScored);
  const requiredRR = oversLeft > 0 ? +(runsLeft / oversLeft).toFixed(2) : runsLeft;

  return (
    <div>
      <div className="text-sm font-semibold text-gray-700 mb-3">Run Rates</div>
      <div className="space-y-3">
        {/* Current Run Rate */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-gray-600 mb-1">Current Run Rate</div>
          <div className="text-2xl font-bold text-blue-600">{currentRR.toFixed(2)}</div>
        </div>

        {/* Match Progress (2nd Innings) */}
        {ballInfo?.currentInnings === 2 && match.status === 'live' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm font-semibold text-gray-800 mb-3">
              Match Progress - {match.team1} vs {match.team2}
            </div>
            <div className="text-xs text-gray-600 mb-3">
              {`${match.liveScore.team1.runs} / ${match.liveScore.team1.wickets} (1st innings) → ${battingTeamKey === 'team1' ? match.team1 : match.team2} needs ${target} to win`}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Runs Scored: {runsScored}</span>
                <span>Target: {target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (runsScored / Math.max(target, 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Runs Needed</div>
                <div className="text-lg font-bold text-red-600">{runsLeft}</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Overs Left</div>
                <div className="text-lg font-bold text-blue-600">{oversLeft.toFixed(1)}</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Required RR</div>
                <div className="text-lg font-bold text-orange-600">{requiredRR.toFixed(2)}</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Wickets Lost</div>
                <div className="text-lg font-bold text-red-600">{battingTeam.wickets || 0}</div>
              </div>
            </div>

            {/* Match Prediction */}
            <div className="mt-3 p-2 bg-white rounded-lg border border-gray-200">
              <div className="text-xs font-medium text-gray-600 mb-1">Match Status</div>
              <div className="text-sm font-semibold">
                {runsScored >= target
                  ? <span className="text-green-600">🏆 Target Achieved!</span>
                  : currentRR >= requiredRR
                  ? <span className="text-blue-600">⚡ On track to win</span>
                  : <span className="text-orange-600">⚠️ Needs to accelerate</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
