import { PointsTableData } from '@/types';

interface PointsTableRowProps {
  team?: PointsTableData;
  isHeader?: boolean;
}

export default function PointsTableRow({ team, isHeader = false }: PointsTableRowProps) {
  if (!team && !isHeader) {
    return null;
  }
  if (isHeader) {
    return (
      <div className="grid grid-cols-9 gap-1 sm:gap-2 p-2 sm:p-4 bg-gradient-to-r from-slate-100 to-gray-100 font-bold text-xs sm:text-sm text-slate-700 min-w-[600px]">
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
    if (position <= 4) return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:from-green-100 hover:to-emerald-100';
    if (position <= 6) return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100';
    return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 hover:from-slate-100 hover:to-gray-100';
  };

  const getPositionBadge = (position: number) => {
    if (position <= 4) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg';
    if (position <= 6) return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg';
    return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg';
  };

  if (!team) return null;

  return (
    <div className={`grid grid-cols-9 gap-1 sm:gap-2 p-2 sm:p-4 border-b border-slate-200 transition-all duration-200 ${getPositionColor(team.position)} min-w-[600px]`}>
      <div className="flex justify-center items-center">
        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadge(team.position)}`}>
          {team.position}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <span className="font-semibold text-slate-800 truncate text-xs sm:text-sm">{team.team}</span>
      </div>
      <div className="text-center text-xs sm:text-sm text-slate-600 font-medium">{team.matches}</div>
      <div className="text-center text-xs sm:text-sm text-slate-600 font-medium">{team.won}</div>
      <div className="text-center text-xs sm:text-sm text-slate-600 font-medium">{team.lost}</div>
      <div className="text-center text-xs sm:text-sm text-slate-600 font-medium">{team.tied}</div>
      <div className="text-center font-bold text-slate-800 text-sm sm:text-lg">{team.points}</div>
      <div className="text-center text-xs sm:text-sm">
        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-mono font-semibold shadow-sm ${
          team.netRunRate >= 0 
            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
        }`}>
          {team.netRunRate >= 0 ? '+' : ''}{team.netRunRate.toFixed(3)}
        </span>
      </div>
    </div>
  );
}
