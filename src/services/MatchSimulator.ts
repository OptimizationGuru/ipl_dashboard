import { BatsmanStats, BowlerStats, TossInfo, BallDetails, WicketDetails } from '@/types';
import { Team, Player } from '@/data/teams';

export interface CricketEvent {
  type: 'ball' | 'wide' | 'noball' | 'wicket' | 'freehit' | 'bye' | 'legbye';
  runs: number;
  description: string;
  batsman?: string;
  bowler?: string;
  fielder?: string;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
  nextBallDelay?: number; // Time until next ball in seconds
}

export interface OverStats {
  over: number;
  runs: number;
  wickets: number;
  balls: number;
  extras: number;
}

export interface LiveMatchState {
  team1: {
    runs: number;
    wickets: number;
    overs: number; // Keep for backward compatibility (decimal format)
    balls: number; // Keep balls as source of truth
    extras: number; // Wide, no-ball, byes, leg-byes
    // New display fields for overs
    oversStr: string; // e.g., "2.5"
    completedOvers: number; // e.g., 2
  };
  team2: {
    runs: number;
    wickets: number;
    overs: number; // Keep for backward compatibility (decimal format)
    balls: number; // Keep balls as source of truth
    extras: number; // Wide, no-ball, byes, leg-byes
    // New display fields for overs
    oversStr: string; // e.g., "2.5"
    completedOvers: number; // e.g., 2
  };
  currentBatsman: string;
  currentBowler: string;
  requiredRunRate?: number;
  isFreeHit: boolean;
  lastEvent?: CricketEvent;
  teams: {
    team1: Team;
    team2: Team;
  };
  currentInnings: 1 | 2; // 1 = team1 batting, 2 = team2 batting
  target?: number; // Target for second innings
  tossInfo: TossInfo;
  batsmanStats: {
    team1: BatsmanStats[];
    team2: BatsmanStats[];
  };
  bowlerStats: {
    team1: BowlerStats[];
    team2: BowlerStats[];
  };
  strikerIndex: number; // Index of current striker in batting team
  nonStrikerIndex: number; // Index of current non-striker in batting team
  bowlerIndex: number; // Index of current bowler in bowling team
  lastUpdateTime: number; // Timestamp of last ball update
  lastOver: BallDetails[]; // Last completed over ball-by-ball details
  currentOver: BallDetails[]; // Current over in progress
  lastWicket?: WicketDetails; // Last wicket details
  last18Balls: BallDetails[]; // Last 18 balls for comprehensive display
  commentaryHistory: CricketEvent[]; // Last 18 events (including extras) for commentary
  isMatchCompleted: boolean; // Whether the match is completed
  legalBallsThisOver: number; // Count of legal balls in current over
  // Over-by-over tracking
  overStats: {
    team1: OverStats[]; // Completed overs stats for team1
    team2: OverStats[]; // Completed overs stats for team2
  };
  team1Finished?: { // First innings data (when team1 finishes batting)
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    extras: number;
    oversStr: string;
    completedOvers: number;
  };
}

export class MatchSimulator {
  private matchState: LiveMatchState | null = null;
  
  // Constants for innings completion
  private static readonly BALLS_IN_INNINGS = 20 * 6; // 120 balls = 20 overs
  private static readonly MAX_BALLS_PER_BOWLER = 4 * 6; // 24 balls = 4 overs
  
  // Seeded random number generator for deterministic testing
  private seed: number | null = null;
  private randomState: number = 1;

