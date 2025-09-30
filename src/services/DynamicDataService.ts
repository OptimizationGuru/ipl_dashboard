import { MatchData, PointsTableData, ScheduleData, TossInfo } from '@/types';
import { Team, getTeamData, selectRandomTeams, IPL_VENUES, IPL_TEAMS } from '@/data/teams';
import { MatchSimulator, LiveMatchState } from './MatchSimulator';
import { StatisticsCalculator } from './StatisticsCalculator';

export class DynamicDataService {
  private static instance: DynamicDataService;
  private matchSimulator: MatchSimulator;
  private currentTeams: { team1: string; team2: string } | null = null;
  private liveMatchData: MatchData | null = null;

  private constructor() {
    this.matchSimulator = new MatchSimulator();
  }

  static getInstance(): DynamicDataService {
    if (!DynamicDataService.instance) {
      DynamicDataService.instance = new DynamicDataService();
    }
    return DynamicDataService.instance;
  }

  // Team management methods
  getAvailableTeams(): string[] {
    return Object.keys(IPL_TEAMS || {});
  }

  selectRandomTeams(): { team1: string; team2: string } {
    const available = this.getAvailableTeams();
    if (available.length < 2) throw new Error('Not enough teams to select');
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return { team1: shuffled[0], team2: shuffled[1] };
  }

  setTeams(team1: string, team2: string): void {
    this.currentTeams = { team1, team2 };
    console.log(`🎯 Teams set: ${team1} vs ${team2}`);
  }

  getCurrentTeams(): { team1: string; team2: string } | null {
    return this.currentTeams;
  }

  getTeamData(teamName: string): Team | null {
    return getTeamData(teamName);
  }

  forceRandomTeams(): void {
    this.currentTeams = this.selectRandomTeams();
    console.log(`🎲 Forced random teams: ${this.currentTeams.team1} vs ${this.currentTeams.team2}`);
  }

  // Match simulation methods
  generateLiveMatch(): MatchData {
    // Always use random teams for new matches unless specifically set
    if (!this.currentTeams) {
      this.currentTeams = this.selectRandomTeams();
    }

    const team1Data = getTeamData(this.currentTeams.team1);
    const team2Data = getTeamData(this.currentTeams.team2);

    if (!team1Data || !team2Data) {
      throw new Error('Invalid team data');
    }

    // Generate toss info
    const tossInfo = this.generateTossInfo(this.currentTeams.team1, this.currentTeams.team2);
    
    // Initialize match state using MatchSimulator
    const matchState = this.matchSimulator.initializeMatchState(team1Data, team2Data, tossInfo);
    
    // Generate initial match data without initial event
    // The first API call will generate the initial event
    const matchData = this.buildMatchData(matchState, 'live');
    
    this.liveMatchData = matchData;
    return matchData;
  }

  updateLiveMatch(): MatchData {
    if (!this.liveMatchData) return this.generateLiveMatch();

    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return this.generateLiveMatch();

    // Ensure basic safe values
    matchState.team1.balls ||= 0;
    matchState.team2.balls ||= 0;
    matchState.team1.runs ||= 0;
    matchState.team2.runs ||= 0;
    matchState.team1.wickets ||= 0;
    matchState.team2.wickets ||= 0;
    matchState.batsmanStats ||= { team1: [], team2: [] };
    matchState.bowlerStats ||= { team1: [], team2: [] };
    matchState.overStats ||= { team1: [], team2: [] };

    // Generate next event
    const event = this.matchSimulator.generateCricketEvent();
    this.matchSimulator.processEvent(event);

    // Updated match state
    const updatedState = this.matchSimulator.getMatchState();
    if (!updatedState) return this.generateLiveMatch();

    // Update overs safely
    updatedState.team1.overs = Math.floor(updatedState.team1.balls / 6);
    updatedState.team2.overs = Math.floor(updatedState.team2.balls / 6);

    // ===== STRIKE CHANGE LOGIC FIX =====
    // Handle strike swap on odd runs (ball events with odd runs)
    if (event.type === 'ball' && event.runs % 2 === 1) {
      const temp = updatedState.strikerIndex;
      updatedState.strikerIndex = updatedState.nonStrikerIndex;
      updatedState.nonStrikerIndex = temp;
      
      // Update isOnStrike properties to match the indices
      const battingTeam = updatedState.currentInnings === 1 ? 'team1' : 'team2';
      const batsmanStats = updatedState.batsmanStats[battingTeam];
      
      // Reset all isOnStrike to false
      batsmanStats.forEach(batsman => batsman.isOnStrike = false);
      
      // Set the correct batsmen as on strike and non-strike
      if (batsmanStats[updatedState.strikerIndex]) {
        batsmanStats[updatedState.strikerIndex].isOnStrike = true;
      }
    }

    // Handle strike swap at end of over (when 6 legal balls are completed)
    if (updatedState.legalBallsThisOver >= 6) {
      const temp = updatedState.strikerIndex;
      updatedState.strikerIndex = updatedState.nonStrikerIndex;
      updatedState.nonStrikerIndex = temp;
      updatedState.legalBallsThisOver = 0; // Reset for next over
      
      // Update isOnStrike properties to match the indices
      const battingTeam = updatedState.currentInnings === 1 ? 'team1' : 'team2';
      const batsmanStats = updatedState.batsmanStats[battingTeam];
      
      // Reset all isOnStrike to false
      batsmanStats.forEach(batsman => batsman.isOnStrike = false);
      
      // Set the correct batsmen as on strike and non-strike
      if (batsmanStats[updatedState.strikerIndex]) {
        batsmanStats[updatedState.strikerIndex].isOnStrike = true;
      }
    }

    // Build final match data
    const updatedMatchData = this.buildMatchData(updatedState, 'live');
    this.liveMatchData = updatedMatchData;

    return updatedMatchData;
  }

