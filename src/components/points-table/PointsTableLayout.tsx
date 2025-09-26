import { ReactNode } from 'react';
import PointsTableHeader from './PointsTableHeader';
import PointsTableStats from './PointsTableStats';

interface PointsTableLayoutProps {
  selectedYear: string;
  children: ReactNode;
}

export default function PointsTableLayout({ selectedYear, children }: PointsTableLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
      <PointsTableHeader selectedYear={selectedYear} />
      
      <div className="text-center">
        <PointsTableStats />
      </div>

      {children}
    </div>
  );
}
