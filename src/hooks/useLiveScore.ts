import { useState, useEffect, useCallback } from 'react';
import { MatchData } from '@/types';
import { DynamicDataService } from '@/services/DynamicDataService';
import { useLiveScoreTimer } from './useLiveScoreTimer';
import { useMatchResult } from './useMatchResult';

interface UseLiveScoreProps {
  matchId: string;
  initialMatch: MatchData;
  onMatchUpdate?: () => void;
}

export function useLiveScore({ matchId, initialMatch, onMatchUpdate }: UseLiveScoreProps) {
  const [match, setMatch] = useState<MatchData>(initialMatch);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  // Use DynamicDataService directly - NO API calls
  const dynamicService = DynamicDataService.getInstance();
  const { countdown, nextUpdateIn, updateTimer, resetTimer } = useLiveScoreTimer({ 
    isLive: match.status === 'live' 
  });
  const { showConfetti, matchResult } = useMatchResult(match);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Helper function to update match data
  const updateMatchData = useCallback((newMatch: MatchData, nextDelay?: number) => {
    
    setMatch(newMatch);
    setLastUpdated(new Date());
    
    // 🚨 CRITICAL BUG FIX: Use the actual nextDelay from the event, not hardcoded 30
    if (nextDelay !== undefined && nextDelay !== null) {
      updateTimer(nextDelay);
    } else {
      updateTimer(30);
    }
  }, [updateTimer]);

  // Auto-fetch updates for live matches
  useEffect(() => {
    if (match.status !== 'live') {
      return;
    }


    let timeoutId: NodeJS.Timeout;

    const scheduleNextUpdate = (delay: number) => {
      
      timeoutId = setTimeout(() => {
        try {
          
          // Use DynamicDataService directly - NO API call
          const updatedMatch = dynamicService.updateLiveMatch();
          const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
          
          // 🚨 CRITICAL BUG FIX: Use actual event delay, fallback to 30
          const nextDelay = eventDelay !== undefined ? eventDelay : 30;
          updateMatchData(updatedMatch, nextDelay);
          
          // 🚨 CRITICAL BUG FIX: Only schedule next update if match is still live
          if (updatedMatch.status === 'live') {
            scheduleNextUpdate(nextDelay);
          } else {
          }
        } catch (error) {
          console.error('❌ Error in scheduled update:', error);
          // If update fails, retry after default delay
          scheduleNextUpdate(30);
        }
      }, delay * 1000);
    };

    // Initial update
    const performInitialUpdate = () => {
      try {
        
        // Use DynamicDataService directly - NO API call
        const updatedMatch = dynamicService.updateLiveMatch();
        const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
        
        // 🚨 CRITICAL BUG FIX: Use actual event delay, fallback to 30
        const nextDelay = eventDelay !== undefined ? eventDelay : 30;
        updateMatchData(updatedMatch, nextDelay);
        
        // 🚨 CRITICAL BUG FIX: Only schedule next update if match is still live
        if (updatedMatch.status === 'live') {
          scheduleNextUpdate(nextDelay);
        } else {
        }
      } catch (error) {
        console.error('❌ Error in initial update:', error);
        // If initial update fails, use default delay
        scheduleNextUpdate(30);
      }
    };

    performInitialUpdate();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [match.status, dynamicService, matchId]);

  // Event handlers - using DynamicDataService directly
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedMatch = dynamicService.updateLiveMatch();
      const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
      const nextDelay = eventDelay !== undefined ? eventDelay : 30;
      
      updateMatchData(updatedMatch, nextDelay);
    } catch (error) {
      console.error('❌ Error refreshing match:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData]);

  const handleNextBall = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedMatch = dynamicService.updateLiveMatch();
      const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
      const nextDelay = eventDelay !== undefined ? eventDelay : 30;
      
      updateMatchData(updatedMatch, nextDelay);
    } catch (error) {
      console.error('❌ Error with next ball:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData]);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    try {
      const newMatch = dynamicService.resetMatch();
      updateMatchData(newMatch);
      resetTimer();
    } catch (error) {
      console.error('❌ Error resetting match:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData, resetTimer]);

  const handleRandomTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      dynamicService.forceRandomTeams();
      const newMatch = dynamicService.resetMatch();
      updateMatchData(newMatch);
      resetTimer();
    } catch (error) {
      console.error('❌ Error with random teams:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData, resetTimer]);

  const handleSpecificTeams = useCallback(async (team1: string, team2: string) => {
    setIsLoading(true);
    try {
      dynamicService.setTeams(team1, team2);
      const newMatch = dynamicService.resetMatch();
      updateMatchData(newMatch);
      resetTimer();
    } catch (error) {
      console.error('❌ Error with specific teams:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData, resetTimer]);

  return {
    // State
    match,
    isLoading,
    lastUpdated,
    countdown,
    isClient,
    showConfetti,
    matchResult,
    
    // Actions
    handleRefresh,
    handleNextBall,
    handleReset,
    handleRandomTeams,
    handleSpecificTeams,
  };
}
