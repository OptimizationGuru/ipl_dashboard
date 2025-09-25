import { ScheduleData } from '@/types';

interface ScheduleTableRowProps {
  match: ScheduleData;
  className?: string;
}

// Team short forms mapping
const TEAM_SHORT_FORMS: Record<string, string> = {
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

// Venue short forms mapping
const VENUE_SHORT_FORMS: Record<string, string> = {
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

export default function ScheduleTableRow({ match, className = "" }: ScheduleTableRowProps) {
  const getTeamShortForm = (teamName: string): string => {
    return TEAM_SHORT_FORMS[teamName] || teamName;
  };

  const getVenueShortForm = (venueName: string): string => {
    return VENUE_SHORT_FORMS[venueName] || venueName;
  };

  const getStatusColor = () => {
    switch (match.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'live':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
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

  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 p-3 md:p-4 border-b border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group ${className}`}>
      {/* Match & Status - Compact styling */}
      <div className="md:col-span-2 flex flex-row items-center space-x-2">
        <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm border border-blue-200">
          M{match.matchNumber}
        </span>
        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {/* Teams & Results - Compact design */}
      <div className="md:col-span-5 flex flex-col space-y-0.5">
        <div className="flex items-center space-x-1.5">
          <span className="text-green-600 text-xs">⚔️</span>
          <span className={`font-semibold text-xs truncate ${
            match.status === 'completed' && match.result?.winner === match.team1 
              ? 'text-green-700 font-bold' 
              : 'text-slate-800'
          }`}>
            {getTeamShortForm(match.team1)}
          </span>
          <span className="text-slate-400 text-xs flex-shrink-0">vs</span>
          <span className={`font-semibold text-xs truncate ${
            match.status === 'completed' && match.result?.winner === match.team2 
              ? 'text-green-700 font-bold' 
              : 'text-slate-800'
          }`}>
            {getTeamShortForm(match.team2)}
          </span>
        </div>
        
        {/* Compact Match Result for completed matches */}
        {match.status === 'completed' && match.result && (
          <div className="flex items-center space-x-1 ml-6">
            <span className="text-yellow-600 text-xs">🏆</span>
            <span className="text-xs font-medium text-green-700">
              {getTeamShortForm(match.result.winner)} won by {match.result.winBy}
            </span>
            {match.result.team1Score && match.result.team2Score && (
              <span className="text-xs text-slate-500 ml-2">
                • {getTeamShortForm(match.team1)} {match.result.team1Score} | {getTeamShortForm(match.team2)} {match.result.team2Score}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Venue - Compact styling */}
      <div className="md:col-span-3 flex items-start">
        <div className="flex items-center space-x-1">
          <span className="text-purple-600 text-xs">🏟️</span>
          <span className="text-xs font-medium text-slate-700 leading-tight" title={match.venue}>
            {getVenueShortForm(match.venue || 'TBD')}
          </span>
        </div>
      </div>
      
      {/* Date & Time - Compact styling */}
      <div className="md:col-span-2 flex flex-col space-y-0.5">
        <div className="flex items-center space-x-1">
          <span className="text-orange-600 text-xs">⏰</span>
          <span className="text-xs font-semibold text-slate-800">{match.date}</span>
        </div>
        <span className="text-xs text-slate-500 ml-4">{match.time || 'TBD'}</span>
      </div>
    </div>
  );
}
