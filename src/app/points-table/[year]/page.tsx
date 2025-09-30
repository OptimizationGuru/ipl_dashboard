import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import PointsTableLayout from '@/components/points-table/PointsTableLayout';
import PointsTableContainer from '@/components/points-table/PointsTableContainer';

// Force static generation with pre-built pages for all years
export const dynamic = 'force-static';
export const revalidate = false;

// Generate static params for different years
export async function generateStaticParams() {
  console.log('[BUILD] generateStaticParams: Starting for points-table');
  const params = [
    { year: '2024' },
    { year: '2025' },
    { year: '2023' }
  ];
  console.log('[BUILD] generateStaticParams: Returning params for points-table:', params);
  return params;
}

interface PointsTablePageProps {
  params: { year: string };
}

export default function PointsTablePage({ params }: PointsTablePageProps) {
  const selectedYear = params.year || '2025';
  console.log(`[BUILD] PointsTablePage: Rendering for year ${selectedYear}`);
  
  return (
    <PointsTableLayout selectedYear={selectedYear}>
      <ErrorBoundary>
        <PointsTableContainer searchParams={{ year: selectedYear }} />
      </ErrorBoundary>
    </PointsTableLayout>
  );
}
