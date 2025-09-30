'use client';

import { MatchData } from '@/types';
import { useLiveScore } from '@/hooks/useLiveScore';
import ConfettiEffect from './effects/ConfettiEffect';
import MatchHeader from './live-score/MatchHeader';
import MatchResultDisplay from './live-score/MatchResultDisplay';
import ControlButtons from './live-score/ControlButtons';
import TeamScoreDisplay from './live-score/TeamScoreDisplay';
import BatsmanStats from './live-score/BatsmanStats';
import RunRatesAndProgress from './live-score/RunRatesAndProgress';
import CurrentBowler from './live-score/CurrentBowler';
import BallByBallDisplay from './live-score/BallByBallDisplay';
import LastWicket from './live-score/LastWicket';
import LiveCommentary from './live-score/LiveCommentary';

interface LiveScoreWidgetProps {
  matchId: string;
  initialMatch: MatchData;
  onMatchUpdate?: () => void;
}

export default function LiveScoreWidgetRefactored({ matchId, initialMatch, onMatchUpdate }: LiveScoreWidgetProps) {
  const {
    match,
    isLoading,
    lastUpdated,
    countdown,
    isClient,
    showConfetti,
    matchResult,
    handleRefresh,
    handleNextBall,
    handleReset,
    handleRandomTeams,
    handleSpecificTeams,
  } = useLiveScore({ matchId, initialMatch, onMatchUpdate });

  return (
    <>
      <ConfettiEffect show={showConfetti} />
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <MatchHeader
          match={match}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          countdown={countdown}
          isClient={isClient}
        />
        
        <MatchResultDisplay match={match} matchResult={matchResult} />
        
        <div className="p-3 sm:p-4">
          <ControlButtons
            matchId={matchId}
            isLoading={isLoading}
            onRefresh={handleRefresh}
            onNextBall={handleNextBall}
            onReset={handleReset}
            onRandomTeams={handleRandomTeams}
            onSpecificTeams={handleSpecificTeams}
          />
          
          <TeamScoreDisplay match={match} />
          
          {/* Match Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800">Match Status</div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-300 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                {(() => {
                  const currentInnings = (match as any).ballInfo?.currentInnings || 1;
                  return `Innings ${currentInnings}`;
                })()}
              </span>
            </div>
          </div>
          
          {/* Batsman Statistics */}
          <BatsmanStats match={match} />
          
          {/* Run Rates & Match Progress Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <RunRatesAndProgress match={match} />
            <CurrentBowler match={match} />
          </div>
          
          {/* Current Over */}
          <BallByBallDisplay 
            balls={match.currentOver || []} 
            title="Current Over"
            subtitle={match.currentOver ? `${match.currentOver.length} balls` : undefined}
          />
          
        
          
          {/* Last Wicket */}
          <LastWicket match={match} />
          
          {/* Last 18 Balls */}
          <BallByBallDisplay 
            balls={match.last18Balls || []} 
            title="Recent Balls"
            subtitle={match.last18Balls ? `${match.last18Balls.length} balls` : undefined}
          />
          
          {/* Live Commentary */}
          <LiveCommentary 
            match={match} 
            onNextBall={handleNextBall}
            countdown={countdown}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
