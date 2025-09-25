import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import ScheduleContainer from '@/components/schedule/ScheduleContainer';

interface SchedulePageProps {
  searchParams: { year?: string };
}

export default function SchedulePage({ searchParams }: SchedulePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <ErrorBoundary>
          <ScheduleContainer searchParams={searchParams} />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
