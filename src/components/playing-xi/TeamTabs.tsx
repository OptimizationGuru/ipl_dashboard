'use client';

import { memo } from 'react';
import { PlayingXIData, TeamTab } from '@/types/playingXI';

interface TeamTabsProps {
  teams: PlayingXIData;
  activeTab: TeamTab;
  onTabChange: (tab: TeamTab) => void;
}

const TeamTabs = memo(function TeamTabs({ teams, activeTab, onTabChange }: TeamTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex">
        <button
          onClick={() => onTabChange('team1')}
          className={`flex-1 px-6 py-3 text-center font-semibold text-base transition-all duration-200 relative ${
            activeTab === 'team1'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-b-4 border-emerald-600 shadow-lg'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">🏏</span>
            <span>{teams.team1.name}</span>
          </div>
          {activeTab === 'team1' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange('team2')}
          className={`flex-1 px-6 py-3 text-center font-semibold text-base transition-all duration-200 relative ${
            activeTab === 'team2'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-b-4 border-emerald-600 shadow-lg'
              : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl">🏏</span>
            <span>{teams.team2.name}</span>
          </div>
          {activeTab === 'team2' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-600"></div>
          )}
        </button>
      </div>
    </div>
  );
});

export default TeamTabs;
