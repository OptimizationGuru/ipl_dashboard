import { ScheduleData } from '@/types';
import { getSchedule } from '@/lib/scheduleService';
import ScheduleTable from './ScheduleTable';
import SeasonInfo from './SeasonInfo';
import YearSelector from './YearSelector';

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
  const selectedYear = searchParams.year || '2025';
  let schedule: ScheduleData[] = [];
  let error: string | null = null;

  try {
    const allMatches = await getSchedule(selectedYear);
    schedule = allMatches.filter(isIPLMatch);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch schedule';
  }

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
