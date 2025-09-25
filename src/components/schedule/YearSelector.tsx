'use client';

import { useRouter } from 'next/navigation';

interface YearSelectorProps {
  selectedYear: string;
  onYearChange?: (year: string) => void;
  loading?: boolean;
}

const AVAILABLE_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025'];

export default function YearSelector({ selectedYear, onYearChange, loading = false }: YearSelectorProps) {
  const router = useRouter();

  const handleYearChange = (year: string) => {
    if (onYearChange) {
      onYearChange(year);
    } else {
      // Default behavior: navigate to new URL with year parameter
      router.push(`/schedule?year=${year}`);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        id="year-select"
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        disabled={loading}
        className="px-3 py-1.5 border border-blue-200 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {AVAILABLE_YEARS.map((year) => (
          <option key={year} value={year} className="bg-white text-blue-900">
            {year}
          </option>
        ))}
      </select>
      {loading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-xs text-blue-600">Loading...</span>
        </div>
      )}
    </div>
  );
}
