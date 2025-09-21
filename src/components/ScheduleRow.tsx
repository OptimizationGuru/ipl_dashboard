import { ScheduleData } from '@/types';

interface ScheduleRowProps {
  match: ScheduleData;
  isHeader?: boolean;
}

export default function ScheduleRow({ match, isHeader = false }: ScheduleRowProps) {
  if (isHeader) {
    return (
      <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 rounded-t-lg font-semibold text-sm text-gray-700">
        <div>Match</div>
        <div>Teams</div>
        <div>Venue</div>
        <div>Date & Time</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
          Match {match.matchNumber}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{match.team1}</span>
        <span className="text-gray-500 text-sm">vs</span>
        <span className="font-medium text-gray-800">{match.team2}</span>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-gray-600 truncate" title={match.venue}>
          {match.venue}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{match.date}</span>
        <span className="text-xs text-gray-500">{match.time}</span>
      </div>
    </div>
  );
}
