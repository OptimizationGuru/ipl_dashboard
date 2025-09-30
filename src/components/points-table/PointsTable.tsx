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

      {/* Points Table */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <PointsTableRow isHeader={true} />
          {pointsTable.map((team, index) => (
            <PointsTableRow key={`${team.team}-${index}`} team={team} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4 text-sm">
          <span className="font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent text-center sm:text-left">Legend:</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 lg:gap-4">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200 shadow-sm">Q</span>
              <span className="text-slate-700 text-sm font-medium">Qualified for Playoffs</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm">E</span>
              <span className="text-slate-700 text-sm font-medium">Eliminated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
