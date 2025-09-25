import ScheduleSkeleton from './ScheduleSkeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import ScheduleTableHeader from './ScheduleTableHeader';
import ScheduleTableRow from './ScheduleTableRow';
import YearSelector from './YearSelector';
import { ScheduleData } from '@/types';

interface ScheduleTableProps {
  schedule: ScheduleData[];
  loading: boolean;
  error: string | null;
  selectedYear: string;
}

export default function ScheduleTable({ schedule, loading, error, selectedYear }: ScheduleTableProps) {
  
  if (loading) {
    return <ScheduleSkeleton />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        title="Error loading schedule" 
        icon="📅"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                IPL {selectedYear} Season
              </h3>
              <YearSelector 
                selectedYear={selectedYear}
                loading={false}
              />
            </div>
            <p className="text-blue-700 text-sm font-medium">Complete match schedule and results</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                {schedule.length}
              </div>
              <div className="text-blue-500 text-lg">⚡</div>
            </div>
            <div className="text-blue-600 text-sm font-semibold mt-1">Total Matches</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
        <div className="flex flex-nowrap items-center gap-3 sm:gap-4 text-sm overflow-x-auto">
          <span className="font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex-shrink-0">Status:</span>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-800 border-green-200 shadow-sm">✓</span>
            <span className="text-slate-700 text-sm font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200 shadow-sm">●</span>
            <span className="text-slate-700 text-sm font-medium">Live</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-800 border-blue-200 shadow-sm">⏳</span>
            <span className="text-slate-700 text-sm font-medium">Upcoming</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="hidden md:block">
          <ScheduleTableHeader />
        </div>
        {schedule.length === 0 ? (
          <div className="p-6 md:p-8 text-center">
            <div className="text-slate-500 text-lg">No schedule data available</div>
            <div className="text-slate-400 text-sm mt-2">Check back later for updates</div>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            {schedule.map((match) => (
              <ScheduleTableRow key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
