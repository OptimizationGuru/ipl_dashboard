'use client';

import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { MatchesList } from '@/components/dashboard/MatchesList';
import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import { useMatches } from '@/hooks/useMatches';

export default function Home() {
  const { matches, loading, error, refetch } = useMatches();
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-16 sm:pt-20 pb-6">
      <div className="pt-2 sm:pt-4">
        <ErrorBoundary>
          <MatchesList matches={matches} loading={loading} error={error} onMatchUpdate={refetch} />
        </ErrorBoundary>
      </div>
      
      <StatsGrid />
    </div>
  );
}
