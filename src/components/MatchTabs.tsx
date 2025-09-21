'use client';

import { useState } from 'react';
import LiveScoreWidget from './LiveScoreWidget';
import PlayingXI from './PlayingXI';
import { MatchData } from '@/types';

interface MatchTabsProps {
  match: MatchData;
}

export default function MatchTabs({ match }: MatchTabsProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'teams'>('live');

  return (
    <div className="pt-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏏 Live Score
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === 'teams'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
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
      <button
        id="playing-xi-tab"
        onClick={() => setActiveTab('teams')}
        className="hidden"
        aria-hidden="true"
      />
      
      {activeTab === 'live' ? (
        <LiveScoreWidget matchId={match.id} initialMatch={match} />
      ) : (
        <div>
          {(match as any).teams && (
            <PlayingXI teams={(match as any).teams} />
          )}
        </div>
      )}
    </div>
  );
}
