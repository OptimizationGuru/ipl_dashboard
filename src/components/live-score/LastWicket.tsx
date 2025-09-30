'use client';

import { MatchData, WicketDetails } from '@/types';

interface LastWicketProps {
  match: MatchData;
}

export default function LastWicket({ match }: LastWicketProps) {
  if (!match.lastWicket || !match.lastWicket.batsman || match.lastWicket.batsman === 'No batsman' || match.lastWicket.fallOfWicket === '0/0') {
    // Show current match state when no wicket has fallen
    return (
      <div className="mt-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">Current Score</div>
            <div className="text-xs text-gray-500">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                LIVE
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">📊</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {(match.liveScore?.team1.runs || 0) < (match.liveScore?.team2.runs || 0) ? match.team2 : match.team1}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.max(match.liveScore?.team1.runs || 0, match.liveScore?.team2.runs || 0)}/{Math.max(match.liveScore?.team1.wickets || 0, match.liveScore?.team2.wickets || 0)} - {Math.max(match.liveScore?.team1.runs || 0, match.liveScore?.team2.runs || 0)} runs for {Math.max(match.liveScore?.team1.wickets || 0, match.liveScore?.team2.wickets || 0)} wickets
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{Math.max(match.liveScore?.team1.runs || 0, match.liveScore?.team2.runs || 0)}</div>
                <div className="text-xs text-gray-500">runs</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Current Score:</span> {Math.max(match.liveScore?.team1.runs || 0, match.liveScore?.team2.runs || 0)}/{Math.max(match.liveScore?.team1.wickets || 0, match.liveScore?.team2.wickets || 0)}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Overs:</span> {Math.max(match.liveScore?.team1.overs || 0, match.liveScore?.team2.overs || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-700">Last Wicket</div>
          <div className="text-xs text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
              WICKET
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg">W</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{match.lastWicket.batsman}</div>
                <div className="text-sm text-gray-600">
                  {match.lastWicket.runs}({match.lastWicket.balls}) - {match.lastWicket.runs} runs in {match.lastWicket.balls} balls
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">{match.lastWicket.runs}</div>
              <div className="text-xs text-gray-500">runs</div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Fall of wicket:</span> {match.lastWicket.fallOfWicket}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Over:</span> {match.lastWicket.over}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
