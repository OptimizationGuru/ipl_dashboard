import { redirect } from 'next/navigation';

// Redirect to the default year (2025)
export default function SchedulePage() {
  redirect('/schedule/2025');
}
