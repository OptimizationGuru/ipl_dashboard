export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100 border-t border-blue-200 mt-8">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="text-center">
          {/* Main Brand */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-xs sm:text-sm font-bold">🏏</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                IPL T20 Dashboard
              </h3>
              <p className="text-xs text-slate-600 font-medium hidden sm:block">Live Cricket Action</p>
            </div>
          </div>
          
          {/* Info Lines */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-slate-600 text-xs mb-2">
            <div className="flex items-center space-x-1">
              <span>🏏</span>
              <span>Data from ESPN Cricinfo</span>
            </div>
            <div className="hidden sm:block w-px h-3 bg-slate-300"></div>
            <div className="flex items-center space-x-1">
              <span className="animate-pulse">❤️</span>
              <span>Made with love by Shivam</span>
            </div>
          </div>
          
          {/* Bottom Accent */}
          <div className="flex items-center justify-center space-x-2 text-slate-600 text-xs">
            <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            <span>© 2024 IPL T20 Dashboard</span>
            <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
