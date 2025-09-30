'use client';

import { useRouter } from 'next/navigation';
import YearSelector from '@/components/schedule/YearSelector';

interface PointsTableYearSelectorProps {
  selectedYear: string;
  loading?: boolean;
}

export default function PointsTableYearSelector({ selectedYear, loading = false }: PointsTableYearSelectorProps) {
  const router = useRouter();

  const handleYearChange = (year: string) => {
    // Force full page reload to trigger data refetch
    window.location.href = `/points-table/${year}`;
  };

  return (
    <YearSelector 
      selectedYear={selectedYear}
      loading={loading}
      onYearChange={handleYearChange}
    />
  );
}
