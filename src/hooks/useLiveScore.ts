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
    console.log('🔄 updateMatchData called:', {
      matchId,
      nextDelay,
      hasLastEvent: !!(newMatch as any).lastEvent,
      lastEventDelay: (newMatch as any).lastEvent?.nextBallDelay,
      timestamp: new Date().toISOString()
    });
    
    setMatch(newMatch);
    setLastUpdated(new Date());
    
    // 🚨 CRITICAL BUG FIX: Use the actual nextDelay from the event, not hardcoded 30
    if (nextDelay !== undefined && nextDelay !== null) {
      console.log('⏰ Updating timer with delay:', nextDelay);
      updateTimer(nextDelay);
    } else {
      console.log('⚠️ No nextDelay provided, using default 30');
      updateTimer(30);
    }
  }, [updateTimer]);

  // Auto-fetch updates for live matches
  useEffect(() => {
    if (match.status !== 'live') {
      console.log('⏸️ Match not live, skipping auto-updates');
      return;
    }

    console.log('🚀 Starting auto-update loop for live match:', matchId);

    let timeoutId: NodeJS.Timeout;

    const scheduleNextUpdate = (delay: number) => {
      console.log('⏰ Scheduling next update in', delay, 'seconds');
      
      timeoutId = setTimeout(() => {
        try {
          console.log('🎯 Executing scheduled update...');
          
          // Use DynamicDataService directly - NO API call
          const updatedMatch = dynamicService.updateLiveMatch();
          const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
          
          console.log('📊 Update results:', {
            eventType: (updatedMatch as any).lastEvent?.type,
            eventDelay,
            description: (updatedMatch as any).lastEvent?.description,
            timestamp: new Date().toISOString()
          });
          
          // 🚨 CRITICAL BUG FIX: Use actual event delay, fallback to 30
          const nextDelay = eventDelay !== undefined ? eventDelay : 30;
          updateMatchData(updatedMatch, nextDelay);
          
          // 🚨 CRITICAL BUG FIX: Only schedule next update if match is still live
          if (updatedMatch.status === 'live') {
            console.log('🔄 Match still live, scheduling next update in', nextDelay, 'seconds');
            scheduleNextUpdate(nextDelay);
          } else {
            console.log('🏁 Match completed, stopping auto-updates');
          }
        } catch (error) {
          console.error('❌ Error in scheduled update:', error);
          // If update fails, retry after default delay
          console.log('🔄 Retrying in 30 seconds...');
          scheduleNextUpdate(30);
        }
      }, delay * 1000);
    };

    // Initial update
    const performInitialUpdate = () => {
      try {
        console.log('🎬 Performing initial update...');
        
        // Use DynamicDataService directly - NO API call
        const updatedMatch = dynamicService.updateLiveMatch();
        const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
        
        console.log('📊 Initial update results:', {
          eventType: (updatedMatch as any).lastEvent?.type,
          eventDelay,
          description: (updatedMatch as any).lastEvent?.description,
          timestamp: new Date().toISOString()
        });
        
        // 🚨 CRITICAL BUG FIX: Use actual event delay, fallback to 30
        const nextDelay = eventDelay !== undefined ? eventDelay : 30;
        updateMatchData(updatedMatch, nextDelay);
        
        // 🚨 CRITICAL BUG FIX: Only schedule next update if match is still live
        if (updatedMatch.status === 'live') {
          console.log('🔄 Match live after initial update, scheduling next update in', nextDelay, 'seconds');
          scheduleNextUpdate(nextDelay);
        } else {
          console.log('🏁 Match completed after initial update');
        }
      } catch (error) {
        console.error('❌ Error in initial update:', error);
        // If initial update fails, use default delay
        console.log('🔄 Initial update failed, retrying in 30 seconds...');
        scheduleNextUpdate(30);
      }
    };

    performInitialUpdate();

    return () => {
      console.log('🧹 Cleaning up auto-update timeout');
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [match.status, dynamicService, matchId]);

  // Event handlers - using DynamicDataService directly
  const handleRefresh = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    setIsLoading(true);
    try {
      const updatedMatch = dynamicService.updateLiveMatch();
      const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
      const nextDelay = eventDelay !== undefined ? eventDelay : 30;
      
      console.log('📊 Refresh results:', {
        eventType: (updatedMatch as any).lastEvent?.type,
        eventDelay,
        nextDelay,
        timestamp: new Date().toISOString()
      });
      
      updateMatchData(updatedMatch, nextDelay);
    } catch (error) {
      console.error('❌ Error refreshing match:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData]);

  const handleNextBall = useCallback(async () => {
    console.log('⚡ Next ball triggered');
    setIsLoading(true);
    try {
      const updatedMatch = dynamicService.updateLiveMatch();
      const eventDelay = (updatedMatch as any).lastEvent?.nextBallDelay;
      const nextDelay = eventDelay !== undefined ? eventDelay : 30;
      
      console.log('📊 Next ball results:', {
        eventType: (updatedMatch as any).lastEvent?.type,
        eventDelay,
        nextDelay,
        description: (updatedMatch as any).lastEvent?.description,
        timestamp: new Date().toISOString()
      });
      
      updateMatchData(updatedMatch, nextDelay);
    } catch (error) {
      console.error('❌ Error with next ball:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData]);

  const handleReset = useCallback(async () => {
    console.log('🔄 Match reset triggered');
    setIsLoading(true);
    try {
      const newMatch = dynamicService.resetMatch();
      console.log('📊 Reset results:', {
        matchId: newMatch.id,
        status: newMatch.status,
        timestamp: new Date().toISOString()
      });
      updateMatchData(newMatch);
      resetTimer();
    } catch (error) {
      console.error('❌ Error resetting match:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData, resetTimer]);

  const handleRandomTeams = useCallback(async () => {
    console.log('🎲 Random teams triggered');
    setIsLoading(true);
    try {
      dynamicService.forceRandomTeams();
      const newMatch = dynamicService.resetMatch();
      console.log('📊 Random teams results:', {
        team1: newMatch.team1,
        team2: newMatch.team2,
        timestamp: new Date().toISOString()
      });
      updateMatchData(newMatch);
      resetTimer();
    } catch (error) {
      console.error('❌ Error with random teams:', error);
    }
    setIsLoading(false);
  }, [dynamicService, updateMatchData, resetTimer]);

  const handleSpecificTeams = useCallback(async (team1: string, team2: string) => {
    console.log('🎯 Specific teams triggered:', { team1, team2 });
    setIsLoading(true);
    try {
      dynamicService.setTeams(team1, team2);
      const newMatch = dynamicService.resetMatch();
      console.log('📊 Specific teams results:', {
        team1: newMatch.team1,
        team2: newMatch.team2,
        timestamp: new Date().toISOString()
      });
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
