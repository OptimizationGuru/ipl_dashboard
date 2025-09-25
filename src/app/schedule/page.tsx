import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import ScheduleHeader from '@/components/schedule/ScheduleHeader';
import ScheduleContainer from '@/components/schedule/ScheduleContainer';

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <ScheduleHeader />

        <ErrorBoundary>
          <ScheduleContainer />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
