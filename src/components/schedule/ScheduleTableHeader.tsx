interface ScheduleTableHeaderProps {
  className?: string;
}

export default function ScheduleTableHeader({ className = "" }: ScheduleTableHeaderProps) {
  return (
    <div className={`grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-slate-100 to-gray-100 font-bold text-sm text-slate-700 sticky top-0 z-10 ${className}`}>
      <div className="flex items-center space-x-2">
        <span>Match</span>
        <span className="text-xs text-slate-500">Status</span>
      </div>
      <div>Teams</div>
      <div>Venue</div>
      <div>Date & Time</div>
    </div>
  );
}
