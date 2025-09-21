import { PointsTableData } from '@/types';

interface PointsTableRowProps {
  team: PointsTableData;
  isHeader?: boolean;
}

export default function PointsTableRow({ team, isHeader = false }: PointsTableRowProps) {
  if (isHeader) {
    return (
      <div className="grid grid-cols-9 gap-2 p-3 bg-gray-100 rounded-t-lg font-semibold text-sm text-gray-700">
        <div className="text-center">Pos</div>
        <div className="col-span-2">Team</div>
        <div className="text-center">M</div>
        <div className="text-center">W</div>
        <div className="text-center">L</div>
        <div className="text-center">T</div>
        <div className="text-center">Pts</div>
        <div className="text-center">NRR</div>
      </div>
    );
  }

  const getPositionColor = (position: number) => {
    if (position <= 4) return 'bg-green-50 border-green-200';
    if (position <= 6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getPositionBadge = (position: number) => {
    if (position <= 4) return 'bg-green-500 text-white';
    if (position <= 6) return 'bg-yellow-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className={`grid grid-cols-9 gap-2 p-3 border-b border-gray-200 ${getPositionColor(team.position)}`}>
      <div className="flex justify-center items-center">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadge(team.position)}`}>
          {team.position}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <span className="font-medium text-gray-800 truncate">{team.team}</span>
      </div>
      <div className="text-center text-sm text-gray-600">{team.matches}</div>
      <div className="text-center text-sm text-gray-600">{team.won}</div>
      <div className="text-center text-sm text-gray-600">{team.lost}</div>
      <div className="text-center text-sm text-gray-600">{team.tied}</div>
      <div className="text-center font-semibold text-gray-800">{team.points}</div>
      <div className="text-center text-sm">
        <span className={`px-2 py-1 rounded text-xs font-mono ${
          team.netRunRate >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {team.netRunRate >= 0 ? '+' : ''}{team.netRunRate.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
