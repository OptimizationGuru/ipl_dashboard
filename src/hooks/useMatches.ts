import { useState, useEffect, useCallback, useRef } from 'react';
import { MatchData } from '@/types';

interface UseMatchesOptions {
  type?: 'all' | 'live' | 'upcoming';
  refetchInterval?: number;
  retryCount?: number;
}

interface UseMatchesReturn {
  matches: MatchData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMatches({
  type = 'all',
  refetchInterval = 30000,
  retryCount = 3
}: UseMatchesOptions = {}): UseMatchesReturn {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const matchesRef = useRef<MatchData[]>([]);

  const fetchMatches = useCallback(async (retryAttempt = 0) => {
    try {
      setError(null);
      const apiUrl = `/api/matches?type=${type}&t=${Date.now()}`;
      
      console.log('🔄 useMatches: Fetching matches...', {
        type,
        retryAttempt,
        apiUrl,
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(10000),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('📡 useMatches: API Response:', {
        success: data.success,
        dataLength: data.data?.length || 0,
        cached: data.cached,
        dynamic: data.dynamic,
        liveMatches: data.data?.filter((m: any) => m.status === 'live').length || 0,
        timestamp: new Date().toISOString()
      });
      
      const newMatches = data.data || [];
      setMatches(newMatches);
      matchesRef.current = newMatches;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error('❌ useMatches: Error fetching matches:', {
        error: errorMessage,
        retryAttempt,
        timestamp: new Date().toISOString()
      });
      
      // Retry logic for network errors
      if (retryAttempt < retryCount && 
          (error instanceof Error && (error.name === 'TypeError' || error.message.includes('fetch')))) {
        console.log('🔄 useMatches: Retrying in', 2000 * (retryAttempt + 1), 'ms');
        setTimeout(() => fetchMatches(retryAttempt + 1), 2000 * (retryAttempt + 1));
        return;
      }
      
      setError(errorMessage);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [type, retryCount]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    // Initial fetch with delay to ensure server is ready
    const timeoutId = setTimeout(() => {
      fetchMatches();
    }, 1000);

    // No more interval - matches are handled by DynamicDataService
    // const interval = setInterval(() => { ... }, refetchInterval);
    
    return () => {
      clearTimeout(timeoutId);
      // clearInterval(interval); // No interval to clear
    };
  }, [fetchMatches, refetchInterval]);

  return {
    matches,
    loading,
    error,
    refetch
  };
}
