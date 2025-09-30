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
      <div className="hidden lg:grid grid-cols-12 gap-1 p-4 bg-gradient-to-r from-slate-100 to-gray-100 font-bold text-sm text-slate-700">
        <div className="col-span-1 text-center">Pos</div>
        <div className="col-span-3">Team</div>
        <div className="col-span-1 text-center">M</div>
        <div className="col-span-1 text-center">W</div>
        <div className="col-span-1 text-center">L</div>
        <div className="col-span-1 text-center">T</div>
        <div className="col-span-1 text-center">Pts</div>
        <div className="col-span-3 text-center">Net Run Rate</div>
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
    <>
      {/* Desktop View */}
      <div className={`hidden lg:grid grid-cols-12 gap-1 p-4 border-b border-slate-200 transition-all duration-200 ${getPositionColor(team.position)}`}>
        <div className="col-span-1 flex justify-center items-center">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadge(team.position)}`}>
            {team.position}
          </span>
        </div>
        <div className="col-span-3 flex items-center">
          <span className="font-semibold text-slate-800 truncate">{team.team}</span>
        </div>
        <div className="col-span-1 text-center text-sm text-slate-600 font-medium">{team.matches}</div>
        <div className="col-span-1 text-center text-sm text-slate-600 font-medium">{team.won}</div>
        <div className="col-span-1 text-center text-sm text-slate-600 font-medium">{team.lost}</div>
        <div className="col-span-1 text-center text-sm text-slate-600 font-medium">{team.tied}</div>
        <div className="col-span-1 text-center font-bold text-slate-800 text-lg">{team.points}</div>
        <div className="col-span-3 text-center text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-mono font-semibold shadow-sm whitespace-nowrap ${
            team.netRunRate >= 0 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
          }`}>
            {team.netRunRate >= 0 ? '+' : ''}{team.netRunRate.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Tablet View */}
      <div className={`hidden sm:grid lg:hidden grid-cols-8 gap-2 p-4 border-b border-slate-200 transition-all duration-200 ${getPositionColor(team.position)}`}>
        <div className="col-span-1 flex justify-center items-center">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionBadge(team.position)}`}>
            {team.position}
          </span>
        </div>
        <div className="col-span-2 flex items-center">
          <span className="font-semibold text-slate-800 text-sm truncate">{team.team}</span>
        </div>
        <div className="col-span-1 text-center text-xs text-slate-600 font-medium">{team.matches}</div>
        <div className="col-span-1 text-center text-xs text-slate-600 font-medium">{team.won}</div>
        <div className="col-span-1 text-center text-xs text-slate-600 font-medium">{team.lost}</div>
        <div className="col-span-1 text-center font-bold text-slate-800">{team.points}</div>
        <div className="col-span-1 text-center text-xs">
          <span className={`px-1 py-0.5 rounded text-xs font-mono font-semibold whitespace-nowrap ${
            team.netRunRate >= 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {team.netRunRate >= 0 ? '+' : ''}{team.netRunRate.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Mobile View - Entire Row Horizontally Scrollable */}
      <div className={`sm:hidden border-b border-slate-200 transition-all duration-200 my-0.5 ${getPositionColor(team.position)}`}>
        <div className="overflow-x-auto p-4">
          <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
            {/* Position */}
            <div className="flex-shrink-0 flex items-center">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionBadge(team.position)}`}>
                {team.position}
              </span>
            </div>
            
            {/* Team Name */}
            <div className="flex-shrink-0 flex items-center min-w-[120px]">
              <span className="font-semibold text-slate-800 text-base">{team.team}</span>
            </div>
            
            {/* Points */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <div className="text-2xl font-bold text-slate-800">{team.points}</div>
              <div className="text-xs text-slate-600">Points</div>
            </div>
            
            {/* Matches */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <div className="text-lg font-bold text-slate-700">{team.matches}</div>
              <div className="text-xs text-slate-600">Matches</div>
            </div>
            
            {/* Won */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <div className="text-lg font-bold text-green-600">{team.won}</div>
              <div className="text-xs text-slate-600">Won</div>
            </div>
            
            {/* Lost */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <div className="text-lg font-bold text-red-600">{team.lost}</div>
              <div className="text-xs text-slate-600">Lost</div>
            </div>
            
            {/* Tied */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <div className="text-lg font-bold text-slate-700">{team.tied}</div>
              <div className="text-xs text-slate-600">Tied</div>
            </div>
            
            {/* NRR */}
            <div className="flex-shrink-0 text-center min-w-[80px]">
              <div className="text-lg font-bold text-blue-600">{team.netRunRate >= 0 ? '+' : ''}{team.netRunRate.toFixed(3)}</div>
              <div className="text-xs text-slate-600">NRR</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
