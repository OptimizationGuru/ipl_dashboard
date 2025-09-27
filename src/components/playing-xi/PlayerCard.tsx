import { memo } from 'react';
import { Player } from '@/types/playingXI';

interface PlayerCardProps {
  player: Player;
  index: number;
}

const PlayerCard = memo(function PlayerCard({ player, index }: PlayerCardProps) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{player.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg">{getRoleEmoji(player.role)}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(player.role)}`}>
                {player.role}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {player.isCaptain && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
              👑 Captain
            </span>
          )}
          {player.isWicketKeeper && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200">
              🧤 WK
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-600 text-xs leading-relaxed">{player.skill}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          {player.battingOrder && (
            <span className="flex items-center space-x-1">
              <span>🏏</span>
              <span>Bat #{player.battingOrder}</span>
            </span>
          )}
          {player.bowlingOrder && (
            <span className="flex items-center space-x-1">
              <span>⚾</span>
              <span>Bowl #{player.bowlingOrder}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default PlayerCard;