  resetMatch(): MatchData {
    this.matchSimulator.resetMatchState();
    this.liveMatchData = null;
    this.currentTeams = null;
    return this.generateLiveMatch();
  }

  // Data generation methods
  generateUpcomingMatch(): MatchData {
    const teams = selectRandomTeams();
    const team1Data = getTeamData(teams.team1);
    const team2Data = getTeamData(teams.team2);
    const venue = IPL_VENUES[Math.floor(Math.random() * IPL_VENUES.length)];
    const date = new Date();
    
    if (!team1Data || !team2Data) {
      throw new Error('Invalid team data for upcoming match');
    }
    
    // For upcoming matches, include teams data for Playing XI
    return {
      id: `upcoming-${Date.now()}`,
      team1: teams.team1,
      team2: teams.team2,
      venue,
      date: date.toISOString(),
      time: '19:30',
      status: 'upcoming',
      teams: {
        team1: team1Data,
        team2: team2Data
      }
    } as MatchData;
  }

  generateUpcomingMatches(): MatchData[] {
    const matches: MatchData[] = [];
    const venues = [...IPL_VENUES];
    
    for (let i = 0; i < 5; i++) {
      const teams = selectRandomTeams();
      const team1Data = getTeamData(teams.team1);
      const team2Data = getTeamData(teams.team2);
      
      if (!team1Data || !team2Data) continue;
      
      const tossInfo = this.generateTossInfo(teams.team1, teams.team2);
      const matchState = this.matchSimulator.initializeMatchState(team1Data, team2Data, tossInfo);
      
      const matchData = this.buildMatchData(matchState, 'upcoming');
      matches.push(matchData);
    }
    
    return matches;
  }

  generatePointsTable(): PointsTableData[] {
    const teams = this.getAvailableTeams();
    const pointsTable: PointsTableData[] = [];
    
    teams.forEach((team, index) => {
      const matches = Math.floor(Math.random() * 8) + 8; // 8-15 matches
      const wins = Math.floor(Math.random() * matches);
      const losses = matches - wins;
      const points = wins * 2;
      const netRunRate = (Math.random() - 0.5) * 2; // -1 to 1
      
      pointsTable.push({
        team,
        matches,
        won: wins,
        lost: losses,
        tied: 0,
        noResult: 0,
        points,
        netRunRate: Number(netRunRate.toFixed(3)),
        position: 0
      });
    });
    
    // Sort by points, then by net run rate - with safe handling
    return pointsTable
      .map(team => ({ ...team, points: team.points || 0, netRunRate: team.netRunRate || 0 }))
      .sort((a, b) => {
        const pointsDiff = (b.points || 0) - (a.points || 0);
        if (pointsDiff !== 0) return pointsDiff;
        return (b.netRunRate || 0) - (a.netRunRate || 0);
      });
  }

  generateSchedule(): ScheduleData[] {
    const schedule: ScheduleData[] = [];
    const teams = this.getAvailableTeams();
    const venues = [...IPL_VENUES];
    
    // Generate 30 matches
    for (let i = 0; i < 30; i++) {
      const teams = selectRandomTeams();
      const venue = venues[Math.floor(Math.random() * venues.length)];
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      schedule.push({
        id: `match-${i + 1}`,
        team1: teams.team1,
        team2: teams.team2,
        venue,
        date: date.toISOString(),
        time: '19:30',
        matchNumber: i + 1,
        season: '2024',
        status: 'upcoming'
      });
    }
    
    return schedule;
  }

