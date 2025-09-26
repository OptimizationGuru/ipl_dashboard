'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  onLiveScoreClick?: () => void;
}

export function Header({ onLiveScoreClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLiveScoreClick = () => {
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      router.push('/');
      return;
    }

    // If we're on the home page, execute the live score logic
    // First, scroll to top to ensure we can see the content
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Try to find and click the live score tab
    const liveTab = document.getElementById('live-score-tab');
    if (liveTab) {
      liveTab.click();
    }
    
    // Scroll to match section with retry logic
    const scrollToMatch = () => {
      const matchSection = document.querySelector('[data-match-tabs]');
      if (matchSection) {
        matchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };
    
    // Try immediately, then retry after a short delay
    if (!scrollToMatch()) {
      setTimeout(() => {
        scrollToMatch();
      }, 500);
    }
    
    onLiveScoreClick?.();
  };


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 shadow-lg border-b border-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-bold">🏏</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">IPL T20 Dashboard</h1>
              <p className="text-slate-600 text-xs font-medium">Live scores, fixtures & points table</p>
            </div>
          </div>

          {/* Navigation Buttons - Updated */}
          <div className="flex space-x-2">
            <button
              onClick={handleLiveScoreClick}
              className="group px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center space-x-1"
            >
              <span className="text-sm">🏏</span>
              <span>Live Score</span>
            </button>
            
            <Link
              href="/points-table"
              className="group px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center space-x-1"
            >
              <span className="text-sm">📊</span>
              <span>Points Table</span>
            </Link>
            
            <Link
              href="/schedule"
              className="group px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center space-x-1"
            >
              <span className="text-sm">📅</span>
              <span>Schedule</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
