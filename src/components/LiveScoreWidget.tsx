'use client';

import { useState, useEffect } from 'react';
import { MatchData } from '@/types';

// Simple confetti effect component
const ConfettiEffect = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

interface LiveScoreWidgetProps {
  matchId: string;
  initialMatch: MatchData;
}

export default function LiveScoreWidget({ matchId, initialMatch }: LiveScoreWidgetProps) {
  const [match, setMatch] = useState<MatchData>(initialMatch);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [nextUpdateIn, setNextUpdateIn] = useState<number>(10);
  const [countdown, setCountdown] = useState<number>(10);
  const [isClient, setIsClient] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    winner: string;
    margin: string;
    method: string;
  } | null>(null);

  // Debug logging for match data
  console.log('🔍 LiveScoreWidget - Match data:', {
    match: match,
    lastWicket: match?.lastWicket,
    liveScore: match?.liveScore,
    batsmanStats: match?.batsmanStats
  });


  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for match completion and trigger confetti
  useEffect(() => {
    if (match.liveScore) {
      // Check if target is achieved in second innings
      if ((match as any).ballInfo?.currentInnings === 2 && (match as any).ballInfo?.target) {
        const currentRuns = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
          match.liveScore.team1.runs : match.liveScore.team2.runs;
        const target = (match as any).ballInfo.target;
        
        if (currentRuns >= target) {
          // Target achieved - trigger confetti
          const winningTeam = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
            match.team1 : match.team2;
          
          setMatchResult({
            winner: winningTeam,
            margin: `${currentRuns - target + 1} runs`,
            method: 'runs'
          });
          
          // Trigger confetti for 5 seconds
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }
      
      // Also check for completed matches
      if (match.status === 'completed') {
        const team1Score = match.liveScore.team1.runs;
        const team2Score = match.liveScore.team2.runs;
        
        if (team1Score > team2Score) {
          setMatchResult({
            winner: match.team1,
            margin: `${team1Score - team2Score} runs`,
            method: 'runs'
          });
        } else if (team2Score > team1Score) {
          setMatchResult({
            winner: match.team2,
            margin: `${team2Score - team1Score} runs`,
            method: 'runs'
          });
        } else {
          // Handle tie or other scenarios
          setMatchResult({
            winner: 'Match Tied',
            margin: '0 runs',
            method: 'tie'
          });
        }
        
        // Trigger confetti for 5 seconds
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [match.status, match.liveScore, match.team1, match.team2]);

  // Helper function to determine batting team based on toss and current innings
  const getBattingTeam = (match: any): 'team1' | 'team2' => {
    if (!match.tossInfo) return 'team1'; // Default fallback
    
    const currentInnings = match.ballInfo?.currentInnings || 1;
    
    // Debug logging
    console.log('🔍 getBattingTeam debug:', {
      team1: match.team1,
      team2: match.team2,
      tossWonBy: match.tossInfo.wonBy,
      choseTo: match.tossInfo.choseTo,
      currentInnings: currentInnings
    });
    
    if (currentInnings === 1) {
      // First innings - use toss decision
      if (match.tossInfo.wonBy === match.team1) {
        return match.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
      } else { // Other team won the toss
        return match.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
      }
    } else {
      // Second innings - opposite of first innings
      if (match.tossInfo.wonBy === match.team1) {
        return match.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
      } else { // Other team won the toss
        return match.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
      }
    }
  };

  useEffect(() => {
    if (match.status !== 'live') return;

    const fetchUpdate = async () => {
      console.log('🔄 Fetching live score update...');
      setIsLoading(true);
      try {
        const response = await fetch(`/api/matches?type=live`);
        const data = await response.json();
        
        console.log('📊 API Response:', data);
        
        if (data.success && data.data) {
          const liveMatch = data.data.find((m: MatchData) => m.id === matchId);
          if (liveMatch) {
            console.log('✅ Updated match data:', liveMatch.liveScore);
            setMatch(liveMatch);
            setLastUpdated(new Date());
            
            // Set next update time based on the event
            const lastEvent = (liveMatch as any).lastEvent;
            if (lastEvent && lastEvent.nextBallDelay) {
              setNextUpdateIn(lastEvent.nextBallDelay);
              setCountdown(lastEvent.nextBallDelay);
              console.log(`⏰ Next ball in ${lastEvent.nextBallDelay} seconds`);
            } else {
              setNextUpdateIn(10); // Default 10 seconds
              setCountdown(10);
            }
          } else {
            console.log('❌ No matching live match found');
          }
        } else {
          console.log('❌ API returned no data');
        }
      } catch (error) {
        console.error('❌ Error fetching live score:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchUpdate();

    // Set up dynamic interval
    const scheduleNextUpdate = () => {
      const timeout = setTimeout(() => {
        fetchUpdate().then(() => {
          scheduleNextUpdate(); // Schedule the next update
        });
      }, nextUpdateIn * 1000);
      
      return timeout;
    };

    const timeout = scheduleNextUpdate();

    return () => clearTimeout(timeout);
  }, [matchId, match.status, nextUpdateIn]);

  // Countdown timer effect
  useEffect(() => {
    if (match.status !== 'live') return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // When countdown reaches 0, trigger automatic ball update
          console.log('⏰ Countdown reached 0, triggering automatic ball update');
          fetch(`/api/matches?type=live`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.data) {
                const liveMatch = data.data.find((m: MatchData) => m.id === matchId);
                if (liveMatch) {
                  setMatch(liveMatch);
                  setLastUpdated(new Date());
                  const lastEvent = (liveMatch as any).lastEvent;
                  if (lastEvent && lastEvent.nextBallDelay) {
                    setCountdown(lastEvent.nextBallDelay);
                    setNextUpdateIn(lastEvent.nextBallDelay);
                  } else {
                    setCountdown(30);
                    setNextUpdateIn(30);
                  }
                }
              }
            })
            .catch(err => {
              console.error('Auto ball update error:', err);
              // Reset countdown on error
              setCountdown(30);
              setNextUpdateIn(30);
            });
          return 0; // Show 0 briefly before reset
        }
        return prev - 1;
      });
    }, 1000); // Update every 1 second

    return () => clearInterval(countdownInterval);
  }, [match.status, matchId]);

  // Stop countdown when match is completed
  useEffect(() => {
    if (match.status === 'completed') {
      setCountdown(0);
      setNextUpdateIn(0);
    }
  }, [match.status]);

  if (!match.liveScore) {
    return null;
  }

  return (
    <>
      <ConfettiEffect show={showConfetti} />
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
        <div className="flex items-center">
            {match.status === 'completed' ? (
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            ) : (
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
            )}
            <span className="text-white font-bold text-lg">
              {match.status === 'completed' ? 'MATCH RESULT' : 'LIVE SCORE'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-black border border-white border-opacity-30 shadow-sm">
              <span className="mr-2">🕐</span>
              Last Updated at: {isClient ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Loading...'}
              {isLoading && <span className="ml-2 animate-spin">🔄</span>}
            </div>
            {match.status === 'live' && (
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white bg-opacity-90 text-black border border-white border-opacity-30 shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Next ball: {countdown}s
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Match Result Display */}
      {match.status === 'completed' && matchResult && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-6 py-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🏆</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-green-800 mb-1">
                  {matchResult.winner} WINS!
                </h2>
                <p className="text-green-700 font-semibold">
                  Won by {matchResult.margin}
                </p>
              </div>
            </div>
            <div className="text-sm text-green-600">
              🎉 Congratulations to the winning team! 🎉
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Controls */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <button
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              setIsLoading(true);
              fetch(`/api/matches?type=live`)
                .then(res => res.json())
                .then(data => {
                  if (data.success && data.data) {
                    const liveMatch = matchId 
                      ? data.data.find((m: MatchData) => m.id === matchId)
                      : data.data.find((m: MatchData) => m.status === 'live') || data.data[0];
                    if (liveMatch) {
                      setMatch(liveMatch);
                      setLastUpdated(new Date());
                      // Reset countdown for manual refresh
                      const lastEvent = (liveMatch as any).lastEvent;
                      if (lastEvent && lastEvent.nextBallDelay) {
                        setCountdown(lastEvent.nextBallDelay);
                      }
                    }
                  }
                  setIsLoading(false);
                })
                .catch(err => {
                  console.error('Manual refresh error:', err);
                  setIsLoading(false);
                });
            }}
            className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors font-medium cursor-pointer"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {
              console.log('⚡ Next ball triggered manually');
              setIsLoading(true);
              // Immediately set countdown to 0 to show instant update
              setCountdown(0);
              fetch(`/api/matches?type=live`)
                .then(res => res.json())
                .then(data => {
                  if (data.success && data.data) {
                    const liveMatch = matchId 
                      ? data.data.find((m: MatchData) => m.id === matchId)
                      : data.data.find((m: MatchData) => m.status === 'live') || data.data[0];
                    if (liveMatch) {
                      setMatch(liveMatch);
                      setLastUpdated(new Date());
                      // Set new countdown for next ball
                      const lastEvent = (liveMatch as any).lastEvent;
                      if (lastEvent && lastEvent.nextBallDelay) {
                        setCountdown(lastEvent.nextBallDelay);
                        setNextUpdateIn(lastEvent.nextBallDelay);
                      } else {
                        setCountdown(30); // Default fallback
                        setNextUpdateIn(30);
                      }
                    }
                  }
                  setIsLoading(false);
                })
                .catch(err => {
                  console.error('Next ball error:', err);
                  setIsLoading(false);
                });
            }}
            disabled={countdown > 2}
            className={`text-xs px-2 py-1 rounded transition-colors font-medium ${
              countdown > 2 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 cursor-pointer'
            }`}
          >
            ⚡ Next Ball
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                console.log('🔄 Reset match triggered');
                setIsLoading(true);
                fetch(`/api/matches?action=reset`, { method: 'POST' })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      // Fetch fresh match data after reset
                      fetch(`/api/matches?type=live`)
                        .then(res => res.json())
                        .then(data => {
                          if (data.success && data.data) {
                            const liveMatch = matchId 
                      ? data.data.find((m: MatchData) => m.id === matchId)
                      : data.data.find((m: MatchData) => m.status === 'live') || data.data[0];
                            if (liveMatch) {
                              setMatch(liveMatch);
                              setLastUpdated(new Date());
                              setCountdown(30);
                              setNextUpdateIn(30);
                            }
                          }
                          setIsLoading(false);
                        });
                    } else {
                      setIsLoading(false);
                    }
                  })
                  .catch(err => {
                    console.error('Reset error:', err);
                    setIsLoading(false);
                  });
              }}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors font-medium cursor-pointer"
            >
              🔄 Reset
            </button>
            
            <button
              onClick={() => {
                console.log('🏏 Reset with MI batting first');
                setIsLoading(true);
                fetch(`/api/matches?action=reset&batFirst=MI`, { method: 'POST' })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      // Fetch fresh match data after reset
                      fetch(`/api/matches?type=live`)
                        .then(res => res.json())
                        .then(data => {
                          if (data.success && data.data) {
                            const liveMatch = matchId 
                      ? data.data.find((m: MatchData) => m.id === matchId)
                      : data.data.find((m: MatchData) => m.status === 'live') || data.data[0];
                            if (liveMatch) {
                              setMatch(liveMatch);
                              setLastUpdated(new Date());
                              setCountdown(30);
                              setNextUpdateIn(30);
                            }
                          }
                          setIsLoading(false);
                        });
                    } else {
                      setIsLoading(false);
                    }
                  })
                  .catch(err => {
                    console.error('Reset with MI batting first error:', err);
                    setIsLoading(false);
                  });
              }}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors font-medium cursor-pointer"
            >
              🏏 MI First
            </button>
            
            <button
              onClick={() => {
                console.log('🏏 Reset with CSK batting first');
                setIsLoading(true);
                fetch(`/api/matches?action=reset&batFirst=CSK`, { method: 'POST' })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      // Fetch fresh match data after reset
                      fetch(`/api/matches?type=live`)
                        .then(res => res.json())
                        .then(data => {
                          if (data.success && data.data) {
                            const liveMatch = matchId 
                      ? data.data.find((m: MatchData) => m.id === matchId)
                      : data.data.find((m: MatchData) => m.status === 'live') || data.data[0];
                            if (liveMatch) {
                              setMatch(liveMatch);
                              setLastUpdated(new Date());
                              setCountdown(30);
                              setNextUpdateIn(30);
                            }
                          }
                          setIsLoading(false);
                        });
                    } else {
                      setIsLoading(false);
                    }
                  })
                  .catch(err => {
                    console.error('Reset with CSK batting first error:', err);
                    setIsLoading(false);
                  });
              }}
              className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors font-medium cursor-pointer"
            >
              🏏 CSK First
            </button>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Batting Team Score */}
        {(() => {
          const battingTeam = getBattingTeam(match);
          const battingTeamData = battingTeam === 'team1' ? match.liveScore.team1 : match.liveScore.team2;
          const battingTeamName = battingTeam === 'team1' ? match.team1 : match.team2;
          const bowlingTeam = battingTeam === 'team1' ? 'team2' : 'team1';
          const bowlingTeamData = bowlingTeam === 'team1' ? match.liveScore.team1 : match.liveScore.team2;
          const bowlingTeamName = bowlingTeam === 'team1' ? match.team1 : match.team2;
          
          return (
            <>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300 shadow-lg hover:shadow-xl transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">{battingTeamName}</div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    🏏 BATTING
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-1">
                  {battingTeamData.runs}/{Math.min(battingTeamData.wickets, 10)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  ({Math.min(battingTeamData.overs, 20)} overs)
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">{bowlingTeamName}</div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    🏟️ BOWLING
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-1">
                  {bowlingTeamData.runs}/{Math.min(bowlingTeamData.wickets, 10)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  ({Math.min(bowlingTeamData.overs, 20)} overs)
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Combined Match Status */}
      <div className="mt-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold text-gray-800">Match Status</div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-300 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              {(() => {
                const currentInnings = (match as any).ballInfo?.currentInnings || 1;
                return `Innings ${currentInnings}`;
              })()}
            </span>
          </div>
        </div>
        
        {/* Current Batsmen */}
        {match.batsmanStats && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">Current Batsmen</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(() => {
                const currentBattingTeam = getBattingTeam(match);
                const currentBatsmen = match.batsmanStats[currentBattingTeam]
                  .filter(b => !b.isOut || b.balls > 0) // Show batsmen who are not out OR have faced balls (fix for backend bug)
                  .sort((a, b) => {
                    // Sort by on-strike status first, then by runs
                    if (a.isOnStrike && !b.isOnStrike) return -1;
                    if (!a.isOnStrike && b.isOnStrike) return 1;
                    return b.runs - a.runs; // Then by runs (descending)
                  })
                  .slice(0, 2);
                
                console.log('🔍 Current batsmen debug:', {
                  currentBattingTeam,
                  allBatsmen: match.batsmanStats[currentBattingTeam].map(b => ({name: b.name, runs: b.runs, balls: b.balls, isOnStrike: b.isOnStrike, isOut: b.isOut})),
                  currentBatsmen: currentBatsmen.map(b => ({name: b.name, runs: b.runs, balls: b.balls, isOnStrike: b.isOnStrike}))
                });
                
                return currentBatsmen;
              })().map((batsman, index) => (
                <div key={index} className={`p-5 rounded-xl border-2 transition-all ${
                  batsman.isOnStrike 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-md' 
                    : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
                }`}>
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 text-lg leading-tight">{batsman.name}</span>
                          {batsman.isOnStrike && (
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Runs & Balls */}
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{batsman.runs}</div>
                      <div className="text-xs text-gray-500 font-medium">RUNS</div>
                      <div className="text-xs text-gray-400 mt-1">({batsman.balls} balls)</div>
                    </div>
                    
                    {/* Strike Rate */}
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {batsman.balls > 0 ? batsman.strikeRate : '0.0'}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">STRIKE RATE</div>
                    </div>
                    
                    {/* Boundaries */}
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="flex justify-center space-x-3 mb-1">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{batsman.fours}</div>
                          <div className="text-xs text-gray-500">4s</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{batsman.sixes}</div>
                          <div className="text-xs text-gray-500">6s</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">BOUNDARIES</div>
                    </div>
                  </div>
                  
                  {/* Performance Indicator */}
                  <div className="flex items-center justify-center">
                    <div className={`w-full h-2 rounded-full ${
                      batsman.strikeRate >= 150 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      batsman.strikeRate >= 120 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      batsman.strikeRate >= 100 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                      'bg-gradient-to-r from-gray-300 to-gray-400'
                    }`}>
                      <div className="h-full bg-white bg-opacity-30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Run Rates & Current Bowler Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Run Rates */}
          <div>
            <div className="text-sm font-semibold text-gray-700 mb-3">Run Rates</div>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-gray-600 mb-1">Current Run Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                {match.liveScore.currentRunRate?.toFixed(2) || '0.00'}
              </div>
            </div>
            {(match as any).ballInfo?.currentInnings === 2 && match.status === 'live' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm font-semibold text-gray-800 mb-3">
                    Match Progress - {match.team1} vs {match.team2}
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    {(() => {
                      // Determine which team batted first based on current innings
                      const firstInningsTeam = (match as any).ballInfo?.currentInnings === 2 ? 
                        (match.liveScore.team1.runs > match.liveScore.team2.runs ? match.team1 : match.team2) : 
                        match.team1;
                      const firstInningsScore = (match as any).ballInfo?.currentInnings === 2 ? 
                        Math.max(match.liveScore.team1.runs, match.liveScore.team2.runs) : 
                        match.liveScore.team1.runs;
                      const secondInningsTeam = firstInningsTeam === match.team1 ? match.team2 : match.team1;
                      
                      return `${firstInningsTeam} scored ${firstInningsScore} in 1st innings → ${secondInningsTeam} needs ${(match as any).ballInfo?.target || 0} to win`;
                    })()}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Runs Scored: {(() => {
                        // Show the current batting team's score (the one with fewer overs)
                        return match.liveScore.team1.overs < match.liveScore.team2.overs ? 
                          match.liveScore.team1.runs : match.liveScore.team2.runs;
                      })()}</span>
                      <span>Target: {(match as any).ballInfo?.target || 0} (1st innings: {Math.max(match.liveScore.team1.runs, match.liveScore.team2.runs)})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, ((() => {
                            const currentRuns = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
                              match.liveScore.team1.runs : match.liveScore.team2.runs;
                            return (currentRuns / ((match as any).ballInfo?.target || 1)) * 100;
                          })()))}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Runs Needed</div>
                      <div className="text-lg font-bold text-red-600">
                        {(() => {
                          const currentRuns = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
                            match.liveScore.team1.runs : match.liveScore.team2.runs;
                          return Math.max(0, ((match as any).ballInfo?.target || 0) - currentRuns);
                        })()}
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Overs Left</div>
                      <div className="text-lg font-bold text-blue-600">
                        {(() => {
                          const currentOvers = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
                            match.liveScore.team1.overs : match.liveScore.team2.overs;
                          return Math.max(0, (20 - currentOvers)).toFixed(1);
                        })()}
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Required RR</div>
                      <div className="text-lg font-bold text-orange-600">
                  {match.liveScore.requiredRunRate?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-xs font-medium text-gray-600 mb-1">Wickets Lost</div>
                      <div className="text-lg font-bold text-red-600">
                        {(() => {
                          const currentBattingTeam = match.liveScore.team1.overs < match.liveScore.team2.overs ? 'team2' : 'team1';
                          return match.liveScore[currentBattingTeam].wickets;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Match Prediction */}
                  <div className="mt-3 p-2 bg-white rounded-lg border border-gray-200">
                    <div className="text-xs font-medium text-gray-600 mb-1">Match Status</div>
                    <div className="text-sm font-semibold">
                      {(() => {
                        const target = (match as any).ballInfo?.target || 0;
                        const currentRuns = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
                          match.liveScore.team1.runs : match.liveScore.team2.runs;
                        const currentOvers = match.liveScore.team1.overs < match.liveScore.team2.overs ? 
                          match.liveScore.team1.overs : match.liveScore.team2.overs;
                        const oversLeft = Math.max(0, 20 - currentOvers);
                        
                        // Only show final result if match is completed
                        if ((match as any).status === 'completed') {
                          return currentRuns >= target ? 
                            <span className="text-green-600">🏆 Match Won!</span> : 
                            <span className="text-red-600">❌ Match Lost</span>;
                        }
                        
                        // Live match status
                        if (currentRuns >= target) {
                          return <span className="text-green-600">🏆 Target Achieved!</span>;
                        }
                        
                        const requiredRR = match.liveScore.requiredRunRate || 0;
                        const currentRR = match.liveScore.currentRunRate || 0;
                        
                        if (currentRR >= requiredRR) {
                          return <span className="text-blue-600">⚡ On track to win</span>;
                        } else {
                          return <span className="text-orange-600">⚠️ Needs to accelerate</span>;
                        }
                      })()}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Bowler */}
        {match.bowlerStats && (
          <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">Current Bowler</div>
            {(() => {
              const currentBowlingTeam = getBattingTeam(match) === 'team1' ? 'team2' : 'team1';
              return match.bowlerStats[currentBowlingTeam].filter(b => b.isBowling);
            })().map((bowler, index) => (
                <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-base">{bowler.name}</span>
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                      BOWLING
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{bowler.overs}</div>
                      <div className="text-xs text-gray-600">Overs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{bowler.runs}/{bowler.wickets}</div>
                      <div className="text-xs text-gray-600">Runs/Wkts</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        bowler.economy < 6 ? 'text-green-600' :
                        bowler.economy < 8 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {bowler.economy.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">Economy</div>
                </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Last Over */}
        {match.lastOver && match.lastOver.length > 0 && (
          <div className="mt-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-700">Last Over</div>
                <div className="text-xs text-gray-500">
                  {match.lastOver.length} balls
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
              {match.lastOver.map((ball, index) => (
                <div 
                  key={index} 
                    className={`px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:scale-105 ${
                      ball.type === 'wicket' ? 'bg-red-100 text-red-800 border border-red-200' :
                      ball.type === 'wide' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      ball.type === 'noball' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                      ball.type === 'bye' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                      ball.type === 'legbye' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                      ball.runs === 4 ? 'bg-green-100 text-green-800 border border-green-200' :
                      ball.runs === 6 ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      ball.runs === 0 ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                      'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {ball.type === 'wide' && 'wd'}
                  {ball.type === 'noball' && 'nb'}
                  {ball.type === 'wicket' && 'W'}
                    {ball.type === 'bye' && 'b'}
                    {ball.type === 'legbye' && 'lb'}
                  {ball.type === 'ball' && ball.runs}
                </div>
              ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Last Wicket */}
      {match.lastWicket ? (
        match.lastWicket.batsman && match.lastWicket.batsman !== 'No batsman' && match.lastWicket.fallOfWicket !== '0/0' && (
        <div className="mt-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">Last Wicket</div>
              <div className="text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                  WICKET
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg">W</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{match.lastWicket.batsman}</div>
                    <div className="text-sm text-gray-600">
                      {match.lastWicket.runs}({match.lastWicket.balls}) - {match.lastWicket.runs} runs in {match.lastWicket.balls} balls
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{match.lastWicket.runs}</div>
                  <div className="text-xs text-gray-500">runs</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Fall of wicket:</span> {match.lastWicket.fallOfWicket}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Over:</span> {match.lastWicket.over}
                </div>
              </div>
          </div>
          </div>
        </div>
        )
      ) : (
        // Show current match state when no wicket has fallen
        <div className="mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">Current Score</div>
              <div className="text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  LIVE
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">📊</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {match.liveScore.team1.runs < match.liveScore.team2.runs ? match.team2 : match.team1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.max(match.liveScore.team1.runs, match.liveScore.team2.runs)}/{Math.max(match.liveScore.team1.wickets, match.liveScore.team2.wickets)} - {Math.max(match.liveScore.team1.runs, match.liveScore.team2.runs)} runs for {Math.max(match.liveScore.team1.wickets, match.liveScore.team2.wickets)} wickets
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{Math.max(match.liveScore.team1.runs, match.liveScore.team2.runs)}</div>
                  <div className="text-xs text-gray-500">runs</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Current Score:</span> {Math.max(match.liveScore.team1.runs, match.liveScore.team2.runs)}/{Math.max(match.liveScore.team1.wickets, match.liveScore.team2.wickets)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Overs:</span> {Math.max(match.liveScore.team1.overs, match.liveScore.team2.overs)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last 18 Balls */}
      {match.last18Balls && match.last18Balls.length > 0 && (
        <div className="mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">Recent Balls</div>
              <div className="text-xs text-gray-500">
                {match.last18Balls.length} balls
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
            {match.last18Balls.map((ball, index) => (
              <div 
                key={index} 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all hover:scale-105 ${
                    ball.type === 'wicket' ? 'bg-red-100 text-red-800 border border-red-200' :
                    ball.type === 'wide' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                    ball.type === 'noball' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                    ball.type === 'bye' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                    ball.type === 'legbye' ? 'bg-teal-100 text-teal-800 border border-teal-200' :
                    ball.runs === 4 ? 'bg-green-100 text-green-800 border border-green-200' :
                    ball.runs === 6 ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                    ball.runs === 0 ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                    'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {ball.type === 'wide' && 'wd'}
                {ball.type === 'noball' && 'nb'}
                {ball.type === 'wicket' && 'W'}
                  {ball.type === 'bye' && 'b'}
                  {ball.type === 'legbye' && 'lb'}
                {ball.type === 'ball' && ball.runs}
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Commentary */}
      <div className="mt-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">Live Commentary (Last 3 Overs)</div>
            <button
              onClick={() => {
                console.log('⚡ Next ball triggered from commentary');
                setIsLoading(true);
                // Immediately set countdown to 0 to show instant update
                setCountdown(0);
                fetch(`/api/matches?type=live`)
                  .then(res => res.json())
                  .then(data => {
                    if (data.success && data.data) {
                      const liveMatch = matchId 
                      ? data.data.find((m: MatchData) => m.id === matchId)
                      : data.data.find((m: MatchData) => m.status === 'live') || data.data[0];
                      if (liveMatch) {
                        setMatch(liveMatch);
                        setLastUpdated(new Date());
                        const lastEvent = (liveMatch as any).lastEvent;
                        if (lastEvent && lastEvent.nextBallDelay) {
                          setCountdown(lastEvent.nextBallDelay);
                          setNextUpdateIn(lastEvent.nextBallDelay);
                        } else {
                          setCountdown(30); // Default fallback
                          setNextUpdateIn(30);
                        }
                      }
                    }
                    setIsLoading(false);
                  })
                  .catch(err => {
                    console.error('Next ball error:', err);
                    setIsLoading(false);
                  });
              }}
              disabled={countdown > 2}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 font-semibold shadow-sm ${
                countdown > 2 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 cursor-pointer'
              }`}
            >
              ⚡ Next Ball
            </button>
          </div>
        
        {/* Commentary History */}
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
          {(match as any).commentaryHistory && (match as any).commentaryHistory.length > 0 ? (
            <div className="space-y-2">
              {[...(match as any).commentaryHistory].reverse().map((event: any, index: number) => {
                const originalIndex = (match as any).commentaryHistory.length - 1 - index;
                const isLatest = originalIndex === (match as any).commentaryHistory.length - 1;
                return (
                  <div 
                    key={originalIndex} 
                    className={`text-xs p-2 rounded ${
                      isLatest
                        ? 'bg-blue-100 border-l-4 border-blue-500 font-semibold' 
                        : 'bg-white border-l-2 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{event.description}</span>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.type === 'wicket' ? 'bg-red-100 text-red-800' :
                          event.type === 'wide' ? 'bg-yellow-100 text-yellow-800' :
                          event.type === 'noball' ? 'bg-orange-100 text-orange-800' :
                          event.type === 'bye' ? 'bg-cyan-100 text-cyan-800' :
                          event.type === 'legbye' ? 'bg-teal-100 text-teal-800' :
                          event.runs === 4 ? 'bg-green-100 text-green-800' :
                          event.runs === 6 ? 'bg-purple-100 text-purple-800' :
                          event.runs === 0 ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {event.type === 'wide' && 'wd'}
                          {event.type === 'noball' && 'nb'}
                          {event.type === 'wicket' && 'W'}
                          {event.type === 'bye' && 'b'}
                          {event.type === 'legbye' && 'lb'}
                          {event.type === 'ball' && event.runs}
                        </span>
                        {isLatest && (
                          <span className="text-xs text-blue-600 font-semibold">LIVE</span>
                        )}
                      </div>
          </div>
                    {event.type === 'noball' && isLatest && (
                      <div className="mt-1 text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-1 rounded">
              🎯 FREE HIT - Next ball cannot be out (except run out)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No commentary available yet
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Toss Information */}
      {match.tossInfo && (
        <div className="mt-4">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">Toss Information</div>
              <div className="text-xs text-gray-500">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                  🪙 TOSS
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-xl">🪙</span>
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {match.tossInfo.wonBy}
                  </div>
                  <div className="text-sm text-gray-600">
                    Won the toss and chose to <span className="font-semibold text-gray-800">
                      {match.tossInfo.choseTo === 'bat' ? 'bat first' : 'field first'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                    match.tossInfo.choseTo === 'bat' 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {match.tossInfo.choseTo === 'bat' ? '🏏 Bat First' : '🏟️ Field First'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* All Batsmen Stats */}
      {match.batsmanStats && (
        <div className="mt-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-800">All Batsmen</div>
            <div className="text-xs text-gray-500">
              {(() => {
                const currentBattingTeam = getBattingTeam(match);
                return match.batsmanStats[currentBattingTeam].filter(b => b.balls > 0 || b.isOut).length;
              })()} batsmen
            </div>
          </div>
          
          {/* Batsmen Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600">
            <div className="col-span-3">Batsman</div>
            <div className="col-span-2 text-center">Runs</div>
            <div className="col-span-2 text-center">Balls</div>
            <div className="col-span-2 text-center">SR</div>
            <div className="col-span-2 text-center">4s/6s</div>
            <div className="col-span-1 text-center">Bowler/Fielder</div>
          </div>
          
          {/* Batsmen List */}
          <div className="space-y-2">
            {(() => {
              const currentBattingTeam = getBattingTeam(match);
              return match.batsmanStats[currentBattingTeam]
                .filter(batsman => batsman.balls > 0 || batsman.isOut) // Show batsmen who have faced balls or are out
                .sort((a, b) => {
                  // Sort by runs (descending), then by balls faced (descending)
                  if (b.runs !== a.runs) return b.runs - a.runs;
                  return b.balls - a.balls;
                })
                .map((batsman, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Batsman Name */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                          {batsman.name}
                          {!batsman.isOut && <span className="text-green-600 ml-1">*</span>}
                        </span>
                        {batsman.isOnStrike && (
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                    </div>
                    
                    {/* Runs */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {batsman.runs}
                      </span>
                    </div>
                    
                    {/* Balls */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {batsman.balls}
                      </span>
                    </div>
                    
                    {/* Strike Rate */}
                    <div className="col-span-2 text-center">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        batsman.strikeRate >= 150 ? 'bg-green-100 text-green-800' :
                        batsman.strikeRate >= 120 ? 'bg-yellow-100 text-yellow-800' :
                        batsman.strikeRate >= 100 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {batsman.strikeRate.toFixed(1)}
                      </span>
                    </div>
                    
                    {/* 4s/6s */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {batsman.fours}/{batsman.sixes}
                      </span>
                    </div>
                    
                    {/* Bowler/Fielder */}
                    <div className="col-span-1 text-center">
                      {batsman.isOut ? (
                        <div className="text-xs text-gray-600">
                          {(() => {
                            const wicketInfo = match.lastWicket && match.lastWicket.batsman === batsman.name 
                              ? match.lastWicket 
                              : null;
                            return wicketInfo ? (
                              <div>
                                <div className="font-medium text-red-600">b {(match as any).currentBowler || 'Unknown'}</div>
                                <div className="text-gray-500 text-xs">{wicketInfo.fallOfWicket}</div>
                              </div>
                            ) : (
                              <span className="text-red-600">OUT</span>
                            );
                          })()}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </div>
                ));
            })()}
          </div>
          
          
          {/* Summary Stats */}
          {(() => {
            const currentBattingTeam = getBattingTeam(match);
            const batsmen = match.batsmanStats[currentBattingTeam].filter(b => b.balls > 0 || b.isOut);
            const totalRuns = batsmen.reduce((sum, b) => sum + b.runs, 0);
            const totalBalls = batsmen.reduce((sum, b) => sum + b.balls, 0);
            const totalFours = batsmen.reduce((sum, b) => sum + b.fours, 0);
            const totalSixes = batsmen.reduce((sum, b) => sum + b.sixes, 0);
            const avgStrikeRate = batsmen.length > 0 ? batsmen.reduce((sum, b) => sum + b.strikeRate, 0) / batsmen.length : 0;
            
            // Get extras from match data
            const extras = (match as any).extras?.[currentBattingTeam] || 0;
            const teamTotal = currentBattingTeam === 'team1' ? match.liveScore.team1.runs : match.liveScore.team2.runs;
            const batsmenPlusExtras = totalRuns + extras;
            
            return (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalRuns}</div>
                  <div className="text-xs text-gray-600">Batsmen Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{extras}</div>
                  <div className="text-xs text-gray-600">Extras</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${batsmenPlusExtras === teamTotal ? 'text-green-600' : 'text-red-600'}`}>
                    {batsmenPlusExtras}
                  </div>
                  <div className="text-xs text-gray-600">Total (B+E)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalBalls}</div>
                  <div className="text-xs text-gray-600">Total Balls</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalFours}</div>
                  <div className="text-xs text-gray-600">4s Hit</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalSixes}</div>
                  <div className="text-xs text-gray-600">6s Hit</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* All Bowler Stats */}
      {match.bowlerStats && (
        <div className="mt-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-800">All Bowlers</div>
            <div className="text-xs text-gray-500">
              {(() => {
                const currentBowlingTeam = getBattingTeam(match) === 'team1' ? 'team2' : 'team1';
                return match.bowlerStats[currentBowlingTeam].filter(b => b.balls > 0).length;
              })()} bowlers
            </div>
          </div>
          
          {/* Bowlers Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-3 px-3 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600">
            <div className="col-span-4">Bowler</div>
            <div className="col-span-2 text-center">Overs</div>
            <div className="col-span-2 text-center">Runs</div>
            <div className="col-span-2 text-center">Wkts</div>
            <div className="col-span-2 text-center">Economy</div>
          </div>
          
          {/* Bowlers List */}
          <div className="space-y-2">
            {(() => {
              const currentBowlingTeam = getBattingTeam(match) === 'team1' ? 'team2' : 'team1';
              return match.bowlerStats[currentBowlingTeam]
              .filter(bowler => bowler.balls > 0) // Only show bowlers who have actually bowled
                .sort((a, b) => {
                  // Sort by overs bowled (descending), then by economy (ascending)
                  if (b.overs !== a.overs) return b.overs - a.overs;
                  return a.economy - b.economy;
                })
              .map((bowler, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Bowler Name */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{bowler.name}</span>
                        {bowler.isBowling && (
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        )}
                      </div>
                    </div>
                    
                    {/* Overs */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-800">{bowler.overs}</span>
                    </div>
                    
                    {/* Runs */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {bowler.runs}
                      </span>
                    </div>
                    
                    {/* Wickets */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {bowler.wickets}
                      </span>
                    </div>
                    
                    {/* Economy */}
                    <div className="col-span-2 text-center">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        bowler.economy < 6 ? 'bg-green-100 text-green-800' :
                        bowler.economy < 8 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bowler.economy.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ));
            })()}
          </div>
          
          {/* Summary Stats */}
          {(() => {
            const currentBowlingTeam = getBattingTeam(match) === 'team1' ? 'team2' : 'team1';
            const bowlers = match.bowlerStats[currentBowlingTeam].filter(b => b.balls > 0);
            const totalOvers = Math.min(bowlers.reduce((sum, b) => sum + b.overs, 0), 20); // Cap at 20 overs for T20
            const totalRuns = bowlers.reduce((sum, b) => sum + b.runs, 0);
            const totalWickets = Math.min(bowlers.reduce((sum, b) => sum + b.wickets, 0), 10); // Cap at 10 wickets
            const avgEconomy = bowlers.length > 0 ? bowlers.reduce((sum, b) => sum + b.economy, 0) / bowlers.length : 0;
            
            // Get extras from match data for the batting team (opposite of bowling team)
            const battingTeam = getBattingTeam(match);
            const extras = (match as any).extras?.[battingTeam] || 0;
            const teamTotal = battingTeam === 'team1' ? match.liveScore.team1.runs : match.liveScore.team2.runs;
            const bowlersPlusExtras = totalRuns + extras;
            
            return (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalOvers.toFixed(1)}</div>
                  <div className="text-xs text-gray-600">Total Overs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalRuns}</div>
                  <div className="text-xs text-gray-600">Bowler Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{extras}</div>
                  <div className="text-xs text-gray-600">Extras</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${bowlersPlusExtras === teamTotal ? 'text-green-600' : 'text-red-600'}`}>
                    {bowlersPlusExtras}
                  </div>
                  <div className="text-xs text-gray-600">Total (B+E)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{totalWickets}</div>
                  <div className="text-xs text-gray-600">Wickets</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      </div>
    </div>
    </>
  );
}