  // Private helper methods
  private generateTossInfo(team1: string, team2: string): TossInfo {
    const tossWinner = Math.random() < 0.5 ? team1 : team2;
    const choseTo = Math.random() < 0.5 ? 'bat' : 'field';

    return {
      wonBy: tossWinner,
      choseTo,
      description: `${tossWinner} won the toss and chose to ${choseTo} first`
    };
  }

  // Format overs in proper cricket notation (e.g., "2.1" for 2 completed overs + 1 ball)
  private formatOvers(completedOvers: number, ballsInCurrentOver: number): number {
    // Convert to decimal format for display: completedOvers.ballsInCurrentOver
    return completedOvers + (ballsInCurrentOver / 10);
  }

  private buildMatchData(matchState: LiveMatchState, status: 'live' | 'upcoming' | 'completed'): MatchData {
    const venue = IPL_VENUES[Math.floor(Math.random() * IPL_VENUES.length)];
    const date = new Date();
    
    // Calculate statistics only for live matches
    const teamStats = status === 'live' ? StatisticsCalculator.calculateTeamStats(matchState) : null;
    const matchSummary = status === 'live' ? StatisticsCalculator.calculateMatchSummary(matchState) : null;
    const winProbability = status === 'live' ? StatisticsCalculator.calculateWinProbability(matchState) : null;
    
    const baseMatchData = {
      id: `match-${Date.now()}`,
      team1: matchState.teams.team1.name,
      team2: matchState.teams.team2.name,
      venue,
      date: date.toISOString(),
      time: '19:30',
      status,
      tossInfo: matchState.tossInfo,
      currentInnings: matchState.currentInnings,
      // Always include teams data for Playing XI
      teams: matchState.teams,
      // Only include live score data for live matches
      ...(status === 'live' && {
        liveScore: {
          team1: {
            runs: matchState.team1.runs,
            wickets: matchState.team1.wickets,
            overs: this.formatOvers(matchState.team1.overs, matchState.team1.balls),
            balls: matchState.team1.balls,
            extras: matchState.team1.extras
          },
          team2: {
            runs: matchState.team2.runs,
            wickets: matchState.team2.wickets,
            overs: this.formatOvers(matchState.team2.overs, matchState.team2.balls),
            balls: matchState.team2.balls,
            extras: matchState.team2.extras
          },
          currentBatsman: matchState.currentBatsman,
          currentBowler: matchState.currentBowler,
          currentRunRate: teamStats?.team1.runRate || 0
        },
        batsmanStats: matchState.batsmanStats,
        bowlerStats: matchState.bowlerStats,
        lastWicket: matchState.lastWicket,
        lastOver: matchState.lastOver,
        currentOver: matchState.currentOver,
        last18Balls: matchState.last18Balls,
        commentaryHistory: matchState.commentaryHistory,
        teamStats,
        matchSummary,
        winProbability,
        lastEvent: matchState.lastEvent
      })
    } as MatchData;
    
    return baseMatchData;
  }

  // Get current live match
  getCurrentLiveMatch(): MatchData | null {
    return this.liveMatchData;
  }

  // Get match state
  getMatchState(): LiveMatchState | null {
    return this.matchSimulator.getMatchState();
  }

  // Force next ball
  forceNextBall(): MatchData {
    return this.updateLiveMatch();
  }

  // Get match statistics
  getMatchStatistics(): any {
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return null;
    
    return StatisticsCalculator.calculateMatchSummary(matchState);
  }

  // Get team statistics
  getTeamStatistics(team: 'team1' | 'team2'): any {
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return null;
    
    const teamStats = StatisticsCalculator.calculateTeamStats(matchState);
    return teamStats[team];
  }

  // Get powerplay statistics
  getPowerplayStats(team: 'team1' | 'team2'): any {
    if (!this.liveMatchData) return null;
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return null;
    return StatisticsCalculator.calculatePowerplayStats(matchState, team);
  }

  // Get death overs statistics
  getDeathOversStats(team: 'team1' | 'team2'): any {
    if (!this.liveMatchData) return null;
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return null;
    return StatisticsCalculator.calculateDeathOversStats(matchState, team);
  }

  // Get partnership statistics
  getPartnershipStats(team: 'team1' | 'team2'): any {
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return null;
    
    return StatisticsCalculator.calculatePartnershipStats(matchState, team);
  }

  // Get milestones
  getMilestones(): any[] {
    if (!this.liveMatchData) return [];
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return [];
    return StatisticsCalculator.calculateMilestones(matchState);
  }

  // Get win probability
  getWinProbability(): { team1: number; team2: number } {
    if (!this.liveMatchData) return { team1: 50, team2: 50 };
    const matchState = this.matchSimulator.getMatchState();
    if (!matchState) return { team1: 50, team2: 50 };
    return StatisticsCalculator.calculateWinProbability(matchState);
  }
}
