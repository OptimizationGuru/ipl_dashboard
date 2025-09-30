import { BatsmanStats, BowlerStats, BallDetails, WicketDetails } from '@/types';
import { LiveMatchState, OverStats } from './MatchSimulator';

export class StatisticsCalculator {
  
  // Calculate run rate for a team
  static calculateRunRate(runs: number, overs: number): number {
    if (!overs || overs <= 0) return 0;
    return Number((runs / overs).toFixed(2));
  }

  // Calculate required run rate for chasing team
  static calculateRequiredRunRate(target: number, currentRuns: number, oversRemaining: number): number {
    if (!oversRemaining || oversRemaining <= 0) return 0;
    const runsNeeded = Math.max(0, target - currentRuns); // Avoid negative
    return Number((runsNeeded / oversRemaining).toFixed(2));
  }

  // Calculate strike rate for a batsman
  static calculateStrikeRate(runs: number, balls: number): number {
    if (balls === 0) return 0;
    return Number(((runs / balls) * 100).toFixed(2));
  }

  // Calculate economy rate for a bowler
  static calculateEconomyRate(runs: number, balls: number): number {
    if (balls === 0) return 0;
    return Number(((runs / balls) * 6).toFixed(2));
  }

  // Calculate average for a batsman
  static calculateBattingAverage(runs: number, dismissals: number): number {
    if (dismissals === 0) return runs; // Not out
    return Number((runs / dismissals).toFixed(2));
  }

  // Calculate bowling average for a bowler
  static calculateBowlingAverage(runs: number, wickets: number): number {
    if (wickets === 0) return 0;
    return Number((runs / wickets).toFixed(2));
  }

  // Get top batsman by runs
  static getTopBatsman(batsmanStats: BatsmanStats[]): BatsmanStats | null {
    if (!batsmanStats?.length) return null;
    return batsmanStats.reduce((top, current) => {
      return (current.runs || 0) > (top.runs || 0) ? current : top;
    });
  }

  // Get top bowler by wickets
  static getTopBowler(bowlerStats: BowlerStats[]): BowlerStats | null {
    if (!bowlerStats?.length) return null;

    return bowlerStats.reduce((top, current) => {
      const currentWickets = current.wickets || 0;
      const topWickets = top.wickets || 0;
      const currentEcon = current.economy || 0;
      const topEcon = top.economy || 0;

      if (currentWickets > topWickets) return current;
      if (currentWickets === topWickets && currentEcon < topEcon) return current;
      return top;
    });
  }

  // Get best economy bowler
  static getBestEconomyBowler(bowlerStats: BowlerStats[]): BowlerStats | null {
    if (!bowlerStats?.length) return null;

    const bowlersWithOvers = bowlerStats.filter(b => b.balls > 0);
    if (!bowlersWithOvers.length) return null;

    return bowlersWithOvers.reduce((best, current) => {
      return (current.economy ?? Infinity) < (best.economy ?? Infinity) ? current : best;
    });
  }

  // Get highest strike rate batsman
  static getHighestStrikeRateBatsman(batsmanStats: BatsmanStats[]): BatsmanStats | null {
    if (!batsmanStats?.length) return null;

    const batsmenWithBalls = batsmanStats.filter(b => b.balls > 0);
    if (!batsmenWithBalls.length) return null;

    return batsmenWithBalls.reduce((best, current) => {
      return (current.strikeRate ?? 0) > (best.strikeRate ?? 0) ? current : best;
    });
  }

