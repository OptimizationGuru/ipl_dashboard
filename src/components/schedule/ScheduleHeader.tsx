import Link from 'next/link';

export default function ScheduleHeader() {
  return (
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
        <p className="text-slate-600 text-lg">Complete fixture list for IPL 2025</p>
        <p className="text-slate-500 text-sm mt-1">All matches scheduled for the season</p>
      </div>
    </div>
  );
}
