import { useMemo } from 'react';
import { MatchData } from '@/types';
import MatchCard from '@/components/MatchCard';
import MatchTabs from '@/components/MatchTabs';
import { MatchesSkeleton } from '@/components/ui/Skeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import EmptyState from '@/components/ui/EmptyState';

interface MatchesListProps {
  matches: MatchData[];
  loading: boolean;
  error: string | null;
  onMatchUpdate?: () => void;
}

export function MatchesList({ matches, loading, error, onMatchUpdate }: MatchesListProps) {

  const displayMatches = useMemo(() => {
    const liveMatches = matches.filter(match => match.status === 'live');
    const upcomingMatches = matches.filter(match => match.status === 'upcoming');
    const result = liveMatches.length > 0 ? liveMatches : upcomingMatches;    
    return result;
  }, [matches]);

  if (loading) {
    return <MatchesSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} title="Error loading matches" />;
  }
  
  if (displayMatches.length === 0) {
    return (
      <EmptyState 
        title="No matches available"
        description="Check back later for updates"
        icon="🏏"
      />
    );
  }

  return (
    <div className="space-y-6">
      {displayMatches.map((match) => (
        <div key={match.id} data-match-tabs>
          {match.status === 'live' ? (
            <MatchTabs match={match} onMatchUpdate={onMatchUpdate} />
          ) : (
            <MatchCard match={match} />
          )}
        </div>
      ))}
    </div>
  );
}
