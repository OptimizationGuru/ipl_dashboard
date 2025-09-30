interface ScheduleTableHeaderProps {
  className?: string;
}

export default function ScheduleTableHeader({ className = "" }: ScheduleTableHeaderProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 md:p-5 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b-2 border-blue-200 font-bold text-sm text-slate-800 sticky top-0 z-10 shadow-sm ${className}`}>
      <div className="md:col-span-2 flex flex-row items-center space-x-2">
        <span className="text-blue-600">🏆</span>
        <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Match</span>
        <span className="text-xs text-slate-500 font-normal">Status</span>
      </div>
      <div className="md:col-span-5 flex items-center space-x-2">
        <span className="text-green-600">⚔️</span>
        <span className="bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">Teams</span>
      </div>
      <div className="md:col-span-3 flex items-center space-x-2">
        <span className="text-purple-600">🏟️</span>
        <span className="bg-gradient-to-r from-purple-800 to-violet-800 bg-clip-text text-transparent">Venue</span>
      </div>
      <div className="md:col-span-2 flex items-center space-x-2">
        <span className="text-orange-600">⏰</span>
        <span className="bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent">Date & Time</span>
      </div>
    </div>
  );
}
