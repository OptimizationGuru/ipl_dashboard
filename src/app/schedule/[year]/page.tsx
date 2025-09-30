import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import ScheduleContainer from '@/components/schedule/ScheduleContainer';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;


// Generate static params for different years
export async function generateStaticParams() {
  console.log('[BUILD] generateStaticParams: Starting for schedule');
  const params = [
    { year: '2024' },
    { year: '2025' },
    { year: '2023' }
  ];
  console.log('[BUILD] generateStaticParams: Returning params for schedule:', params);
  return params;
}

interface SchedulePageProps {
  params: { year: string };
}

export default function SchedulePage({ params }: SchedulePageProps) {
  const selectedYear = params.year || '2025';
  console.log(`[BUILD] SchedulePage: Rendering for year ${selectedYear}`);
  
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
      <ErrorBoundary>
        <ScheduleContainer searchParams={{ year: selectedYear }} />
      </ErrorBoundary>
    </div>
  );
}
