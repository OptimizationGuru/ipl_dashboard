import Link from 'next/link';

interface PointsTableHeaderProps {
  selectedYear: string;
}

export default function PointsTableHeader({ selectedYear }: PointsTableHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <Link 
          href="/" 
          className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
      </div>
      
      <div className="text-center space-y-4">
        {/* Title with enhanced styling */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-5xl hover:scale-110 transition-transform duration-300">📊</div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent text-center">
              Points Table
            </h1>
          </div>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-20"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-20"></div>
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <p className="text-slate-700 text-xl font-semibold">Current standings for IPL {selectedYear}</p>
          <p className="text-slate-500 text-base">Teams ranked by points, then by net run rate</p>
        </div>
      </div>
    </div>
  );
}
