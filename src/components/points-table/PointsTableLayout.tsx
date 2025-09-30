import { ReactNode } from 'react';
import PointsTableHeader from './PointsTableHeader';
import PointsTableStats from './PointsTableStats';

interface PointsTableLayoutProps {
  selectedYear: string;
  children: ReactNode;
}

export default function PointsTableLayout({ selectedYear, children }: PointsTableLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-6">
      <PointsTableHeader selectedYear={selectedYear} />
      
      <div className="text-center">
        <PointsTableStats />
      </div>

      {children}
    </div>
  );
}
