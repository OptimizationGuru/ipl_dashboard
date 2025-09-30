import { redirect } from 'next/navigation';

// Redirect to the default year (2025)
export default function PointsTablePage() {
  redirect('/points-table/2025');
}
