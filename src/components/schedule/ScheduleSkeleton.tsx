export default function ScheduleSkeleton() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-slate-100 to-gray-100 font-bold text-sm text-slate-700">
        <div>Match</div>
        <div>Teams</div>
        <div>Venue</div>
        <div>Date & Time</div>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 animate-pulse hover:bg-slate-50 transition-colors">
          <div className="flex items-center">
            <div className="h-6 w-16 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-6"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
