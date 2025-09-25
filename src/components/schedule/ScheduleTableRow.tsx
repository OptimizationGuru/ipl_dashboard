import { ScheduleData } from '@/types';

interface ScheduleTableRowProps {
  match: ScheduleData;
  className?: string;
}

export default function ScheduleTableRow({ match, className = "" }: ScheduleTableRowProps) {
  // Determine match status based on date
  // Parse date like "Mar 22" to a proper date
  const parseMatchDate = (dateStr: string) => {
    // If it's already a full date, use it
    if (dateStr.includes('/') || dateStr.includes('-')) {
      return new Date(dateStr);
    }
    
    // For "Mar 22" format, use 2025 (IPL 2025 season)
    return new Date(`${dateStr} 2025`);
  };
  
  const matchDate = parseMatchDate(match.date);
  const today = new Date();
  const isCompleted = matchDate < today;
  const isToday = matchDate.toDateString() === today.toDateString();
  
  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-800 border-green-200';
    if (isToday) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isToday) return 'Today';
    return 'Upcoming';
  };

  return (
    <div className={`grid grid-cols-4 gap-4 p-4 border-b border-slate-200 hover:bg-slate-50 transition-all duration-200 ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-blue-200">
          Match {match.matchNumber}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800">{match.team1}</span>
          <span className="text-slate-400 text-xs">vs</span>
          <span className="font-semibold text-slate-800">{match.team2}</span>
        </div>
        <div className="text-xs text-slate-500">
          {match.team1} vs {match.team2}
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-slate-600 truncate font-medium" title={match.venue}>
          {match.venue || 'TBD'}
        </span>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-semibold text-slate-800">{match.date}</span>
        <span className="text-xs text-slate-500 font-medium">{match.time || 'TBD'}</span>
      </div>
    </div>
  );
}
