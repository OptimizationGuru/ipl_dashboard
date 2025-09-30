'use client';

import { useState } from 'react';
import LiveScoreWidget from './LiveScoreWidget';
import PlayingXI from './PlayingXI';
import { MatchData } from '@/types';
import { useLiveScore } from '@/hooks/useLiveScore';

interface MatchTabsProps {
  match: MatchData;
  onMatchUpdate?: () => void;
}

export default function MatchTabs({ match, onMatchUpdate }: MatchTabsProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'teams'>('live');
  
  // Use the same live score hook to get the current match data
  const { match: currentMatch } = useLiveScore({ 
    matchId: match.id, 
    initialMatch: match, 
    onMatchUpdate 
  });
  
  // Debug logging for match updates
  console.log('🏷️ MatchTabs: Received match data:', {
    matchId: match.id,
    team1: match.team1,
    team2: match.team2,
    currentTeam1: currentMatch.team1,
    currentTeam2: currentMatch.team2,
    status: match.status,
    liveScore: match.liveScore,
    activeTab,
    timestamp: new Date().toISOString()
  });

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 sm:space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex-1 sm:flex-none ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="hidden sm:inline">🏏 Live Score</span>
          <span className="sm:hidden">🏏 Live</span>
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 flex-1 sm:flex-none ${
            activeTab === 'teams'
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="hidden sm:inline">🏆 Playing XI</span>
          <span className="sm:hidden">🏆 Teams</span>
        </button>
      </div>

      {/* Hidden clickable elements for header navigation */}
      <button
        id="live-score-tab"
        onClick={() => setActiveTab('live')}
        className="hidden"
        aria-hidden="true"
      />
      
      {activeTab === 'live' ? (
        <LiveScoreWidget matchId={match.id} initialMatch={match} onMatchUpdate={onMatchUpdate} />
      ) : (
        <div>
          {currentMatch.teams && (
            <PlayingXI teams={currentMatch.teams} />
          )}
        </div>
      )}
    </div>
  );
}
