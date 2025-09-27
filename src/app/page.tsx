'use client';

import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { MatchesList } from '@/components/dashboard/MatchesList';
import { ErrorBoundary } from '@/components/dashboard/ErrorBoundary';
import { useMatches } from '@/hooks/useMatches';

export default function Home() {
  const { matches, loading, error, refetch } = useMatches();

  const handleLiveScoreClick = () => {
    // Trigger a refetch to ensure we have the latest data
    refetch();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
      <div className="pt-4">
        <ErrorBoundary>
          <MatchesList matches={matches} loading={loading} error={error} onMatchUpdate={refetch} />
        </ErrorBoundary>
      </div>
      
      <StatsGrid />
    </div>
  );
}