  // Calculate team statistics
  static calculateTeamStats(matchState: LiveMatchState) {
    const safeArray = (arr: any[]) => Array.isArray(arr) ? arr : [];

    const team1Batsmen = safeArray(matchState.batsmanStats?.team1);
    const team2Batsmen = safeArray(matchState.batsmanStats?.team2);
    const team1Bowlers = safeArray(matchState.bowlerStats?.team1);
    const team2Bowlers = safeArray(matchState.bowlerStats?.team2);

    const team1Stats = {
      runs: matchState.team1?.runs || 0,
      wickets: matchState.team1?.wickets || 0,
      overs: matchState.team1?.overs || 0,
      balls: matchState.team1?.balls || 0,
      extras: matchState.team1?.extras || 0,
      runRate: this.calculateRunRate(matchState.team1?.runs || 0, (matchState.team1?.balls || 0) / 6),
      topBatsman: this.getTopBatsman(team1Batsmen),
      topBowler: this.getTopBowler(team1Bowlers)
    };

    const team2Stats = {
      runs: matchState.team2?.runs || 0,
      wickets: matchState.team2?.wickets || 0,
      overs: matchState.team2?.overs || 0,
      balls: matchState.team2?.balls || 0,
      extras: matchState.team2?.extras || 0,
      runRate: this.calculateRunRate(matchState.team2?.runs || 0, (matchState.team2?.balls || 0) / 6),
      topBatsman: this.getTopBatsman(team2Batsmen),
      topBowler: this.getTopBowler(team2Bowlers)
    };

    return { team1: team1Stats, team2: team2Stats };
  }

  // Calculate match summary statistics
  static calculateMatchSummary(matchState: LiveMatchState) {
    const teamStats = this.calculateTeamStats(matchState);
    
    const totalRuns = (matchState.team1?.runs || 0) + (matchState.team2?.runs || 0);
    const totalWickets = (matchState.team1?.wickets || 0) + (matchState.team2?.wickets || 0);
    const totalBalls = (matchState.team1?.balls || 0) + (matchState.team2?.balls || 0);
    
    // Use balls for accurate run rate calculation instead of float overs
    const matchRunRate = this.calculateRunRate(totalRuns, totalBalls / 6);
    
    // Find best performers - safely handle missing arrays
    const safeArray = (arr: any[]) => Array.isArray(arr) ? arr : [];
    const allBatsmen = [...safeArray(matchState.batsmanStats?.team1), ...safeArray(matchState.batsmanStats?.team2)];
    const allBowlers = [...safeArray(matchState.bowlerStats?.team1), ...safeArray(matchState.bowlerStats?.team2)];
    
    const topScorer = this.getTopBatsman(allBatsmen);
    const topWicketTaker = this.getTopBowler(allBowlers);
    const bestEconomy = this.getBestEconomyBowler(allBowlers);
    const highestStrikeRate = this.getHighestStrikeRateBatsman(allBatsmen);
    
    return {
      totalRuns,
      totalWickets,
      totalBalls,
      matchRunRate,
      topScorer,
      topWicketTaker,
      bestEconomy,
      highestStrikeRate,
      teamStats
    };
  }

  // Calculate powerplay statistics
  // NOTE: This method now uses real over-by-over data instead of simplified calculations
  static calculatePowerplayStats(matchState: LiveMatchState, team: 'team1' | 'team2') {
    const teamData = matchState[team];
    const batsmanStats = matchState.batsmanStats[team];
    const overStats = matchState.overStats[team];
    
    // Powerplay is first 6 overs
    const powerplayOvers = overStats.filter(over => over.over <= 6);
    const powerplayRuns = powerplayOvers.reduce((total, over) => total + over.runs, 0);
    const powerplayWickets = powerplayOvers.reduce((total, over) => total + over.wickets, 0);
    const powerplayBalls = powerplayOvers.reduce((total, over) => total + over.balls, 0);
    
    // Calculate powerplay run rate
    const powerplayRunRate = this.calculateRunRate(powerplayRuns, powerplayBalls / 6);
    
    // Get powerplay batsmen (first 6 overs)
    const powerplayBatsmen = batsmanStats.filter(b => b.balls > 0).slice(0, 2);
    
    return {
      overs: powerplayBalls / 6,
      balls: powerplayBalls,
      runs: powerplayRuns,
      wickets: powerplayWickets,
      runRate: powerplayRunRate,
      batsmen: powerplayBatsmen
    };
  }

