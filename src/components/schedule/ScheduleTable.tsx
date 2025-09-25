import ScheduleSkeleton from './ScheduleSkeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import ScheduleTableHeader from './ScheduleTableHeader';
import ScheduleTableRow from './ScheduleTableRow';
import { ScheduleData } from '@/types';

interface ScheduleTableProps {
  schedule: ScheduleData[];
  loading: boolean;
  error: string | null;
}

export default function ScheduleTable({ schedule, loading, error }: ScheduleTableProps) {
  // Pure presenter component - only handles UI logic, no data fetching
  
  // Note: loading is always false in SSG/SSR mode, but kept for consistency
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
      {/* Season Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-900">IPL 2025 Season</h3>
            <p className="text-blue-700 text-sm">Complete match schedule and results</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{schedule.length}</div>
            <div className="text-blue-600 text-sm">Total Matches</div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <ScheduleTableHeader />
        {schedule.length === 0 ? (
          <div className="p-8 text-center">
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
