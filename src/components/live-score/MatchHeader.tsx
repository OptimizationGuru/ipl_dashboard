'use client';

import { MatchData } from '@/types';

interface MatchHeaderProps {
  match: MatchData;
  lastUpdated: Date;
  isLoading: boolean;
  countdown: number;
  isClient: boolean;
}

export default function MatchHeader({
  match,
  lastUpdated,
  isLoading,
  countdown,
  isClient
}: MatchHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-slate-600 to-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {match.status === 'completed' ? (
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          ) : (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
          )}
          <span className="text-white font-bold text-lg">
            {match.status === 'completed' ? 'MATCH RESULT' : 'LIVE SCORE'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-black border border-white border-opacity-30 shadow-sm">
            <span className="mr-2">🕐</span>
            Last Updated at: {isClient ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Loading...'}
            {isLoading && <span className="ml-2 animate-spin">🔄</span>}
          </div>
          {match.status === 'live' && (
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-black border border-white border-opacity-30 shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Next ball: {countdown}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
