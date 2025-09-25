interface SeasonInfoProps {
  totalMatches?: number;
  teams?: number;
  season?: string;
  format?: string;
}

export default function SeasonInfo({ 
  totalMatches = 92, 
  teams = 10, 
  season = "2025", 
  format = "Round Robin + Playoffs" 
}: SeasonInfoProps) {
  return (
    <div className="mt-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg p-6 border border-slate-200">
      <h3 className="font-bold text-slate-800 mb-4 text-lg">🏆 Season Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
          <span className="font-semibold text-slate-700">Total Matches:</span>
          <span className="font-bold text-slate-800 text-lg">{totalMatches}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
          <span className="font-semibold text-slate-700">Teams:</span>
          <span className="font-bold text-slate-800 text-lg">{teams}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
          <span className="font-semibold text-slate-700">Season:</span>
          <span className="font-bold text-slate-800 text-lg">{season}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
          <span className="font-semibold text-slate-700">Format:</span>
          <span className="font-bold text-slate-800 text-sm">{format}</span>
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-100 rounded-lg">
        <p className="text-xs text-slate-600 text-center">
          <strong>Schedule updated daily</strong> • All times are in IST
        </p>
      </div>
    </div>
  );
}
