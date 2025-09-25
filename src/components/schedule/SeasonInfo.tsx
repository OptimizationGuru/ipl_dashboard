interface SeasonInfoProps {
  totalMatches?: number;
  teams?: number;
  season: string; // Required - no default
  format?: string;
}

export default function SeasonInfo({ 
  totalMatches = 92, 
  teams = 10, 
  season, 
  format = "Round Robin + Playoffs" 
}: SeasonInfoProps) {
  return (
    <div className="mt-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
          🏆 Season Information
        </h3>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-32 mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-lg">⚡</span>
            <span className="font-semibold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">Total Matches:</span>
          </div>
          <span className="font-bold text-green-800 text-xl">{totalMatches}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-lg">🏆</span>
            <span className="font-semibold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Teams:</span>
          </div>
          <span className="font-bold text-blue-800 text-xl">{teams}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-2">
            <span className="text-purple-600 text-lg">📅</span>
            <span className="font-semibold bg-gradient-to-r from-purple-800 to-violet-800 bg-clip-text text-transparent">Season:</span>
          </div>
          <span className="font-bold text-purple-800 text-xl">{season}</span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-2">
            <span className="text-orange-600 text-lg">🎯</span>
            <span className="font-semibold bg-gradient-to-r from-orange-800 to-red-800 bg-clip-text text-transparent">Format:</span>
          </div>
          <span className="font-bold text-orange-800 text-sm">{format}</span>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl border border-slate-200">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-slate-600 text-sm">🔄</span>
          <p className="text-sm text-slate-700 text-center font-medium">
            <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent font-semibold">Schedule updated daily</span> • All times are in IST
          </p>
        </div>
      </div>
    </div>
  );
}
