import { PointsTableData } from '@/types';
import PointsTableYearSelector from './PointsTableYearSelector';
import { ErrorDisplay, Loader } from '@/components/ui';
import PointsTableRow from '@/components/PointsTableRow';

interface PointsTableProps {
  pointsTable: PointsTableData[];
  loading: boolean;
  error: string | null;
  selectedYear: string;
}

export default function PointsTable({ pointsTable, loading, error, selectedYear }: PointsTableProps) {
  if (loading) {
    return <Loader message="Loading points table..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        title="Error loading points table" 
        icon="📊"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Selector */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-200 shadow-sm">
        <div className="flex flex-col space-y-4">
          {/* Title and Year Selector Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                IPL {selectedYear} Points Table
              </h3>
              <PointsTableYearSelector 
                selectedYear={selectedYear}
                loading={false}
              />
            </div>
            {/* Teams Count - Mobile */}
            <div className="flex sm:hidden items-center justify-center space-x-2 py-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                {pointsTable.length}
              </div>
              <div className="text-blue-500 text-lg">🏆</div>
              <span className="text-blue-600 text-sm font-semibold">Teams</span>
            </div>
            {/* Teams Count - Desktop */}
            <div className="hidden sm:flex items-baseline space-x-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                {pointsTable.length}
              </div>
              <div className="text-blue-500 text-lg">🏆</div>
              <div className="text-blue-600 text-sm font-semibold ml-2">Teams</div>
            </div>
          </div>
          {/* Description */}
          <p className="text-blue-700 text-sm font-medium text-center sm:text-left">Team standings and playoff qualification</p>
        </div>
      </div>

      {/* Points Table - Unified Scrollable Table */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full min-w-[600px] sm:min-w-[800px]">
            {/* Fixed Table Header */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[60px]">Pos</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 min-w-[80px] sm:min-w-[200px]">Team</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[60px]">M</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[60px]">W</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[60px]">L</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[60px]">T</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[80px]">Pts</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[120px]">Net Run Rate</th>
              </tr>
            </thead>
            
            {/* Scrollable Table Body */}
            <tbody>
              {pointsTable.map((team, index) => {
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

                return (
                  <tr key={`${team.team}-${index}`} className={`border-b border-slate-200 transition-all duration-200 ${getPositionColor(team.position)}`}>
                    {/* Position */}
                    <td className="px-4 py-3 text-center">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto ${getPositionBadge(team.position)}`}>
                        {team.position}
                      </span>
                    </td>
                    
                    {/* Team Name */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">
                        <span className="hidden sm:inline">{team.team}</span>
                        <span className="sm:hidden">
                          {team.team.split(' ').map(word => word.charAt(0)).join('')}
                        </span>
                      </span>
                    </td>
                    
                    {/* Matches */}
                    <td className="px-4 py-3 text-center text-sm text-slate-600 font-medium">{team.matches}</td>
                    
                    {/* Won */}
                    <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{team.won}</td>
                    
                    {/* Lost */}
                    <td className="px-4 py-3 text-center text-sm text-red-600 font-medium">{team.lost}</td>
                    
                    {/* Tied */}
                    <td className="px-4 py-3 text-center text-sm text-slate-600 font-medium">{team.tied}</td>
                    
                    {/* Points */}
                    <td className="px-4 py-3 text-center font-bold text-slate-800 text-lg">{team.points}</td>
                    
                    {/* Net Run Rate */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-mono font-semibold shadow-sm ${
                        team.netRunRate >= 0 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                          : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                      }`}>
                        {team.netRunRate >= 0 ? '+' : ''}{team.netRunRate.toFixed(3)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 shadow-sm">
        <div className="flex flex-nowrap items-center gap-3 sm:gap-4 text-sm overflow-x-auto">
          <span className="font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex-shrink-0">Legend:</span>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm">Q</span>
            <span className="text-slate-700 text-sm font-medium">Qualified for Playoffs</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 shadow-sm">E</span>
            <span className="text-slate-700 text-sm font-medium">Eliminated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
