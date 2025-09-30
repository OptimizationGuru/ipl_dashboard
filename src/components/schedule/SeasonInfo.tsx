interface SeasonInfoProps {
  totalMatches?: number;
  teams?: number;
  season: string; // Required - no default
}

export default function SeasonInfo({ 
  totalMatches = 92, 
  teams = 10, 
  season
}: SeasonInfoProps) {
  return (
    <div className="mt-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl shadow-lg px-4 pt-4 pb-6 border border-blue-200">
      <div className="flex justify-center">
        <div className="flex items-center justify-center space-x-12 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-lg">⚡</span>
            <div className="text-center">
              <div className="font-bold text-green-800 text-lg">{totalMatches}</div>
              <div className="text-xs text-green-600">Matches</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-lg">🏆</span>
            <div className="text-center">
              <div className="font-bold text-blue-800 text-lg">{teams}</div>
              <div className="text-xs text-blue-600">Teams</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-purple-600 text-lg">📅</span>
            <div className="text-center">
              <div className="font-bold text-purple-800 text-lg">{season}</div>
              <div className="text-xs text-purple-600">Season</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
