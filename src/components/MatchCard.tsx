'use client';

import { MatchData } from '@/types';

interface MatchCardProps {
  match: MatchData;
  showLiveScore?: boolean;
}

export default function MatchCard({ match, showLiveScore = true }: MatchCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      {/* Header with status */}
      <div className="flex justify-between items-center mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
          {getStatusText(match.status)}
        </span>
        {match.status === 'live' && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-xs text-red-600 font-medium">LIVE</span>
          </div>
        )}
      </div>

      {/* Teams */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-800">{match.team1}</span>
          {match.liveScore && showLiveScore && (
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {match.liveScore.team1.runs}/{match.liveScore.team1.wickets} ({match.liveScore.team1.overs})
            </span>
          )}
        </div>
        <div className="text-center text-gray-500 text-sm mb-2">VS</div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">{match.team2}</span>
          {match.liveScore && showLiveScore && (
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {match.liveScore.team2.runs}/{match.liveScore.team2.wickets} ({match.liveScore.team2.overs})
            </span>
          )}
        </div>
      </div>

      {/* Live match details */}
      {match.status === 'live' && match.liveScore && showLiveScore && (
        <div className="bg-gray-50 rounded p-3 mb-3">
          <div className="text-xs text-gray-600 mb-2">Current Situation</div>
          {match.liveScore.currentBatsman && (
            <div className="text-sm">
              <span className="text-gray-600">Batting: </span>
              <span className="font-medium">{match.liveScore.currentBatsman}</span>
            </div>
          )}
          {match.liveScore.currentBowler && (
            <div className="text-sm">
              <span className="text-gray-600">Bowling: </span>
              <span className="font-medium">{match.liveScore.currentBowler}</span>
            </div>
          )}
          {match.liveScore.requiredRunRate && (
            <div className="text-sm">
              <span className="text-gray-600">Required RR: </span>
              <span className="font-medium">{match.liveScore.requiredRunRate}</span>
            </div>
          )}
        </div>
      )}

      {/* Match details */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            <div className="font-medium">{match.venue}</div>
            <div>{match.date} • {match.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
