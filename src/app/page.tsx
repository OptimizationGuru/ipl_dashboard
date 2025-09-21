'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import MatchCard from '@/components/MatchCard';
import MatchTabs from '@/components/MatchTabs';
import { MatchData } from '@/types';

// Removed async function - will use useEffect in component

function MatchesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
          <div className="flex justify-between items-center mb-3">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchesList() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/matches`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        
        const data = await response.json();
        setMatches(data.data || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <MatchesSkeleton />;
  }

  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const displayMatches = liveMatches.length > 0 ? liveMatches : upcomingMatches;

  return (
    <div className="space-y-6">
      {displayMatches.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg">No matches available</div>
          <div className="text-gray-400 text-sm mt-2">Check back later for updates</div>
        </div>
      ) : (
        displayMatches.map((match) => (
          <div key={match.id} data-match-tabs>
            {match.status === 'live' ? (
              <MatchTabs match={match} />
            ) : (
              <MatchCard match={match} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 shadow-xl border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">🏏</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">IPL T20 Dashboard</h1>
                <p className="text-slate-300 text-xs font-medium">Live scores, fixtures & points table</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const liveTab = document.getElementById('live-score-tab');
                  if (liveTab) {
                    liveTab.click();
                    // Scroll to the match section
                    setTimeout(() => {
                      const matchSection = document.querySelector('[data-match-tabs]');
                      if (matchSection) {
                        matchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
                className="group px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1"
              >
                <span className="text-sm">🏏</span>
                <span>Live Score</span>
              </button>
              <button
                onClick={() => {
                  const playingXiTab = document.getElementById('playing-xi-tab');
                  if (playingXiTab) {
                    playingXiTab.click();
                    // Scroll to the match section
                    setTimeout(() => {
                      const matchSection = document.querySelector('[data-match-tabs]');
                      if (matchSection) {
                        matchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }
                }}
                className="group px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1"
              >
                <span className="text-sm">🏆</span>
                <span>Playing XI</span>
              </button>
              <Link
                href="/points-table"
                className="group px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1"
              >
                <span className="text-sm">📊</span>
                <span>Points Table</span>
              </Link>
              <Link
                href="/schedule"
                className="group px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 text-xs font-bold shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1"
              >
                <span className="text-sm">📅</span>
                <span>Schedule</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="pt-4">
          <MatchesList />
        </div>


        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-700 mb-1">10</div>
                <div className="text-sm font-semibold text-gray-700">Teams</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Elite franchises</span> competing for the title
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏏</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-700 mb-1">74</div>
                <div className="text-sm font-semibold text-gray-700">Matches</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Total fixtures</span> in the tournament
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-slate-700 mb-1">2024</div>
                <div className="text-sm font-semibold text-gray-700">Season</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Current year</span> of IPL action
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-800 border-t border-gray-700 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center">
            {/* Main Brand */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">🏏</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  IPL T20 Dashboard
                </h3>
                <p className="text-xs text-slate-300 font-medium">Live Cricket Action</p>
              </div>
            </div>
            
            {/* Info Lines */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-400 text-xs mb-2">
              <div className="flex items-center space-x-1">
                <span>🏏</span>
                <span>Data from ESPN Cricinfo</span>
              </div>
              <div className="hidden sm:block w-px h-3 bg-gray-500"></div>
              <div className="flex items-center space-x-1">
                <span className="animate-pulse">❤️</span>
                <span>Made with love by Shivam</span>
              </div>
            </div>
            
            {/* Bottom Accent */}
            <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              <span>© 2024 IPL T20 Dashboard</span>
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
