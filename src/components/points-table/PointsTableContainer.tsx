import { PointsTableData } from '@/types';
import PointsTable from './PointsTable';
import { getPointsTable } from '@/lib/pointsTableService';

interface PointsTableContainerProps {
  searchParams: { year?: string };
}

export default async function PointsTableContainer({ searchParams }: PointsTableContainerProps) {
  // Server-side container that fetches data during SSG/SSR
  const selectedYear = searchParams.year || '2025';
  let pointsTable: PointsTableData[] = [];
  let error: string | null = null;

  try {
    pointsTable = await getPointsTable(selectedYear);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch points table';
    // Fallback to empty array or you could use dummy data here
    pointsTable = [];
  }

  // Container handles all data logic and passes clean props to presenter
  return (
    <div className="space-y-6">
      <PointsTable 
        pointsTable={pointsTable} 
        loading={false} 
        error={error}
        selectedYear={selectedYear}
      />
    </div>
  );
} 
