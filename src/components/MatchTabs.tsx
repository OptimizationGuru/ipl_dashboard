'use client';

import { useState } from 'react';
import LiveScoreWidgetRefactored from './LiveScoreWidgetRefactored';
import PlayingXIRefactored from './PlayingXIRefactored';
import { MatchData } from '@/types';

interface MatchTabsProps {
  match: MatchData;
  onMatchUpdate?: () => void;
}

export default function MatchTabs({ match, onMatchUpdate }: MatchTabsProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'teams'>('live');
  
  // Debug logging for match updates
  console.log('🏷️ MatchTabs: Received match data:', {
    matchId: match.id,
    team1: match.team1,
    team2: match.team2,
    status: match.status,
    liveScore: match.liveScore,
    activeTab,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="pt-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏏 Live Score
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === 'teams'
              ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏆 Playing XI
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
        <LiveScoreWidgetRefactored matchId={match.id} initialMatch={match} onMatchUpdate={onMatchUpdate} />
      ) : (
        <div>
          {(match as any).teams && (
            <PlayingXIRefactored teams={(match as any).teams} />
          )}
        </div>
      )}
    </div>
  );
}
