import { useMemo } from 'react';
import { MatchData } from '@/types';
import MatchCard from '@/components/MatchCard';
import MatchTabs from '@/components/MatchTabs';
import { MatchesSkeleton } from '@/components/ui/Skeleton';

interface MatchesListProps {
  matches: MatchData[];
  loading: boolean;
  error: string | null;
  onMatchUpdate?: () => void;
}

export function MatchesList({ matches, loading, error, onMatchUpdate }: MatchesListProps) {
  // Memoize expensive filtering operations
  const displayMatches = useMemo(() => {
    const liveMatches = matches.filter(match => match.status === 'live');
    const upcomingMatches = matches.filter(match => match.status === 'upcoming');
    const result = liveMatches.length > 0 ? liveMatches : upcomingMatches;
    
    console.log('📊 MatchesList: Processing matches:', {
      totalMatches: matches.length,
      liveMatches: liveMatches.length,
      upcomingMatches: upcomingMatches.length,
      displayMatches: result.length,
      liveMatchIds: liveMatches.map(m => m.id),
      timestamp: new Date().toISOString()
    });
    
    return result;
  }, [matches]);

  if (loading) {
    return <MatchesSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg">Error loading matches</div>
        <div className="text-gray-400 text-sm mt-2">{error}</div>
      </div>
    );
  }
  
  if (displayMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No matches available</div>
        <div className="text-gray-400 text-sm mt-2">Check back later for updates</div>
      </div>
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
