import Link from 'next/link';
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Link 
              href="/" 
              className="group flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-800 mb-2">📅 Match Schedule</h1>
            <p className="text-slate-600 text-lg">Complete match schedule and results for IPL {searchParams.year || '2025'}</p>
            <p className="text-slate-500 text-sm mt-1">All matches with venues, timings, and live results</p>
          </div>
        </div>

        <ErrorBoundary>
          <ScheduleContainer searchParams={searchParams} />
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
