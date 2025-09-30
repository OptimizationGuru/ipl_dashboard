'use client';

import { MatchData, CricketEvent } from '@/types';

interface LiveCommentaryProps {
  match: MatchData;
  onNextBall: () => void;
  countdown: number;
  isLoading: boolean;
}

export default function LiveCommentary({ match, onNextBall, countdown, isLoading }: LiveCommentaryProps) {
  // Get commentary from match data
  const commentary = match.commentaryHistory || [];
  
  return (
    <div className="mt-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-700">Live Commentary (Last 3 Overs)</div>
          <button
            onClick={onNextBall}
            disabled={countdown > 2 || isLoading}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 font-semibold shadow-sm ${
              countdown <= 2 && !isLoading
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? '⏳' : '⚡'} Next Ball
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {commentary.length > 0 ? (
            commentary.slice(-10).reverse().map((event: CricketEvent, index: number) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-green-100 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {event.description || 'Ball played'}
                    </div>
                    <div className="text-xs text-gray-600">
                      {event.batsman && `Batsman: ${event.batsman}`}
                      {event.bowler && ` • Bowler: ${event.bowler}`}
                      {event.runs !== undefined && ` • Runs: ${event.runs}`}
                    </div>
                  </div>
                  <div className="ml-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      event.type === 'wicket' ? 'bg-red-100 text-red-800' :
                      event.type === 'wide' ? 'bg-yellow-100 text-yellow-800' :
                      event.type === 'noball' ? 'bg-orange-100 text-orange-800' :
                      event.runs === 4 ? 'bg-green-100 text-green-800' :
                      event.runs === 6 ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.type === 'wicket' ? 'W' :
                       event.type === 'wide' ? 'wd' :
                       event.type === 'noball' ? 'nb' :
                       event.runs || '0'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏏</div>
              <div className="text-sm">No commentary available yet</div>
              <div className="text-xs mt-1">Commentary will appear as the match progresses</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
