'use client';

import { useState, memo } from 'react';
import { PlayingXIData, TeamTab } from '@/types/playingXI';
import TeamTabs from './playing-xi/TeamTabs';
import TeamDetails from './playing-xi/TeamDetails';

interface PlayingXIProps {
  teams: PlayingXIData;
}

const PlayingXIRefactored = memo(function PlayingXIRefactored({ teams }: PlayingXIProps) {
  const [activeTab, setActiveTab] = useState<TeamTab>('team1');

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Playing XI</h2>
      </div>

      {/* Tab Navigation */}
      <TeamTabs 
        teams={teams} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Content */}
      <div className="p-6">
        {activeTab === 'team1' ? (
          <TeamDetails team={teams.team1} />
        ) : (
          <TeamDetails team={teams.team2} />
        )}
      </div>
    </div>
  );
});

export default PlayingXIRefactored;
