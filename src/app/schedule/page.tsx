import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import ScheduleContainer from '@/components/schedule/ScheduleContainer';

interface SchedulePageProps {
  searchParams: { year?: string };
}

export default function SchedulePage({ searchParams }: SchedulePageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
      <ErrorBoundary>
        <ScheduleContainer searchParams={searchParams} />
      </ErrorBoundary>
    </div>
  );
}
