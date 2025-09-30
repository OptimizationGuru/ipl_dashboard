'use client';

import { useState, memo } from 'react';
import { PlayingXIData, TeamTab } from '@/types/playingXI';
import TeamTabs from './playing-xi/TeamTabs';
import TeamDetails from './playing-xi/TeamDetails';

interface PlayingXIProps {
  teams: PlayingXIData;
}

export default function PlayingXI({ teams }: PlayingXIProps) {
  const [activeTab, setActiveTab] = useState<'team1' | 'team2'>('team1');
  
  const getRoleEmoji = (role: string) => {
    switch (role) {
      case 'Batsman':
        return '🏏';
      case 'Bowler':
        return '⚾';
      case 'All-rounder':
        return '🎯';
      case 'Wicket-keeper':
        return '🧤';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Batsman':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Bowler':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'All-rounder':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Wicket-keeper':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderPlayerCard = (player: Player, index: number) => {
    const getRoleIcon = (role: string) => {
      switch (role) {
        case 'Batsman': return '🏏';
        case 'Bowler': return '⚾';
        case 'All-rounder': return '🎯';
        case 'Wicket-keeper': return '🧤';
        default: return '👤';
      }
    };

    const getRoleColor = (role: string) => {
      switch (role) {
        case 'Batsman': return 'from-green-500 to-emerald-600';
        case 'Bowler': return 'from-red-500 to-rose-600';
        case 'All-rounder': return 'from-orange-500 to-amber-600';
        case 'Wicket-keeper': return 'from-purple-500 to-violet-600';
        default: return 'from-gray-500 to-slate-600';
      }
    };

    return (
      <div key={index} className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl hover:border-gray-300 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
        {/* Light colored background based on role */}
        <div className={`absolute inset-0 bg-gradient-to-br ${
          player.role === 'Batsman' ? 'from-green-50 to-emerald-50' :
          player.role === 'Bowler' ? 'from-red-50 to-rose-50' :
          player.role === 'All-rounder' ? 'from-orange-50 to-amber-50' :
          player.role === 'Wicket-keeper' ? 'from-purple-50 to-violet-50' :
          'from-gray-50 to-slate-50'
        } opacity-50`}></div>
        
        <div className="relative z-10">
          {/* Header with name and special roles */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-12 h-12 bg-gradient-to-br ${
                  player.role === 'Batsman' ? 'from-green-100 to-emerald-100' :
                  player.role === 'Bowler' ? 'from-red-100 to-rose-100' :
                  player.role === 'All-rounder' ? 'from-orange-100 to-amber-100' :
                  player.role === 'Wicket-keeper' ? 'from-purple-100 to-violet-100' :
                  'from-slate-100 to-gray-100'
                } rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-xl">{getRoleIcon(player.role)}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{player.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {player.isCaptain && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                        Captain
                      </span>
                    )}
                    {player.isWicketKeeper && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        Keeper
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order numbers */}
            <div className="flex flex-col space-y-1">
              {player.battingOrder && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Batting</div>
                  <div className="text-lg font-bold text-gray-800">#{player.battingOrder}</div>
                </div>
              )}
              {player.bowlingOrder && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Bowling</div>
                  <div className="text-lg font-bold text-gray-800">#{player.bowlingOrder}</div>
                </div>
              )}
            </div>
          </div>

          {/* Player description */}
          <div className="mb-2">
            <p className="text-sm text-gray-600 leading-relaxed">{player.skill}</p>
          </div>

          {/* Role indicator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{player.role}</span>
            <div className="flex items-center space-x-1">
              {player.battingOrder && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Batting Order"></div>
              )}
              {player.bowlingOrder && (
                <div className="w-2 h-2 bg-red-500 rounded-full" title="Bowling Order"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTeamDetails = (team: Team) => (
    <div className="space-y-4">
      {/* Team Header */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-lg p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2 text-lg">👑</span>
                <span className="font-semibold text-gray-900">{team.captain}</span>
              </div>
              <div className="flex items-center">
                <span className="text-emerald-500 mr-2 text-lg">🧤</span>
                <span className="font-semibold text-gray-900">{team.wicketKeeper}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-600">{team.players.length}</div>
            <div className="text-sm text-gray-600 font-medium">Players</div>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group bg-white rounded-xl p-4 text-center border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="text-2xl">🏏</span>
            </div>
            <div className="text-3xl font-black text-slate-700 mb-2">
              {team.players.filter(p => p.role === 'Batsman').length}
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1">Batsmen</div>
            <div className="text-xs text-gray-500">Specialist hitters</div>
          </div>
        </div>
        
        <div className="group bg-white rounded-xl p-4 text-center border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="text-2xl">⚾</span>
            </div>
            <div className="text-3xl font-black text-slate-700 mb-2">
              {team.players.filter(p => p.role === 'Bowler').length}
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1">Bowlers</div>
            <div className="text-xs text-gray-500">Wicket takers</div>
          </div>
        </div>
        
        <div className="group bg-white rounded-xl p-4 text-center border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-black text-slate-700 mb-2">
              {team.players.filter(p => p.role === 'All-rounder').length}
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1">All-rounders</div>
            <div className="text-xs text-gray-500">Bat & bowl</div>
          </div>
        </div>
        
        <div className="group bg-white rounded-xl p-4 text-center border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-50"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <span className="text-2xl">🧤</span>
            </div>
            <div className="text-3xl font-black text-slate-700 mb-2">
              {team.players.filter(p => p.role === 'Wicket-keeper').length}
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1">Wicket-keepers</div>
            <div className="text-xs text-gray-500">Behind stumps</div>
          </div>
        </div>
      </div>

      {/* Players Grid - Horizontally Scrollable */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {team.players.map((player, index) => (
            <div key={index} className="flex-shrink-0 w-80">
              {renderPlayerCard(player, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4">
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

export default PlayingXI;
