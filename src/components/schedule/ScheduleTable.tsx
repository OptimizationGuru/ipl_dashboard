import ScheduleSkeleton from './ScheduleSkeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import ScheduleTableHeader from './ScheduleTableHeader';
import ScheduleTableRow from './ScheduleTableRow';
import ScheduleYearSelector from './ScheduleYearSelector';
import { ScheduleData } from '@/types';

interface ScheduleTableProps {
  schedule: ScheduleData[];
  loading: boolean;
  error: string | null;
  selectedYear: string;
}

export default function ScheduleTable({ schedule, loading, error, selectedYear }: ScheduleTableProps) {
  
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
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent">
                IPL {selectedYear} Season
              </h3>
              <ScheduleYearSelector 
                selectedYear={selectedYear}
                loading={false}
              />
            </div>
            <p className="text-emerald-700 text-sm font-medium">Complete match schedule and results</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-900 to-teal-900 bg-clip-text text-transparent">
                {schedule.length}
              </div>
              <div className="text-emerald-500 text-lg">⚡</div>
            </div>
            <div className="text-emerald-600 text-sm font-semibold mt-1">Total Matches</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 shadow-sm">
        <div className="flex flex-nowrap items-center gap-3 sm:gap-4 text-sm overflow-x-auto">
          <span className="font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex-shrink-0">Status:</span>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm">✓</span>
            <span className="text-slate-700 text-sm font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200 shadow-sm">●</span>
            <span className="text-slate-700 text-sm font-medium">Live</span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200 shadow-sm">⏳</span>
            <span className="text-slate-700 text-sm font-medium">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Schedule Table - Unified Scrollable Table */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full min-w-[800px]">
            {/* Fixed Table Header */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[100px]">Match</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-700 min-w-[200px]">Teams</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[120px]">Venue</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[150px]">Date & Time</th>
                <th className="px-4 py-3 text-center text-sm font-bold text-slate-700 min-w-[100px]">Status</th>
              </tr>
            </thead>
            
            {/* Scrollable Table Body */}
            <tbody>
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 md:p-8 text-center">
                    <div className="text-slate-500 text-lg">No schedule data available</div>
                    <div className="text-slate-400 text-sm mt-2">Check back later for updates</div>
                  </td>
                </tr>
              ) : (
                schedule.map((match) => {
                  const getStatusColor = () => {
                    switch (match.status) {
                      case 'completed':
                        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
                      case 'live':
                        return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
                      default:
                        return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200';
                    }
                  };

                  const getStatusText = () => {
                    switch (match.status) {
                      case 'completed':
                        return '✓';
                      case 'live':
                        return '●';
                      default:
                        return '⏳';
                    }
                  };

                  const getTeamShortForm = (teamName: string): string => {
                    const shortForms: Record<string, string> = {
                      'Chennai Super Kings': 'CSK',
                      'Mumbai Indians': 'MI',
                      'Royal Challengers Bengaluru': 'RCB',
                      'Kolkata Knight Riders': 'KKR',
                      'Delhi Capitals': 'DC',
                      'Punjab Kings': 'PBKS',
                      'Rajasthan Royals': 'RR',
                      'Sunrisers Hyderabad': 'SRH',
                      'Gujarat Titans': 'GT',
                      'Lucknow Super Giants': 'LSG'
                    };
                    return shortForms[teamName] || teamName;
                  };

                  const getVenueShortForm = (venueName: string): string => {
                    const shortForms: Record<string, string> = {
                      'Wankhede Stadium, Mumbai': 'Wankhede, Mumbai',
                      'M. Chinnaswamy Stadium, Bangalore': 'Chinnaswamy, Bangalore',
                      'Eden Gardens, Kolkata': 'Eden Gardens, Kolkata',
                      'MA Chidambaram Stadium, Chennai': 'Chepauk, Chennai',
                      'Narendra Modi Stadium, Ahmedabad': 'Motera, Ahmedabad',
                      'Rajiv Gandhi Stadium, Hyderabad': 'RG Stadium, Hyderabad',
                      'Punjab Cricket Association Stadium, Mohali': 'PCA Stadium, Mohali',
                      'Arun Jaitley Stadium, Delhi': 'Kotla, Delhi',
                      'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow': 'Ekana, Lucknow',
                      'Sawai Mansingh Stadium, Jaipur': 'SMS Stadium, Jaipur'
                    };
                    return shortForms[venueName] || venueName;
                  };

                  return (
                    <tr key={match.id} className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200">
                      {/* Match Number */}
                      <td className="px-4 py-3 text-center">
                        <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm border border-emerald-200">
                          M{match.matchNumber}
                        </span>
                      </td>
                      
                      {/* Teams */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold text-sm ${
                              match.status === 'completed' && match.result?.winner === match.team1 
                                ? 'text-green-700 font-bold' 
                                : 'text-slate-800'
                            }`}>
                              {getTeamShortForm(match.team1)}
                            </span>
                            <span className="text-slate-400 text-sm">vs</span>
                            <span className={`font-semibold text-sm ${
                              match.status === 'completed' && match.result?.winner === match.team2 
                                ? 'text-green-700 font-bold' 
                                : 'text-slate-800'
                            }`}>
                              {getTeamShortForm(match.team2)}
                            </span>
                          </div>
                          
                          {match.status === 'completed' && match.result && (
                            <div className="text-xs text-green-700">
                              🏆 {getTeamShortForm(match.result.winner)} won by {match.result.winBy}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Venue */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-slate-700" title={match.venue}>
                          {getVenueShortForm(match.venue || 'TBD')}
                        </span>
                      </td>
                      
                      {/* Date & Time */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm font-semibold text-slate-800">{match.date}</span>
                          <span className="text-xs text-slate-500">{match.time || 'TBD'}</span>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor()}`}>
                          {getStatusText()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
