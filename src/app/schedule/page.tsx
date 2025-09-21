import Link from 'next/link';
import ScheduleRow from '@/components/ScheduleRow';
import { ScheduleData } from '@/types';

async function getSchedule(): Promise<ScheduleData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/schedule`, {
      next: { revalidate: 3600 } // Revalidate every hour (SSG)
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}

function ScheduleSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-3 bg-gray-100 font-semibold text-sm text-gray-700">
        <div>Match</div>
        <div>Teams</div>
        <div>Venue</div>
        <div>Date & Time</div>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b border-gray-200 animate-pulse">
          <div className="flex items-center">
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-6"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function ScheduleContent() {
  const schedule = await getSchedule();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <ScheduleRow isHeader={true} />
      {schedule.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-500 text-lg">No schedule data available</div>
          <div className="text-gray-400 text-sm mt-2">Check back later for updates</div>
        </div>
      ) : (
        schedule.map((match) => (
          <ScheduleRow key={match.id} match={match} />
        ))
      )}
    </div>
  );
}

export default async function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">IPL 2024 Schedule</h1>
              <p className="text-gray-600 text-sm">Complete fixture list for the season</p>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Live Matches
              </Link>
              <Link
                href="/points-table"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Points Table
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Match Fixtures</h2>
          <p className="text-gray-600 text-sm">
            All matches scheduled for IPL 2024 season
          </p>
        </div>

        <ScheduleContent />

        {/* Season Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Season Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total Matches:</span>
              <span className="ml-2 text-gray-600">74</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Teams:</span>
              <span className="ml-2 text-gray-600">10</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Season:</span>
              <span className="ml-2 text-gray-600">2024</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Format:</span>
              <span className="ml-2 text-gray-600">Round Robin + Playoffs</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>IPL T20 Dashboard - Match Schedule</p>
            <p className="mt-2">Schedule updated daily</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
