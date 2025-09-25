import Link from 'next/link';

interface ScheduleHeaderProps {
  totalMatches?: number;
  totalTeams?: number;
  seasonDuration?: string;
}

export default function ScheduleHeader({ 
  totalMatches = 92, 
  totalTeams = 10, 
  seasonDuration = "2 Months" 
}: ScheduleHeaderProps) {
  return (
    <div className="mb-10">
      {/* Back Navigation */}
      <div className="flex items-center space-x-3 mb-6">
        <Link 
          href="/" 
          className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
      </div>
      
      {/* Main Header */}
      <div className="text-center space-y-4">
        {/* Title with enhanced styling */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-5xl hover:scale-110 transition-transform duration-300">🏏</div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent text-center">
              Match Schedule
            </h1>
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-20"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-20"></div>
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <p className="text-slate-700 text-xl font-semibold">Complete fixture list for IPL 2025</p>
          <p className="text-slate-500 text-base">All matches scheduled for the season</p>
        </div>
        
        {/* Stats preview */}
        <div className="flex items-center justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-blue-600 text-sm">🏆</span>
            <span className="text-blue-800 text-sm font-medium">{totalTeams} Teams</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <span className="text-green-600 text-sm">⚡</span>
            <span className="text-green-800 text-sm font-medium">{totalMatches} Matches</span>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
            <span className="text-purple-600 text-sm">🎯</span>
            <span className="text-purple-800 text-sm font-medium">{seasonDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
