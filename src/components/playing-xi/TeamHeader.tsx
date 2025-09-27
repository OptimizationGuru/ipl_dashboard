import { memo } from 'react';
import { Team } from '@/types/playingXI';

interface TeamHeaderProps {
  team: Team;
}

const TeamHeader = memo(function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {team.name.split(' ').map(word => word[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span>👑</span>
                <span>Captain: {team.captain}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🧤</span>
                <span>WK: {team.wicketKeeper}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{team.players.length}</div>
          <div className="text-xs text-gray-500">Players</div>
        </div>
      </div>
    </div>
  );
});

export default TeamHeader;