  // Initialize match state
  initializeMatchState(team1: Team, team2: Team, tossInfo: TossInfo): LiveMatchState {
    // Initialize batsman stats (all start at 0/0)
    const team1BatsmanStats: BatsmanStats[] = team1.players.map((player) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: false // Will be set based on toss
    }));

    const team2BatsmanStats: BatsmanStats[] = team2.players.map((player) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: false // Will be set based on toss
    }));

    // Initialize bowler stats (all start at 0/0)
    const team1BowlerStats: BowlerStats[] = team1.players.filter(p => p.bowlingOrder).map((player) => ({
      name: player.name,
      overs: 0, // Keep for backward compatibility
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      isBowling: false, // Will be set based on toss
      oversStr: "0.0",
      completedOvers: 0
    }));

    const team2BowlerStats: BowlerStats[] = team2.players.filter(p => p.bowlingOrder).map((player) => ({
      name: player.name,
      overs: 0, // Keep for backward compatibility
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      isBowling: false, // Will be set based on toss
      oversStr: "0.0",
      completedOvers: 0
    }));

    // Determine batting and bowling teams based on toss
    let battingTeam: 'team1' | 'team2';
    let bowlingTeam: 'team1' | 'team2';
    
    if (tossInfo.wonBy === team1.name) {
      battingTeam = tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
      bowlingTeam = tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
    } else {
      battingTeam = tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
      bowlingTeam = tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
    }

    // Set initial batsmen (first two in batting order)
    const battingTeamPlayers = battingTeam === 'team1' ? team1.players : team2.players;
    if (battingTeamPlayers.length < 2) {
      throw new Error(`Team ${battingTeam} must have at least 2 players`);
    }
    
    const striker = battingTeamPlayers.find(p => p.battingOrder === 1)?.name || battingTeamPlayers[0]?.name;
    const nonStriker = battingTeamPlayers.find(p => p.battingOrder === 2)?.name || battingTeamPlayers[1]?.name;
    
    if (!striker || !nonStriker) {
      throw new Error(`Could not determine initial batsmen for team ${battingTeam}`);
    }

    // Set initial bowler (first in bowling order)
    const bowlingTeamPlayers = bowlingTeam === 'team1' ? team1.players : team2.players;
    if (bowlingTeamPlayers.length < 1) {
      throw new Error(`Team ${bowlingTeam} must have at least 1 player`);
    }
    
    const bowler = bowlingTeamPlayers.find(p => p.bowlingOrder === 1)?.name || 
                   bowlingTeamPlayers.find(p => p.bowlingOrder)?.name || 
                   bowlingTeamPlayers[0]?.name;
                   
    if (!bowler) {
      throw new Error(`Could not determine initial bowler for team ${bowlingTeam}`);
    }

    // Update batsman stats
    if (battingTeam === 'team1') {
      const strikerStat = team1BatsmanStats.find(s => s.name === striker);
      if (strikerStat) strikerStat.isOnStrike = true;
    } else {
      const strikerStat = team2BatsmanStats.find(s => s.name === striker);
      if (strikerStat) strikerStat.isOnStrike = true;
    }

    // Update bowler stats
    if (bowlingTeam === 'team1') {
      const bowlerStat = team1BowlerStats.find(s => s.name === bowler);
      if (bowlerStat) bowlerStat.isBowling = true;
    } else {
      const bowlerStat = team2BowlerStats.find(s => s.name === bowler);
      if (bowlerStat) bowlerStat.isBowling = true;
    }

    this.matchState = {
      team1: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, oversStr: "0.0", completedOvers: 0 },
      team2: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, oversStr: "0.0", completedOvers: 0 },
      currentBatsman: striker,
      currentBowler: bowler,
      requiredRunRate: undefined,
      isFreeHit: false,
      teams: { team1, team2 },
      currentInnings: battingTeam === 'team1' ? 1 : 2,
      target: undefined,
      tossInfo,
      batsmanStats: {
        team1: team1BatsmanStats,
        team2: team2BatsmanStats
      },
      bowlerStats: {
        team1: team1BowlerStats,
        team2: team2BowlerStats
      },
      strikerIndex: 0,
      nonStrikerIndex: 1,
      bowlerIndex: 0,
      lastUpdateTime: Date.now(),
      lastOver: [],
      currentOver: [],
      last18Balls: [],
      commentaryHistory: [],
      isMatchCompleted: false,
      legalBallsThisOver: 0,
      overStats: {
        team1: [],
        team2: []
      }
    };

    return this.matchState;
  }

  // Generate a cricket event (ball, wicket, etc.)
  generateCricketEvent(): CricketEvent {
    if (!this.matchState) {
      throw new Error('Match state not initialized');
    }

    const currentBattingTeam = this.matchState.currentInnings === 1 ? 'team1' : 'team2';
    const currentBowlingTeam = currentBattingTeam === 'team1' ? 'team2' : 'team1';
    
    const battingTeamData = this.matchState[currentBattingTeam];
    const bowlingTeamData = this.matchState[currentBowlingTeam];

    console.log('🎯 MatchSimulator: Generating cricket event', {
      innings: this.matchState.currentInnings,
      battingTeam: currentBattingTeam,
      overs: battingTeamData.overs, // Backward compatibility
      oversStr: battingTeamData.oversStr,
      completedOvers: battingTeamData.completedOvers,
      balls: battingTeamData.balls,
      runs: battingTeamData.runs,
      wickets: battingTeamData.wickets,
      timestamp: new Date().toISOString()
    });

    // Check if innings is complete (use balls instead of decimal overs)
    if (battingTeamData.balls >= MatchSimulator.BALLS_IN_INNINGS || battingTeamData.wickets >= 10) {
      console.log('🏁 MatchSimulator: Innings complete, handling completion');
      return this.handleInningsComplete();
    }

    // Generate event based on probabilities
    const eventType = this.determineEventType();
    console.log('🎲 MatchSimulator: Event type determined:', eventType);
    
    let event: CricketEvent;
    switch (eventType) {
      case 'wicket':
        event = this.generateWicketEvent();
        break;
      case 'wide':
        event = this.generateWideEvent();
        break;
      case 'noball':
        event = this.generateNoBallEvent();
        break;
      case 'bye':
        event = this.generateByeEvent();
        break;
      case 'legbye':
        event = this.generateLegByeEvent();
        break;
      case 'ball':
      default:
        event = this.generateBallEvent();
        break;
    }

    console.log('📊 MatchSimulator: Generated event:', {
      type: event.type,
      runs: event.runs,
      description: event.description,
      nextBallDelay: event.nextBallDelay,
      timestamp: new Date().toISOString()
    });

    return event;
  }

  // Process a cricket event and update match state
  processEvent(event: CricketEvent): void {
    if (!this.matchState) {
      throw new Error('Match state not initialized');
    }

    const currentBattingTeam = this.matchState.currentInnings === 1 ? 'team1' : 'team2';
    const currentBowlingTeam = currentBattingTeam === 'team1' ? 'team2' : 'team1';
    
    console.log('🔍 processEvent START:', {
      eventType: event.type,
      eventRuns: event.runs,
      battingTeam: currentBattingTeam,
      ballsBefore: this.matchState[currentBattingTeam].balls,
      oversBefore: this.matchState[currentBattingTeam].overs, // Backward compatibility
      oversStrBefore: this.matchState[currentBattingTeam].oversStr
    });
    
    const beforeState = { ...this.matchState[currentBattingTeam] };
    
    // Update match state based on event
    this.updateMatchState(event, currentBattingTeam, currentBowlingTeam);
    
    const afterState = this.matchState[currentBattingTeam];
    
    console.log('🔍 processEvent AFTER updateMatchState:', {
      eventType: event.type,
      ballsAfter: this.matchState[currentBattingTeam].balls,
      oversAfter: this.matchState[currentBattingTeam].overs, // Backward compatibility
      oversStrAfter: this.matchState[currentBattingTeam].oversStr
    });

    // Update ball details FIRST (before over completion check)
    this.updateBallDetails(event, {
      runs: event.runs,
      wickets: afterState.wickets - beforeState.wickets
    });

    // Update batsman stats
    this.updateBatsmanStats(event, currentBattingTeam);
    
    // Handle strike rotation based on runs scored
    this.handleStrikeRotation(event, currentBattingTeam);
    
    // Update bowler stats
    this.updateBowlerStats(event, currentBowlingTeam);

    // Check for over completion AFTER all stats are updated
    // Over is complete when we have 6 legal deliveries (ball, bye, leg-bye)
    if (this.matchState.legalBallsThisOver >= 6) {
      // Track last over details
      this.updateLastOver(event, currentBattingTeam);
      
      // Clear current over and reset legal balls counter
      this.matchState.currentOver = [];
      this.matchState.legalBallsThisOver = 0;
      
      // Change bowler after over
      this.changeBowler(currentBowlingTeam);
      
      // Strike rotation at end of over (only for legal deliveries)
      if ((event.type === 'ball' || event.type === 'bye' || event.type === 'legbye') && event.runs % 2 === 1) {
        this.switchStrike(currentBattingTeam);
      }
    }
    
    // Update commentary history
    this.updateCommentaryHistory(event);
    
    // Store the event for reuse
    this.matchState.lastEvent = event;

    // Check if innings is complete
    this.checkInningsCompletion(currentBattingTeam);
  }

  // Get current match state
  getMatchState(): LiveMatchState | null {
    return this.matchState;
  }

  // Reset match state
  resetMatchState(): void {
    this.matchState = null;
  }

  /**
   * Set seed for deterministic random number generation (useful for testing and debugging)
   * 
   * @param seed - The seed value to use for deterministic randomness
   * 
   * Example usage:
   * ```typescript
   * const simulator = new MatchSimulator();
   * simulator.setSeed(12345); // Same seed will produce same sequence of events
   * simulator.initializeMatchState(team1, team2, tossInfo);
   * // All subsequent random events will be deterministic
   * ```
   */
  setSeed(seed: number): void {
    this.seed = seed;
    this.randomState = seed;
  }

  /**
   * Clear seed to use Math.random() (default behavior for production)
   * 
   * Example usage:
   * ```typescript
   * simulator.clearSeed(); // Back to non-deterministic randomness
   * ```
   */
  clearSeed(): void {
    this.seed = null;
    this.randomState = 1;
  }

  /**
   * Generate a random number (seeded if seed is set, otherwise Math.random())
   * 
   * Uses Linear Congruential Generator (LCG) for deterministic randomness when seeded.
   * LCG formula: X(n+1) = (a * X(n) + c) mod m
   * Using constants from Numerical Recipes: a=1664525, c=1013904223, m=2^32
   */
  private random(): number {
    if (this.seed !== null) {
      // Linear Congruential Generator (LCG)
      // Using constants from Numerical Recipes
      this.randomState = (this.randomState * 1664525 + 1013904223) % 4294967296;
      return this.randomState / 4294967296;
    }
    return Math.random();
  }

  // Private helper methods
  private determineEventType(): string {
    const rand = this.random();
    if (rand < 0.05) return 'wicket'; // 5% chance of wicket
    if (rand < 0.12) return 'wide'; // 7% chance of wide
    if (rand < 0.15) return 'noball'; // 3% chance of no-ball
    if (rand < 0.17) return 'bye'; // 2% chance of bye
    if (rand < 0.19) return 'legbye'; // 2% chance of leg-bye
    return 'ball'; // 81% chance of regular ball
  }

  private generateWicketEvent(): CricketEvent {
    const wicketTypes = ['bowled', 'caught', 'lbw', 'runout', 'stumped'];
    const wicketType = wicketTypes[Math.floor(this.random() * wicketTypes.length)] as any;
    
    return {
      type: 'wicket',
      runs: 0,
      description: `Wicket! ${this.matchState?.currentBatsman} is ${wicketType}`,
      batsman: this.matchState?.currentBatsman,
      bowler: this.matchState?.currentBowler,
      wicketType,
      nextBallDelay: 30 // 30 seconds
    };
  }

  private generateWideEvent(): CricketEvent {
    const runs = this.random() < 0.1 ? 5 : 1; // 10% chance of 5 runs (wide + 4)
    
    return {
      type: 'wide',
      runs,
      description: `Wide ball! ${runs} run${runs > 1 ? 's' : ''} added`,
      bowler: this.matchState?.currentBowler,
      nextBallDelay: 30 // 30 seconds
    };
  }

  private generateNoBallEvent(): CricketEvent {
    const runs = this.random() < 0.2 ? 7 : 1; // 20% chance of 7 runs (no-ball + 6)
    
    return {
      type: 'noball',
      runs,
      description: `No ball! ${runs} run${runs > 1 ? 's' : ''} added`,
      bowler: this.matchState?.currentBowler,
      nextBallDelay: 30 // 30 seconds
    };
  }

  private generateByeEvent(): CricketEvent {
    const runs = this.generateRuns(); // Byes can be 0-6 runs
    
    return {
      type: 'bye',
      runs,
      description: `Bye${runs > 0 ? `! ${runs} run${runs > 1 ? 's' : ''} added` : ''}`,
      batsman: this.matchState?.currentBatsman,
      bowler: this.matchState?.currentBowler,
      nextBallDelay: 30 // 30 seconds
    };
  }

  private generateLegByeEvent(): CricketEvent {
    const runs = this.generateRuns(); // Leg-byes can be 0-6 runs
    
    return {
      type: 'legbye',
      runs,
      description: `Leg bye${runs > 0 ? `! ${runs} run${runs > 1 ? 's' : ''} added` : ''}`,
      batsman: this.matchState?.currentBatsman,
      bowler: this.matchState?.currentBowler,
      nextBallDelay: 30 // 30 seconds
    };
  }

  private generateBallEvent(): CricketEvent {
    if (!this.matchState) {
      throw new Error('Match state not initialized');
    }
    
    const runs = this.generateRuns();
    const description = this.generateBallDescription(runs);
    
    return {
      type: 'ball',
      runs,
      description,
      batsman: this.matchState.currentBatsman, // Ensure batsman is always present
      bowler: this.matchState.currentBowler,
      nextBallDelay: 30 // 30 seconds
    };
  }

  private generateRuns(): number {
    const rand = this.random();
    if (rand < 0.3) return 0; // 30% dot ball
    if (rand < 0.5) return 1; // 20% single
    if (rand < 0.7) return 2; // 20% double
    if (rand < 0.85) return 3; // 15% triple
    if (rand < 0.95) return 4; // 10% four
    return 6; // 5% six
  }

  private generateBallDescription(runs: number): string {
    const descriptions = {
      0: ['Dot ball', 'Defended', 'Blocked', 'No run'],
      1: ['Single', 'Quick single', 'Easy single'],
      2: ['Two runs', 'Good running', 'Couple of runs'],
      3: ['Three runs', 'Excellent running', 'Great effort'],
      4: ['Four!', 'Boundary!', 'Cracking shot!'],
      6: ['Six!', 'Maximum!', 'Huge hit!']
    };
    
    const options = descriptions[runs as keyof typeof descriptions] || ['Run'];
    return options[Math.floor(this.random() * options.length)];
  }

  private updateMatchState(event: CricketEvent, battingTeam: 'team1' | 'team2', bowlingTeam: 'team1' | 'team2'): void {
    console.log('🔍 updateMatchState CALLED:', event.type, battingTeam, 'at', new Date().toISOString());
    if (!this.matchState) return;

    const battingData = this.matchState[battingTeam];
    
    console.log('🔍 updateMatchState DEBUG:', {
      eventType: event.type,
      eventRuns: event.runs,
      battingTeam,
      ballsBefore: battingData.balls,
      oversBefore: battingData.overs, // Backward compatibility
      oversStrBefore: battingData.oversStr
    });
    
    // Update runs
    battingData.runs += event.runs;
    
    // Handle balls increment based on event type
    let shouldIncrementBalls = false;
    
    switch (event.type) {
      case 'ball':
        // Legal ball: increment balls
        shouldIncrementBalls = true;
        break;
      case 'bye':
      case 'legbye':
        // Byes and leg-byes: increment balls (they count as legal deliveries)
        shouldIncrementBalls = true;
        break;
      case 'wide':
      case 'noball':
        // Wides and no-balls: do NOT increment balls (they don't count as legal deliveries)
        shouldIncrementBalls = false;
        break;
      case 'wicket':
        // Wickets: increment balls only if it's a legal ball wicket
        // This will be handled separately in the wicket logic below
        shouldIncrementBalls = false;
        break;
    }
    
    if (shouldIncrementBalls) {
      const oldBalls = battingData.balls;
      console.log('🔍 BALLS INCREMENT DEBUG:', {
        event: event.type,
        runs: event.runs,
        ballsBefore: oldBalls,
        ballsAfter: oldBalls + 1,
        timestamp: new Date().toISOString()
      });
      battingData.balls += 1;
      
      // Increment legal balls in current over only for actual legal balls
      if (event.type === 'ball') {
        this.matchState.legalBallsThisOver += 1;
      }
      
      // Update overs fields (keep balls as source of truth)
      this.updateOversFields(battingData);
      
      console.log('🔍 OVERS CALCULATION DEBUG:', {
        event: event.type,
        runs: event.runs,
        oldBalls,
        newBalls: battingData.balls,
        legalBallsThisOver: this.matchState.legalBallsThisOver,
        oversStr: battingData.oversStr,
        oversDecimal: battingData.overs,
        calculation: `balls: ${battingData.balls}, legalBallsThisOver: ${this.matchState.legalBallsThisOver}, oversStr: "${battingData.oversStr}", overs: ${battingData.overs}`
      });
    }
    
    // Handle wickets
    if (event.type === 'wicket') {
      battingData.wickets += 1;
      // Note: Balls increment for wickets is handled above based on whether it's a legal ball wicket
    }
    
    // Handle extras
    if (event.type === 'wide' || event.type === 'noball' || event.type === 'bye' || event.type === 'legbye') {
      battingData.extras += event.runs;
    }
  }

  /**
   * Update overs fields using balls as the single source of truth
   * @param battingData - The batting team data to update
   */
  private updateOversFields(battingData: { balls: number; overs: number; oversStr: string; completedOvers: number }): void {
    const completedOvers = Math.floor(battingData.balls / 6);
    const currentOverBalls = battingData.balls % 6;
    
    // Update new fields
    battingData.completedOvers = completedOvers;
    battingData.oversStr = `${completedOvers}.${currentOverBalls}`;
    
    // Update old field for backward compatibility (decimal format)
    battingData.overs = completedOvers + (currentOverBalls / 10);
  }

  private updateBallDetails(event: CricketEvent, runsWickets: { runs: number; wickets: number }): void {
    if (!this.matchState) return;

    // Get current legal ball number
    const legalBallNumber = this.matchState.legalBallsThisOver;
    
    // Set ball number based on delivery type
    let ballNumber: number | string;
    if (event.type === 'ball' || event.type === 'bye' || event.type === 'legbye') {
      // Legal deliveries (ball, bye, leg-bye) get next ball number
      ballNumber = legalBallNumber + 1;
    } else {
      // Extras (wide, no-ball) get "ball+" notation
      ballNumber = `${legalBallNumber}+`;
    }

    const ballDetail: BallDetails = {
      ball: ballNumber,
      runs: runsWickets.runs,
      type: event.type,
      description: event.description
    };

    // Only push legal deliveries to currentOver (for over completion tracking)
    if (event.type === 'ball' || event.type === 'bye' || event.type === 'legbye') {
      this.matchState.currentOver.push(ballDetail);
    }
    
    // Always push to last18Balls for comprehensive display
    this.matchState.last18Balls.push(ballDetail);
    
    // Keep only last 18 balls
    if (this.matchState.last18Balls.length > 18) {
      this.matchState.last18Balls.shift();
    }
  }

  private updateBatsmanStats(event: CricketEvent, battingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;
    
    // For legal balls, batsman should always be present
    if ((event.type === 'ball' || event.type === 'bye' || event.type === 'legbye') && !event.batsman) {
      console.error('⚠️ Legal delivery event missing batsman:', event);
      return;
    }
    
    if (!event.batsman) return;

    const batsmanStats = this.matchState.batsmanStats[battingTeam];
    const batsman = batsmanStats.find(s => s.name === event.batsman);
    
    if (batsman && event.type === 'ball') {
      // Only regular balls count as balls faced by batsman
      batsman.runs += event.runs;
      batsman.balls += 1;
      batsman.strikeRate = batsman.balls > 0 ? Number(((batsman.runs / batsman.balls) * 100).toFixed(2)) : 0;
      
      if (event.runs === 4) batsman.fours += 1;
      if (event.runs === 6) batsman.sixes += 1;
    }
    
    // Note: Byes and leg-byes don't count as balls faced by batsman
    // They are recorded as extras and count towards team total but not individual stats
    
    if (batsman && event.type === 'wicket') {
      batsman.isOut = true;
      batsman.isOnStrike = false;
      
      // Set last wicket details
      const battingData = this.matchState[battingTeam];
      this.matchState.lastWicket = {
        batsman: event.batsman || '',
        bowler: event.bowler || '',
        wicketType: event.wicketType || 'bowled',
        description: event.description || '',
        runs: event.runs || 0,
        balls: batsman.balls,
        fallOfWicket: `${battingData.runs}/${battingData.wickets}`,
        over: battingData.oversStr
      };
      
      // Bring in new batsman
      this.bringInNewBatsman(battingTeam);
    }
  }

  private handleStrikeRotation(event: CricketEvent, battingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;

    // Rotate strike on odd runs for legal deliveries (ball, bye, leg-bye)
    if ((event.type === 'ball' || event.type === 'bye' || event.type === 'legbye') && event.runs % 2 === 1) {
      this.switchStrike(battingTeam);
    }
  }

  private switchStrike(battingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;

    const batsmanStats = this.matchState.batsmanStats[battingTeam];
    const availableBatsmen = batsmanStats.filter(b => !b.isOut);
    
    if (availableBatsmen.length >= 2) {
      // Find current striker and non-striker
      const striker = batsmanStats.find(b => b.isOnStrike);
      const nonStriker = batsmanStats.find(b => !b.isOnStrike && !b.isOut);
      
      if (striker && nonStriker) {
        striker.isOnStrike = false;
        nonStriker.isOnStrike = true;
        this.matchState.currentBatsman = nonStriker.name;
        
        // Update indices - swap striker and non-striker indices
        const tempIndex = this.matchState.strikerIndex;
        this.matchState.strikerIndex = this.matchState.nonStrikerIndex;
        this.matchState.nonStrikerIndex = tempIndex;
      }
    }
  }

  private bringInNewBatsman(battingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;

    const batsmanStats = this.matchState.batsmanStats[battingTeam];
    
    // Find the next batsman in batting order
    const nextIndex = Math.max(this.matchState.strikerIndex, this.matchState.nonStrikerIndex) + 1;
    
    // Check if there's a next batsman available
    if (nextIndex < batsmanStats.length) {
      const nextBatsman = batsmanStats[nextIndex];
      
      // Make sure the next batsman is not out
      if (!nextBatsman.isOut) {
        nextBatsman.isOnStrike = true;
        this.matchState.currentBatsman = nextBatsman.name;
        
        // Update indices - new batsman becomes striker, previous striker becomes non-striker
        this.matchState.nonStrikerIndex = this.matchState.strikerIndex;
        this.matchState.strikerIndex = nextIndex;
      }
    }
  }

  private updateBowlerStats(event: CricketEvent, bowlingTeam: 'team1' | 'team2'): void {
    if (!this.matchState || !event.bowler) return;

    const bowlerStats = this.matchState.bowlerStats[bowlingTeam];
    const bowler = bowlerStats.find(s => s.name === event.bowler);
    
    if (bowler) {
      bowler.runs += event.runs;
      
      // Handle balls increment for bowler based on event type
      let shouldIncrementBowlerBalls = false;
      
      switch (event.type) {
        case 'ball':
          // Legal ball: increment bowler balls
          shouldIncrementBowlerBalls = true;
          break;
        case 'bye':
        case 'legbye':
          // Byes and leg-byes: increment bowler balls (they count as legal deliveries)
          shouldIncrementBowlerBalls = true;
          break;
        case 'wide':
        case 'noball':
          // Wides and no-balls: do NOT increment bowler balls (they don't count as legal deliveries)
          shouldIncrementBowlerBalls = false;
          break;
        case 'wicket':
          // Wickets: increment bowler balls only if it's a legal ball wicket
          // This will be handled separately in the wicket logic below
          shouldIncrementBowlerBalls = false;
          break;
      }
      
      if (shouldIncrementBowlerBalls) {
        bowler.balls += 1;
        // Update overs fields using the same logic as batting team
        this.updateBowlerOversFields(bowler);
      }
      
      // Handle wickets
      if (event.type === 'wicket' && event.wicketType !== 'runout') {
        bowler.wickets += 1;
      }
      
      // Calculate economy
      const totalBalls = bowler.balls; // Use actual balls bowled
      bowler.economy = totalBalls > 0 ? (bowler.runs / totalBalls) * 6 : 0;
    }
  }

  /**
   * Update bowler overs fields using balls as the single source of truth
   * @param bowler - The bowler stats to update
   */
  private updateBowlerOversFields(bowler: { balls: number; overs: number; oversStr: string; completedOvers: number }): void {
    const completedOvers = Math.floor(bowler.balls / 6);
    const currentOverBalls = bowler.balls % 6;
    
    // Update new fields
    bowler.completedOvers = completedOvers;
    bowler.oversStr = `${completedOvers}.${currentOverBalls}`;
    
    // Update old field for backward compatibility (decimal format)
    bowler.overs = completedOvers + (currentOverBalls / 10);
  }

  private updateCommentaryHistory(event: CricketEvent): void {
    if (!this.matchState) return;

    this.matchState.commentaryHistory.push(event);
    
    // Keep only last 18 events (approximately 3 overs including extras)
    if (this.matchState.commentaryHistory.length > 18) {
      this.matchState.commentaryHistory.shift();
    }
  }

  private updateLastOver(event: CricketEvent, battingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;

    // Move current over to last over (called only when over is complete)
    this.matchState.lastOver = [...this.matchState.currentOver];
    
    // Calculate over stats from the completed over
    const overNumber = this.matchState.overStats[battingTeam].length + 1;
    const overRuns = this.matchState.currentOver.reduce((total, ball) => total + ball.runs, 0);
    const overWickets = this.matchState.currentOver.filter(ball => ball.type === 'wicket').length;
    const overBalls = this.matchState.currentOver.length; // Should be 6 for completed over
    const overExtras = this.matchState.currentOver.filter(ball => 
      ball.type === 'wide' || ball.type === 'noball' || ball.type === 'bye' || ball.type === 'legbye'
    ).reduce((total, ball) => total + ball.runs, 0);
    
    // Add over stats
    this.matchState.overStats[battingTeam].push({
      over: overNumber,
      runs: overRuns,
      wickets: overWickets,
      balls: overBalls,
      extras: overExtras
    });
  }

  private changeBowler(bowlingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;

    const bowlerStats = this.matchState.bowlerStats[bowlingTeam];
    const currentBowler = bowlerStats.find(b => b.isBowling);
    
    if (currentBowler) {
      currentBowler.isBowling = false;
      // Do NOT reset cumulative balls - keep total balls bowled
      // Do NOT reset overs fields - keep cumulative overs bowled
    }
    
    // Find next bowler (use balls count for more accurate check)
    const nextBowler = bowlerStats.find(b => !b.isBowling && b.balls < MatchSimulator.MAX_BALLS_PER_BOWLER);
    if (nextBowler) {
      nextBowler.isBowling = true;
      this.matchState.currentBowler = nextBowler.name;
    }
  }

  private checkInningsCompletion(battingTeam: 'team1' | 'team2'): void {
    if (!this.matchState) return;

    const battingData = this.matchState[battingTeam];
    
    if (battingData.balls >= MatchSimulator.BALLS_IN_INNINGS || battingData.wickets >= 10) {
      this.handleInningsComplete();
    }
  }

  private handleInningsComplete(): CricketEvent {
    if (!this.matchState) {
      throw new Error('Match state not initialized');
    }

    if (this.matchState.currentInnings === 1) {
      // First innings complete, start second innings
      this.matchState.currentInnings = 2;
      this.matchState.target = this.matchState.team1.runs + 1;
      
      // Store first innings data
      this.matchState.team1Finished = { ...this.matchState.team1 };
      
      // Reset team2 (chasing team) to zero for second innings
      this.matchState.team2 = { 
        runs: 0, 
        wickets: 0, 
        overs: 0, 
        balls: 0, 
        extras: 0, 
        oversStr: "0.0", 
        completedOvers: 0 
      };
      
      // Reset legal balls counter for new innings
      this.matchState.legalBallsThisOver = 0;
      
      // Reset batting indices for new innings
      this.matchState.strikerIndex = 0;
      this.matchState.nonStrikerIndex = 1;
      
      // Reset over tracking arrays
      this.matchState.currentOver = [];
      this.matchState.lastOver = [];
      this.matchState.last18Balls = [];
      this.matchState.commentaryHistory = [];
      
      // Reset over stats for new innings
      this.matchState.overStats.team2 = [];
      
      // Reset batsman stats for team2 (chasing team) - second innings
      this.matchState.batsmanStats.team2.forEach(b => {
        b.runs = 0;
        b.balls = 0;
        b.fours = 0;
        b.sixes = 0;
        b.strikeRate = 0;
        b.isOut = false;
        b.isOnStrike = false;
      });
      
      // DO NOT reset bowler stats for team1 (bowling team) - keep cumulative stats
      // Team1 bowlers should retain their balls, runs, wickets, economy from first innings
      // Only reset the isBowling flag for all bowlers
      this.matchState.bowlerStats.team1.forEach(b => {
        b.isBowling = false; // Only reset bowling status, keep all other stats
      });
      
      // Set new batsmen and bowler for second innings
      // team2 is now batting (chasing), team1 is now bowling
      const team2Players = this.matchState.teams.team2.players;
      if (team2Players.length < 1) {
        throw new Error('Team 2 must have at least 1 player');
      }
      
      const striker = team2Players.find(p => p.battingOrder === 1)?.name || team2Players[0]?.name;
      if (!striker) {
        throw new Error('Could not determine striker for team 2');
      }
      
      const team1Players = this.matchState.teams.team1.players;
      if (team1Players.length < 1) {
        throw new Error('Team 1 must have at least 1 player');
      }
      
      const bowler = team1Players.find(p => p.bowlingOrder === 1)?.name || team1Players[0]?.name;
      if (!bowler) {
        throw new Error('Could not determine bowler for team 1');
      }
      
      this.matchState.currentBatsman = striker;
      this.matchState.currentBowler = bowler;
      
      // Update stats
      const strikerStat = this.matchState.batsmanStats.team2.find(s => s.name === striker);
      if (strikerStat) strikerStat.isOnStrike = true;
      
      const bowlerStat = this.matchState.bowlerStats.team1.find(s => s.name === bowler);
      if (bowlerStat) bowlerStat.isBowling = true;
      
      return {
        type: 'ball',
        runs: 0,
        description: `Innings break! ${this.matchState.teams.team1.name} scored ${this.matchState.team1Finished?.runs} runs. ${this.matchState.teams.team2.name} needs ${this.matchState.target} runs to win.`,
        nextBallDelay: 30
      };
    } else {
      // Match complete
      this.matchState.isMatchCompleted = true;
      
      const team1Runs = this.matchState.team1Finished?.runs || 0;
      const team2Runs = this.matchState.team2.runs;
      
      let description: string;
      if (team1Runs > team2Runs) {
        description = `Match complete! ${this.matchState.teams.team1.name} wins by ${team1Runs - team2Runs} runs!`;
      } else if (team2Runs > team1Runs) {
        description = `Match complete! ${this.matchState.teams.team2.name} wins by ${team2Runs - team1Runs} runs!`;
      } else {
        description = `Match tied! Both teams scored ${team1Runs} runs!`;
      }
      
      return {
        type: 'ball',
        runs: 0,
        description,
        nextBallDelay: 0
      };
    }
  }
}
