import Link from 'next/link';
import PointsTableRow from '@/components/PointsTableRow';
import { PointsTableData } from '@/types';

async function getPointsTable(): Promise<PointsTableData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/points-table`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch points table');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching points table:', error);
    return [];
  }
}

function PointsTableSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-9 gap-2 p-3 bg-gray-100 font-semibold text-sm text-gray-700">
        <div className="text-center">Pos</div>
        <div className="col-span-2">Team</div>
        <div className="text-center">M</div>
        <div className="text-center">W</div>
        <div className="text-center">L</div>
        <div className="text-center">T</div>
        <div className="text-center">Pts</div>
        <div className="text-center">NRR</div>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="grid grid-cols-9 gap-2 p-3 border-b border-gray-200 animate-pulse">
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded mx-auto w-6"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded mx-auto w-6"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded mx-auto w-6"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded mx-auto w-6"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded mx-auto w-6"></div>
          </div>
          <div className="text-center">
            <div className="h-4 bg-gray-200 rounded mx-auto w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function PointsTableContent() {
  const pointsTable = await getPointsTable();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <PointsTableRow isHeader={true} />
      {pointsTable.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-gray-500 text-lg">No points table data available</div>
          <div className="text-gray-400 text-sm mt-2">Check back later for updates</div>
        </div>
      ) : (
        pointsTable.map((team) => (
          <PointsTableRow key={team.team} team={team} />
        ))
      )}
    </div>
  );
}

export default async function PointsTablePage() {
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
              <h1 className="text-2xl font-bold text-gray-900 mt-2">IPL Points Table</h1>
              <p className="text-gray-600 text-sm">Current standings for IPL 2024</p>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Live Matches
              </Link>
              <Link
                href="/schedule"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Schedule
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Standings</h2>
          <p className="text-gray-600 text-sm">
            Teams ranked by points, then by net run rate
          </p>
        </div>

        <PointsTableContent />

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Top 4 - Playoff Qualification</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">5th-6th - Mid Table</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-gray-600">7th-10th - Bottom Half</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <p><strong>M:</strong> Matches | <strong>W:</strong> Won | <strong>L:</strong> Lost | <strong>T:</strong> Tied | <strong>Pts:</strong> Points | <strong>NRR:</strong> Net Run Rate</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>IPL T20 Dashboard - Points Table</p>
            <p className="mt-2">Data updated every 5 minutes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
