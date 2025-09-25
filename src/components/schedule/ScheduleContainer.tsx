import { ScheduleData } from '@/types';
import { getSchedule } from '@/lib/scheduleService';
import ScheduleTable from './ScheduleTable';
import SeasonInfo from './SeasonInfo';

export default async function ScheduleContainer() {
  // Server-side container that fetches data during SSG/SSR
  let schedule: ScheduleData[] = [];
  let error: string | null = null;

  try {
    schedule = await getSchedule();
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
      />
      <SeasonInfo totalMatches={schedule.length} />
    </div>
  );
}
