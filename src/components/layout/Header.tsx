'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onLiveScoreClick?: () => void;
}

export function Header({ onLiveScoreClick }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLiveScoreClick = () => {
    // Close mobile menu if open
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    
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

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 shadow-lg border-b border-blue-200" ref={menuRef}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-lg sm:text-xl font-bold">🏏</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800">IPL T20 Dashboard</h1>
              <p className="text-slate-600 text-xs font-medium">Live scores, fixtures & points table</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-black text-slate-800">IPL T20</h1>
            </div>
          </div>

          {/* Desktop Navigation Buttons */}
          <div className="hidden sm:flex space-x-2">
            <button
              onClick={handleLiveScoreClick}
              className="group px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center space-x-1"
            >
              <span className="text-sm">🏏</span>
              <span className="hidden lg:inline">Live Score</span>
            </button>
            
            <Link
              href="/points-table"
              onClick={handleNavClick}
              className="group px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center space-x-1"
            >
              <span className="text-sm">📊</span>
              <span className="hidden lg:inline">Points Table</span>
            </Link>
            
            <Link
              href="/schedule"
              onClick={handleNavClick}
              className="group px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 flex items-center space-x-1"
            >
              <span className="text-sm">📅</span>
              <span className="hidden lg:inline">Schedule</span>
            </Link>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-2 space-y-2">
            <button
              onClick={handleLiveScoreClick}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-bold shadow-md active:scale-95"
            >
              <span className="text-lg">🏏</span>
              <span>Live Score</span>
            </button>
            
            <Link
              href="/points-table"
              onClick={handleNavClick}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm font-bold shadow-md active:scale-95"
            >
              <span className="text-lg">📊</span>
              <span>Points Table</span>
            </Link>
            
            <Link
              href="/schedule"
              onClick={handleNavClick}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-sm font-bold shadow-md active:scale-95"
            >
              <span className="text-lg">📅</span>
              <span>Schedule</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-blue-200">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  handleLiveScoreClick();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-bold shadow-md flex items-center justify-center space-x-2"
              >
                <span className="text-lg">🏏</span>
                <span>Live Score</span>
              </button>
              
              <Link
                href="/points-table"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm font-bold shadow-md flex items-center justify-center space-x-2"
              >
                <span className="text-lg">📊</span>
                <span>Points Table</span>
              </Link>
              
              <Link
                href="/schedule"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 text-sm font-bold shadow-md flex items-center justify-center space-x-2"
              >
                <span className="text-lg">📅</span>
                <span>Schedule</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
