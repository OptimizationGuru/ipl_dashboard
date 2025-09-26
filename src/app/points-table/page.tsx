import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import PointsTableLayout from '@/components/points-table/PointsTableLayout';
import PointsTableContainer from '@/components/points-table/PointsTableContainer';

interface PointsTablePageProps {
  searchParams: { year?: string };
}

export default function PointsTablePage({ searchParams }: PointsTablePageProps) {
  const selectedYear = searchParams.year || '2025';
  
  return (
    <PointsTableLayout selectedYear={selectedYear}>
      <ErrorBoundary>
        <PointsTableContainer searchParams={{ year: selectedYear }} />
      </ErrorBoundary>
    </PointsTableLayout>
  );
}
