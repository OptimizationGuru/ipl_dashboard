import { ScheduleData } from '@/types';
import { getSchedule } from '@/lib/scheduleService';
import ScheduleTable from './ScheduleTable';
import SeasonInfo from './SeasonInfo';
import YearSelector from './YearSelector';

// List of valid IPL team names for filtering
const IPL_TEAMS = [
  'Chennai Super Kings',
  'Mumbai Indians',
  'Royal Challengers Bengaluru',
  'Kolkata Knight Riders',
  'Delhi Capitals',
  'Punjab Kings',
  'Rajasthan Royals',
  'Sunrisers Hyderabad',
  'Gujarat Titans',
  'Lucknow Super Giants'
];

function isIPLMatch(match: ScheduleData): boolean {
  // Check if both teams are IPL teams
  const team1IsIPL = IPL_TEAMS.some(team => 
    match.team1.toLowerCase().includes(team.toLowerCase()) ||
    team.toLowerCase().includes(match.team1.toLowerCase())
  );
  
  const team2IsIPL = IPL_TEAMS.some(team => 
    match.team2.toLowerCase().includes(team.toLowerCase()) ||
    team.toLowerCase().includes(match.team2.toLowerCase())
  );
  
  return team1IsIPL && team2IsIPL;
}

interface ScheduleContainerProps {
  searchParams: { year?: string };
}

export default async function ScheduleContainer({ searchParams }: ScheduleContainerProps) {
  // Server-side container that fetches data during SSG/SSR
  const selectedYear = searchParams.year || '2025';
  let schedule: ScheduleData[] = [];
  let error: string | null = null;

  try {
    const allMatches = await getSchedule(selectedYear);
    // Filter to only show IPL matches
    schedule = allMatches.filter(isIPLMatch);
    console.log(`Filtered ${allMatches.length} total matches to ${schedule.length} IPL matches for year ${selectedYear}`);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch schedule';
  }

  // Container handles all data logic and passes clean props to presenter
  return (
    <div className="space-y-6">
      <ScheduleTable 
        schedule={schedule} 
        loading={false} 
        error={error}
        selectedYear={selectedYear}
      />
      <SeasonInfo totalMatches={schedule.length} season={selectedYear} />
    </div>
  );
}