  // Calculate death overs statistics (last 5 overs)
  // NOTE: This method now uses real over-by-over data instead of placeholder calculations
  static calculateDeathOversStats(matchState: LiveMatchState, team: 'team1' | 'team2') {
    const teamData = matchState[team];
    const overStats = matchState.overStats[team] || [];
    const totalOvers = Math.floor(teamData.balls / 6) || 0;

    const deathOversStart = Math.max(1, totalOvers - 4);
    const deathOvers = overStats.filter(over => over.over >= deathOversStart);

    const deathOversRuns = deathOvers.reduce((total, over) => total + (over.runs || 0), 0);
    const deathOversWickets = deathOvers.reduce((total, over) => total + (over.wickets || 0), 0);
    const deathOversBalls = deathOvers.reduce((total, over) => total + (over.balls || 0), 0);

    const deathOversRunRate = this.calculateRunRate(deathOversRuns, deathOversBalls / 6);

    return {
      overs: deathOversBalls / 6,
      runs: deathOversRuns,
      wickets: deathOversWickets,
      runRate: deathOversRunRate
    };
  }

  // Calculate partnership statistics
  static calculatePartnershipStats(matchState: LiveMatchState, team: 'team1' | 'team2') {
    const batsmanStats = matchState.batsmanStats[team] || [];
    const activeBatsmen = batsmanStats.filter(b => !b.isOut && b.balls > 0);
    const runs = activeBatsmen.reduce((total, b) => total + (b.runs || 0), 0);
    const balls = activeBatsmen.reduce((total, b) => total + (b.balls || 0), 0);
    return {
      runs,
      balls,
      runRate: this.calculateRunRate(runs, balls / 6)
    };
  }

  // Calculate over-by-over statistics
  // NOTE: This method now returns real over-by-over data instead of placeholder random values
  static calculateOverByOverStats(matchState: LiveMatchState, team: 'team1' | 'team2') {
    // Return actual over-by-over data from match state
    return matchState.overStats[team].map(overStat => ({
      over: overStat.over,
      runs: overStat.runs,
      wickets: overStat.wickets,
      balls: overStat.balls,
      extras: overStat.extras
    }));
  }

  // Calculate milestone statistics
  static calculateMilestones(matchState: LiveMatchState) {
    const milestones = [];
    
    // Check for team milestones
    if (matchState.team1.runs >= 100 && matchState.team1.runs < 110) {
      milestones.push({
        type: 'team',
        team: matchState.teams.team1.name,
        milestone: '100 runs',
        description: `${matchState.teams.team1.name} reaches 100 runs!`
      });
    }
    
    if (matchState.team2.runs >= 100 && matchState.team2.runs < 110) {
      milestones.push({
        type: 'team',
        team: matchState.teams.team2.name,
        milestone: '100 runs',
        description: `${matchState.teams.team2.name} reaches 100 runs!`
      });
    }
    
    // Check for individual milestones
    const allBatsmen = [...matchState.batsmanStats.team1, ...matchState.batsmanStats.team2];
    allBatsmen.forEach(batsman => {
      if (batsman.runs >= 50 && batsman.runs < 60) {
        milestones.push({
          type: 'individual',
          player: batsman.name,
          milestone: 'Half century',
          description: `${batsman.name} scores a half century!`
        });
      }
      
      if (batsman.runs >= 100 && batsman.runs < 110) {
        milestones.push({
          type: 'individual',
          player: batsman.name,
          milestone: 'Century',
          description: `${batsman.name} scores a century!`
        });
      }
    });
    
    return milestones;
  }

  // Calculate win probability
  static calculateWinProbability(matchState: LiveMatchState): { team1: number; team2: number } {
    if (matchState.currentInnings === 1) return { team1: 50, team2: 50 };

    const target = matchState.target || 0;
    const currentRuns = matchState.team2?.runs || 0;
    const oversRemaining = Math.max(0, 20 - Math.floor((matchState.team2?.balls || 0) / 6));

    if (oversRemaining <= 0) {
      return currentRuns >= target ? { team1: 0, team2: 100 } : { team1: 100, team2: 0 };
    }

    const runsNeeded = Math.max(0, target - currentRuns);
    const requiredRunRate = runsNeeded / oversRemaining;
    const currentRunRate = this.calculateRunRate(currentRuns, 20 - oversRemaining);

    let team2Probability = 50;
    if (currentRunRate > requiredRunRate) {
      team2Probability = Math.min(95, 50 + (currentRunRate - requiredRunRate) * 10);
    } else {
      team2Probability = Math.max(5, 50 - (requiredRunRate - currentRunRate) * 10);
    }

    return {
      team1: Math.round(100 - team2Probability),
      team2: Math.round(team2Probability)
    };
  }
}
