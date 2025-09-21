import { MatchData, PointsTableData, ScheduleData, BatsmanStats, BowlerStats, TossInfo, BallDetails, WicketDetails } from '@/types';

interface CricketEvent {
  type: 'ball' | 'wide' | 'noball' | 'wicket' | 'freehit' | 'bye' | 'legbye';
  runs: number;
  description: string;
  batsman?: string;
  bowler?: string;
  fielder?: string;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
  nextBallDelay?: number; // Time until next ball in seconds
}

interface Player {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  skill: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  battingOrder?: number;
  bowlingOrder?: number;
}

interface Team {
  name: string;
  players: Player[];
  captain: string;
  wicketKeeper: string;
}

interface LiveMatchState {
  team1: {
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    extras: number; // Wide, no-ball, byes, leg-byes
  };
  team2: {
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
    extras: number; // Wide, no-ball, byes, leg-byes
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
  currentInnings: 1 | 2; // 1 = MI batting, 2 = CSK batting
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
  commentaryHistory: CricketEvent[]; // Last 3 overs of commentary events
  isMatchCompleted: boolean; // Whether the match is completed
}

// Dynamic data generator that simulates live updates
export class DynamicDataGenerator {
  private static instance: DynamicDataGenerator;
  private liveMatchData: MatchData | null = null;
  private matchState: LiveMatchState | null = null;

  static getInstance(): DynamicDataGenerator {
    if (!DynamicDataGenerator.instance) {
      DynamicDataGenerator.instance = new DynamicDataGenerator();
    }
    return DynamicDataGenerator.instance;
  }

  // Initialize match state
  private initializeMatchState(): LiveMatchState {
    const miPlayers: Player[] = [
      { name: 'Rohit Sharma', role: 'Batsman' as const, skill: 'Right-handed opener, excellent pull shot', isCaptain: false, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Ishan Kishan', role: 'Wicket-keeper' as const, skill: 'Left-handed aggressive batsman, good keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 2 },
      { name: 'Suryakumar Yadav', role: 'Batsman' as const, skill: 'Right-handed middle order, 360° player', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Tilak Varma', role: 'Batsman' as const, skill: 'Left-handed young talent, good finisher', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Hardik Pandya', role: 'All-rounder' as const, skill: 'Right-handed power hitter, medium pace bowler', isCaptain: true, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 1 },
      { name: 'Tim David', role: 'Batsman' as const, skill: 'Right-handed finisher, explosive hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 6 },
      { name: 'Romario Shepherd', role: 'All-rounder' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 2 },
      { name: 'Piyush Chawla', role: 'Bowler' as const, skill: 'Right-arm leg spinner, experienced', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Jasprit Bumrah', role: 'Bowler' as const, skill: 'Right-arm fast, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Gerald Coetzee', role: 'Bowler' as const, skill: 'Right-arm fast, aggressive pace', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Akash Madhwal', role: 'Bowler' as const, skill: 'Right-arm medium, good variations', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 }
    ];

    const cskPlayers: Player[] = [
      { name: 'Ruturaj Gaikwad', role: 'Batsman' as const, skill: 'Right-handed opener, elegant stroke player', isCaptain: true, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Rachin Ravindra', role: 'All-rounder' as const, skill: 'Left-handed opener, left-arm spin', isCaptain: false, isWicketKeeper: false, battingOrder: 2, bowlingOrder: 1 },
      { name: 'Ajinkya Rahane', role: 'Batsman' as const, skill: 'Right-handed middle order, classical batsman', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Daryl Mitchell', role: 'Batsman' as const, skill: 'Right-handed middle order, experienced', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Shivam Dube', role: 'All-rounder' as const, skill: 'Left-handed power hitter, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 2 },
      { name: 'Ravindra Jadeja', role: 'All-rounder' as const, skill: 'Left-handed finisher, left-arm spin', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 3 },
      { name: 'MS Dhoni', role: 'Wicket-keeper' as const, skill: 'Right-handed finisher, legendary keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 7 },
      { name: 'Shardul Thakur', role: 'Bowler' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 8, bowlingOrder: 4 },
      { name: 'Deepak Chahar', role: 'Bowler' as const, skill: 'Right-arm medium, swing bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Tushar Deshpande', role: 'Bowler' as const, skill: 'Right-arm medium, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Maheesh Theekshana', role: 'Bowler' as const, skill: 'Right-arm off spin, mystery spinner', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 }
    ];

    // Initialize batsman stats (all start at 0/0)
    const miBatsmanStats: BatsmanStats[] = miPlayers.map((player, index) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: player.battingOrder === 1 // Batting order 1 on strike
    }));

    const cskBatsmanStats: BatsmanStats[] = cskPlayers.map((player, index) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: false // CSK not batting yet
    }));

    // Initialize bowler stats (all start at 0/0)
    const miBowlerStats: BowlerStats[] = miPlayers.filter(p => p.bowlingOrder).map((player, index) => ({
      name: player.name,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      isBowling: false // MI not bowling yet
    }));

    const cskBowlerStats: BowlerStats[] = cskPlayers.filter(p => p.bowlingOrder).map((player, index) => ({
      name: player.name,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      isBowling: index === 0 // First bowler bowling
    }));

    // Generate toss info first
    const tossInfo = this.generateTossInfo();
    
    // Determine batting and bowling teams based on toss
    let battingTeam: 'team1' | 'team2';
    let bowlingTeam: 'team1' | 'team2';
    
    if (tossInfo.wonBy === 'Mumbai Indians') {
      if (tossInfo.choseTo === 'bat') {
        battingTeam = 'team1'; // MI bats first
        bowlingTeam = 'team2'; // CSK bowls first
      } else {
        battingTeam = 'team2'; // CSK bats first
        bowlingTeam = 'team1'; // MI bowls first
      }
    } else { // CSK won the toss
      if (tossInfo.choseTo === 'bat') {
        battingTeam = 'team2'; // CSK bats first
        bowlingTeam = 'team1'; // MI bowls first
      } else {
        battingTeam = 'team1'; // MI bats first
        bowlingTeam = 'team2'; // CSK bowls first
      }
    }
    
    // Get current batsman and bowler based on toss
    const battingTeamPlayers = battingTeam === 'team1' ? miPlayers : cskPlayers;
    const bowlingTeamPlayers = bowlingTeam === 'team1' ? miPlayers : cskPlayers;
    
    const currentBatsman = battingTeamPlayers.find(p => p.battingOrder === 1)?.name || 'Unknown';
    const currentBowler = bowlingTeamPlayers.find(p => p.bowlingOrder === 1)?.name || 'Unknown';
    
    
    
    // Update batsman stats based on toss
    if (battingTeam === 'team1') {
      // MI is batting first
      miBatsmanStats.forEach((batsman, index) => {
        batsman.isOnStrike = batsman.name === currentBatsman;
      });
      cskBatsmanStats.forEach(batsman => {
        batsman.isOnStrike = false;
      });
    } else {
      // CSK is batting first
      cskBatsmanStats.forEach((batsman, index) => {
        batsman.isOnStrike = batsman.name === currentBatsman;
      });
      miBatsmanStats.forEach(batsman => {
        batsman.isOnStrike = false;
      });
    }
    
    // Update bowler stats based on toss
    if (bowlingTeam === 'team1') {
      // MI is bowling first
      miBowlerStats.forEach((bowler, index) => {
        bowler.isBowling = bowler.name === currentBowler;
      });
      cskBowlerStats.forEach(bowler => {
        bowler.isBowling = false;
      });
    } else {
      // CSK is bowling first
      cskBowlerStats.forEach((bowler, index) => {
        bowler.isBowling = bowler.name === currentBowler;
      });
      miBowlerStats.forEach(bowler => {
        bowler.isBowling = false;
      });
    }

    return {
      team1: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0 },
      team2: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0 },
      currentBatsman: currentBatsman,
      currentBowler: currentBowler,
      requiredRunRate: 0,
      isFreeHit: false,
      currentInnings: 1, // Always start with innings 1
      target: undefined,
      tossInfo: tossInfo,
      teams: {
        team1: {
          name: 'Mumbai Indians',
          captain: 'Hardik Pandya',
          wicketKeeper: 'Ishan Kishan',
          players: miPlayers
        },
        team2: {
          name: 'Chennai Super Kings',
          captain: 'Ruturaj Gaikwad',
          wicketKeeper: 'MS Dhoni',
          players: cskPlayers
        }
      },
      batsmanStats: {
        team1: miBatsmanStats,
        team2: cskBatsmanStats
      },
      bowlerStats: {
        team1: miBowlerStats,
        team2: cskBowlerStats
      },
      strikerIndex: battingTeam === 'team1' ? 0 : 0, // First batsman of batting team
      nonStrikerIndex: battingTeam === 'team1' ? 1 : 1, // Second batsman of batting team
      bowlerIndex: bowlingTeam === 'team1' ? 0 : 0, // First bowler of bowling team
      lastUpdateTime: Date.now(),
      lastOver: [], // Initialize empty last over
      currentOver: [], // Initialize empty current over
      lastWicket: undefined, // No wicket yet
      last18Balls: [], // Initialize empty last 18 balls
      commentaryHistory: [], // Initialize empty commentary history
      lastEvent: {
        type: 'ball',
        runs: 0,
        description: '# Match started - first ball to be bowled #',
        batsman: 'Rohit Sharma',
        bowler: 'Deepak Chahar',
        nextBallDelay: 30
      },
      isMatchCompleted: false
    };
  }

  // Generate random toss information
  private generateTossInfo(): TossInfo {
    const teams = ['Mumbai Indians', 'Chennai Super Kings'];
    const wonBy = teams[Math.floor(Math.random() * teams.length)];
    const choseTo = Math.random() < 0.5 ? 'bat' : 'field';
    
    return {
      wonBy,
      choseTo,
      description: `${wonBy} won the toss and chose to ${choseTo} ${choseTo === 'bat' ? 'first' : 'first'}`
    };
  }

  // Initialize match state with specific team batting first
  private initializeMatchStateWithTeamSelection(batFirst: 'MI' | 'CSK'): LiveMatchState {
    const miPlayers: Player[] = [
      { name: 'Rohit Sharma', role: 'Batsman' as const, skill: 'Right-handed opener, excellent pull shot', isCaptain: false, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Ishan Kishan', role: 'Wicket-keeper' as const, skill: 'Left-handed aggressive batsman, good keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 2 },
      { name: 'Suryakumar Yadav', role: 'Batsman' as const, skill: 'Right-handed middle order, 360° player', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Tilak Varma', role: 'Batsman' as const, skill: 'Left-handed young talent, good finisher', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Hardik Pandya', role: 'All-rounder' as const, skill: 'Right-handed power hitter, medium pace bowler', isCaptain: true, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 1 },
      { name: 'Tim David', role: 'Batsman' as const, skill: 'Right-handed finisher, explosive hitter', isCaptain: false, isWicketKeeper: false, battingOrder: 6 },
      { name: 'Romario Shepherd', role: 'All-rounder' as const, skill: 'Right-handed lower order, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 7, bowlingOrder: 2 },
      { name: 'Piyush Chawla', role: 'Bowler' as const, skill: 'Right-arm leg spinner, experienced', isCaptain: false, isWicketKeeper: false, bowlingOrder: 3 },
      { name: 'Jasprit Bumrah', role: 'Bowler' as const, skill: 'Right-arm fast, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Gerald Coetzee', role: 'Bowler' as const, skill: 'Right-arm fast, aggressive pace', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Mohammad Nabi', role: 'All-rounder' as const, skill: 'Right-handed batsman, off-spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 8, bowlingOrder: 6 }
    ];

    const cskPlayers: Player[] = [
      { name: 'Ruturaj Gaikwad', role: 'Batsman' as const, skill: 'Right-handed opener, elegant stroke player', isCaptain: true, isWicketKeeper: false, battingOrder: 1 },
      { name: 'Rachin Ravindra', role: 'All-rounder' as const, skill: 'Left-handed opener, left-arm spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 2, bowlingOrder: 1 },
      { name: 'Ajinkya Rahane', role: 'Batsman' as const, skill: 'Right-handed middle order, experienced', isCaptain: false, isWicketKeeper: false, battingOrder: 3 },
      { name: 'Daryl Mitchell', role: 'Batsman' as const, skill: 'Right-handed middle order, experienced', isCaptain: false, isWicketKeeper: false, battingOrder: 4 },
      { name: 'Shivam Dube', role: 'All-rounder' as const, skill: 'Left-handed power hitter, medium pace', isCaptain: false, isWicketKeeper: false, battingOrder: 5, bowlingOrder: 2 },
      { name: 'Ravindra Jadeja', role: 'All-rounder' as const, skill: 'Left-handed finisher, left-arm spinner', isCaptain: false, isWicketKeeper: false, battingOrder: 6, bowlingOrder: 3 },
      { name: 'MS Dhoni', role: 'Wicket-keeper' as const, skill: 'Right-handed finisher, legendary keeper', isCaptain: false, isWicketKeeper: true, battingOrder: 7 },
      { name: 'Deepak Chahar', role: 'Bowler' as const, skill: 'Right-arm medium fast, swing bowler', isCaptain: false, isWicketKeeper: false, bowlingOrder: 4 },
      { name: 'Tushar Deshpande', role: 'Bowler' as const, skill: 'Right-arm medium fast, death over specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 5 },
      { name: 'Mustafizur Rahman', role: 'Bowler' as const, skill: 'Left-arm fast, cutter specialist', isCaptain: false, isWicketKeeper: false, bowlingOrder: 6 },
      { name: 'Matheesha Pathirana', role: 'Bowler' as const, skill: 'Right-arm fast, sling action', isCaptain: false, isWicketKeeper: false, bowlingOrder: 7 }
    ];
    
    // Create toss info based on team selection
    const tossInfo: TossInfo = {
      wonBy: batFirst === 'MI' ? 'Mumbai Indians' : 'Chennai Super Kings',
      choseTo: 'bat',
      description: `${batFirst === 'MI' ? 'Mumbai Indians' : 'Chennai Super Kings'} won the toss and chose to bat first`
    };
    
    // Determine batting and bowling teams based on selection
    const battingTeam = batFirst === 'MI' ? 'team1' : 'team2';
    const bowlingTeam = batFirst === 'MI' ? 'team2' : 'team1';
    
    // Get batting and bowling team players
    const battingTeamPlayers = battingTeam === 'team1' ? miPlayers : cskPlayers;
    const bowlingTeamPlayers = bowlingTeam === 'team1' ? miPlayers : cskPlayers;
    
    // Get current batsman and bowler based on selection
    const currentBatsman = battingTeamPlayers.find((p: Player) => p.battingOrder === 1)?.name || 'Unknown';
    const currentBowler = bowlingTeamPlayers.find((p: Player) => p.bowlingOrder === 1)?.name || 'Unknown';

    const miBatsmanStats: BatsmanStats[] = miPlayers.map((player: Player, index: number) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: battingTeam === 'team1' && player.name === currentBatsman
    }));

    const cskBatsmanStats: BatsmanStats[] = cskPlayers.map((player: Player, index: number) => ({
      name: player.name,
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
      isOnStrike: battingTeam === 'team2' && player.name === currentBatsman
    }));

    const miBowlerStats: BowlerStats[] = miPlayers.filter((p: Player) => p.bowlingOrder).map((player: Player, index: number) => ({
      name: player.name,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      isBowling: bowlingTeam === 'team1' && player.name === currentBowler
    }));

    const cskBowlerStats: BowlerStats[] = cskPlayers.filter((p: Player) => p.bowlingOrder).map((player: Player, index: number) => ({
      name: player.name,
      overs: 0,
      balls: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      isBowling: bowlingTeam === 'team2' && player.name === currentBowler
    }));

    return {
      team1: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0 },
      team2: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0 },
      currentBatsman: currentBatsman,
      currentBowler: currentBowler,
      requiredRunRate: 0,
      isFreeHit: false,
      currentInnings: 1,
      target: undefined,
      tossInfo: tossInfo,
      teams: {
        team1: {
          name: 'Mumbai Indians',
          captain: 'Hardik Pandya',
          wicketKeeper: 'Ishan Kishan',
          players: miPlayers
        },
        team2: {
          name: 'Chennai Super Kings',
          captain: 'Ruturaj Gaikwad',
          wicketKeeper: 'MS Dhoni',
          players: cskPlayers
        }
      },
      batsmanStats: {
        team1: miBatsmanStats,
        team2: cskBatsmanStats
      },
      bowlerStats: {
        team1: miBowlerStats,
        team2: cskBowlerStats
      },
      strikerIndex: battingTeam === 'team1' ? 0 : 0,
      nonStrikerIndex: battingTeam === 'team1' ? 1 : 1,
      bowlerIndex: bowlingTeam === 'team1' ? 0 : 0,
      lastUpdateTime: Date.now(),
      lastOver: [],
      currentOver: [],
      lastWicket: undefined,
      last18Balls: [],
      commentaryHistory: [],
      isMatchCompleted: false,
      lastEvent: {
        type: 'ball',
        runs: 0,
        description: '# Match started - first ball to be bowled #',
        batsman: currentBatsman,
        bowler: currentBowler,
        nextBallDelay: 30
      }
    };
  }

  // Generate cricket event
  private generateCricketEvent(): CricketEvent {
    // Use actual current batsman and bowler from match state
    const currentBatsman = this.matchState!.currentBatsman;
    const currentBowler = this.matchState!.currentBowler;
    
    // Get fielders from the bowling team
    const currentBowlingTeam = this.matchState!.currentInnings === 1 ? 'team2' : 'team1';
    const fielders = this.matchState!.teams[currentBowlingTeam].players.map(p => p.name);
    const fielder = fielders[Math.floor(Math.random() * fielders.length)];

    // Event probabilities
    const eventType = Math.random();
    
    if (eventType < 0.05) { // 5% chance of wicket (realistic T20 probability)
      const wicketTypes = ['bowled', 'caught', 'lbw', 'runout', 'stumped'];
      const wicketType = wicketTypes[Math.floor(Math.random() * wicketTypes.length)];
      
      console.log(`🎯 WICKET CHANCE: eventType=${eventType.toFixed(3)}, threshold=0.05, generating ${wicketType} wicket`);
      
      let description = '';
      switch (wicketType) {
        case 'bowled':
          description = `# ${currentBatsman} bowled by ${currentBowler}! #`;
          break;
        case 'caught':
          description = `# ${currentBatsman} caught by ${fielder} off ${currentBowler}! #`;
          break;
        case 'lbw':
          description = `# ${currentBatsman} LBW off ${currentBowler}! #`;
          break;
        case 'runout':
          description = `# ${currentBatsman} run out by ${fielder}! #`;
          break;
        case 'stumped':
          description = `# ${currentBatsman} stumped by MS Dhoni off ${currentBowler}! #`;
          break;
      }
      
      return {
        type: 'wicket',
        runs: 0,
        description,
        batsman: currentBatsman,
        bowler: currentBowler,
        fielder: wicketType === 'caught' || wicketType === 'runout' ? fielder : undefined,
        wicketType: wicketType as any,
        nextBallDelay: 25 // Wicket takes time to celebrate and new batsman to come
      };
    } else if (eventType < 0.08) { // 3% chance of wide
      const wideRuns = Math.random() < 0.1 ? 2 : 1; // 10% chance of 2 runs (byes)
      return {
        type: 'wide',
        runs: wideRuns,
        description: `# Wide ball by ${currentBowler}! ${wideRuns} run${wideRuns > 1 ? 's' : ''} added. #`,
        nextBallDelay: 22 // Wide ball needs time to reset
      };
    } else if (eventType < 0.10) { // 2% chance of no ball
      const noballRuns = Math.random() < 0.3 ? Math.floor(Math.random() * 4) + 1 : 1;
      return {
        type: 'noball',
        runs: noballRuns,
        description: `# No ball by ${currentBowler}! ${noballRuns} run${noballRuns > 1 ? 's' : ''} added. Next ball is a free hit! #`,
        nextBallDelay: 24 // No ball needs time to reset and prepare for free hit
      };
    } else if (eventType < 0.12) { // 2% chance of bye
      const byeRuns = Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 3) + 1; // 70% chance of 1, 30% chance of 2-4
      return {
        type: 'bye',
        runs: byeRuns,
        description: `# ${byeRuns} bye${byeRuns > 1 ? 's' : ''} by ${currentBatsman} off ${currentBowler} #`,
        nextBallDelay: 23
      };
    } else if (eventType < 0.14) { // 2% chance of leg bye
      const legByeRuns = Math.random() < 0.7 ? 1 : Math.floor(Math.random() * 3) + 1; // 70% chance of 1, 30% chance of 2-4
      return {
        type: 'legbye',
        runs: legByeRuns,
        description: `# ${legByeRuns} leg bye${legByeRuns > 1 ? 's' : ''} by ${currentBatsman} off ${currentBowler} #`,
        nextBallDelay: 23
      };
    } else { // 90% chance of regular ball
      const runDistribution = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 10 dots (most common)
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 10 singles (very common)
        2, 2, 2, 2, 2, 2, 2, 2, // 8 doubles (common)
        3, 3, // 2 triples (rare)
        4, 4, 4, 4, 4, 4, // 6 boundaries (moderate)
        5, // 1 five (very rare)
        6, 6, 6 // 3 sixes (moderate)
      ];
      const runs = runDistribution[Math.floor(Math.random() * runDistribution.length)];
      
      let description = '';
      switch (runs) {
        case 0:
          description = `# Dot ball by ${currentBowler} #`;
          break;
        case 1:
          description = `# Single by ${currentBatsman} off ${currentBowler} #`;
          break;
        case 2:
          description = `# Two runs by ${currentBatsman} off ${currentBowler} #`;
          break;
        case 3:
          description = `# Three runs by ${currentBatsman} off ${currentBowler} #`;
          break;
        case 4:
          description = `# FOUR! ${currentBatsman} hits a boundary off ${currentBowler} #`;
          break;
        case 5:
          description = `# FIVE! ${currentBatsman} hits a boundary and gets an extra run off ${currentBowler} #`;
          break;
        case 6:
          description = `# SIX! ${currentBatsman} hits a maximum off ${currentBowler} #`;
          break;
      }
      
      // Dynamic timing based on runs scored
      let nextBallDelay: number;
      switch (runs) {
        case 0: // Dot ball
          nextBallDelay = 20;
          break;
        case 1: // Single
          nextBallDelay = 22;
          break;
        case 2: // Double
          nextBallDelay = 24;
          break;
        case 3: // Triple
          nextBallDelay = 26;
          break;
        case 4: // Four
          nextBallDelay = 28;
          break;
        case 5: // Five (rare)
          nextBallDelay = 30;
          break;
        case 6: // Six
          nextBallDelay = 30;
          break;
        default:
          nextBallDelay = 20;
      }

      return {
        type: 'ball',
        runs,
        description,
        batsman: currentBatsman,
        bowler: currentBowler,
        nextBallDelay
      };
    }
  }

  // Update batsman statistics
  private updateBatsmanStats(event: CricketEvent, battingTeam: 'team1' | 'team2'): void {
    const batsmanStats = this.matchState!.batsmanStats[battingTeam];
    const strikerIndex = this.matchState!.strikerIndex;
    
    if (event.type === 'ball' && event.batsman) {
      // Only regular balls count towards batsman stats (not extras)
      const batsman = batsmanStats.find(b => b.name === event.batsman);
      if (batsman) {
        batsman.runs += event.runs;
        batsman.balls += 1;
        
        // Update fours and sixes
        if (event.runs === 4) batsman.fours += 1;
        if (event.runs === 6) batsman.sixes += 1;
        
        // Calculate strike rate
        const oldStrikeRate = batsman.strikeRate;
        batsman.strikeRate = batsman.balls > 0 ? Number(((batsman.runs / batsman.balls) * 100).toFixed(1)) : 0;
        
        console.log(`🏏 Batsman stats updated:`, {
          batsman: batsman.name,
          runs: batsman.runs,
          balls: batsman.balls,
          strikeRate: batsman.strikeRate,
          oldStrikeRate: oldStrikeRate,
          fours: batsman.fours,
          sixes: batsman.sixes,
          isOnStrike: batsman.isOnStrike
        });
      }
    } else if (event.type === 'wicket' && event.batsman) {
      const batsman = batsmanStats.find(b => b.name === event.batsman);
      if (batsman) {
        batsman.isOut = true;
        batsman.isOnStrike = false;
        
        // Find next batsman in batting order
        const currentBattingTeam = this.matchState!.currentInnings === 1 ? 'team1' : 'team2';
        const teamPlayers = this.matchState!.teams[currentBattingTeam].players;
        
        // Get the batting order of the out batsman
        const outBatsmanOrder = teamPlayers.find(p => p.name === event.batsman)?.battingOrder || 0;
        
        // Find next batsman in batting order who is not out
        const nextBatsman = teamPlayers
          .filter(p => p.battingOrder && p.battingOrder > outBatsmanOrder)
          .sort((a, b) => (a.battingOrder || 0) - (b.battingOrder || 0))
          .find(p => {
            const batsmanStat = batsmanStats.find(b => b.name === p.name);
            return batsmanStat && !batsmanStat.isOut;
          });
        
        if (nextBatsman) {
          const nextBatsmanStat = batsmanStats.find(b => b.name === nextBatsman.name);
          if (nextBatsmanStat) {
            nextBatsmanStat.isOnStrike = true;
            this.matchState!.currentBatsman = nextBatsman.name;
            console.log(`# 🏏 Wicket! ${event.batsman} out, ${nextBatsman.name} comes in (batting order ${nextBatsman.battingOrder})`);
          }
        }
        
        // Track last wicket details
        const battingTeamForWicket = this.matchState!.currentInnings === 1 ? 'team1' : 'team2';
        const teamState = this.matchState![battingTeamForWicket];
        const totalBalls = teamState.overs * 6 + teamState.balls;
        const overs = Math.floor(totalBalls / 6);
        const balls = totalBalls % 6;
        const overDisplay = Number((overs + balls / 10).toFixed(1));
        
        this.matchState!.lastWicket = {
          batsman: event.batsman,
          runs: batsman.runs,
          balls: batsman.balls,
          fallOfWicket: `${teamState.runs}/${teamState.wickets}`, // Show current score (wickets will be incremented after this)
          over: overDisplay.toString(),
          description: event.description
        };

        console.log('🎯 Wicket created:', {
          batsman: event.batsman,
          runs: batsman.runs,
          balls: batsman.balls,
          fallOfWicket: `${teamState.runs}/${teamState.wickets}`,
          over: overDisplay.toString(),
          teamState: teamState
        });
      }
    }
  }

  // Update bowler statistics
  private updateBowlerStats(event: CricketEvent, bowlingTeam: 'team1' | 'team2'): void {
    const bowlerStats = this.matchState!.bowlerStats[bowlingTeam];
    const currentBowler = bowlerStats.find(b => b.isBowling);
    
    if (currentBowler) {
      if (event.type === 'ball') {
        // Only regular balls count towards bowler stats
        currentBowler.balls += 1;
        currentBowler.runs += event.runs;
      } else if (event.type === 'wide') {
        // Wide runs are extras - NOT added to bowler runs
        // Wide doesn't count as legal ball
      } else if (event.type === 'noball') {
        // No ball runs are extras - NOT added to bowler runs  
        // No ball doesn't count as legal ball
      } else if (event.type === 'wicket') {
        currentBowler.wickets += 1;
        currentBowler.balls += 1;
        // Wicket doesn't add runs unless it's a run out with runs
      }
      
      // Update overs and economy
      // Cricket notation: 0.1, 0.2, 0.3, 0.4, 0.5, 1.0 (ball number as decimal)
      currentBowler.overs = Number((Math.floor(currentBowler.balls / 6) + (currentBowler.balls % 6) / 10).toFixed(1));
      // Economy calculation: runs per 6-ball over (not decimal notation)
      const actualOvers = currentBowler.balls / 6;
      currentBowler.economy = actualOvers > 0 ? Number((currentBowler.runs / actualOvers).toFixed(1)) : 0;
    }
  }

  // Change bowler after every over
  private changeBowler(bowlingTeam: 'team1' | 'team2'): void {
    const bowlerStats = this.matchState!.bowlerStats[bowlingTeam];
    
    // Find current bowler index BEFORE setting isBowling to false
    const currentIndex = bowlerStats.findIndex(b => b.isBowling);
    console.log(`# 🔍 Current bowler index: ${currentIndex}, name: ${bowlerStats[currentIndex]?.name}`);
    
    // Set current bowler to not bowling
    if (currentIndex !== -1) {
      bowlerStats[currentIndex].isBowling = false;
    }
    
    // Find next bowler (cycle through available bowlers)
    const nextIndex = (currentIndex + 1) % bowlerStats.length;
    console.log(`# 🔍 Next bowler index: ${nextIndex}, name: ${bowlerStats[nextIndex]?.name}`);
    
    // Set next bowler as current
    bowlerStats[nextIndex].isBowling = true;
    this.matchState!.currentBowler = bowlerStats[nextIndex].name;
    this.matchState!.bowlerIndex = nextIndex;
    
    console.log(`# 🔄 Bowler changed from ${bowlerStats[currentIndex]?.name} to: ${bowlerStats[nextIndex].name}`);
  }

  // Switch strike after every over
  private switchStrike(battingTeam: 'team1' | 'team2'): void {
    const batsmanStats = this.matchState!.batsmanStats[battingTeam];
    
    // Toggle strike between current batsmen
    const temp = this.matchState!.strikerIndex;
    this.matchState!.strikerIndex = this.matchState!.nonStrikerIndex;
    this.matchState!.nonStrikerIndex = temp;
    
    // Update isOnStrike flags
    batsmanStats.forEach((batsman, index) => {
      batsman.isOnStrike = index === this.matchState!.strikerIndex;
    });
    
    this.matchState!.currentBatsman = batsmanStats[this.matchState!.strikerIndex].name;
  }

  // Update commentary history with new event
  private updateCommentaryHistory(event: CricketEvent): void {
    // Add current event to commentary history
    this.matchState!.commentaryHistory.push(event);
    
    // Keep only last 3 overs (approximately 18 events) of commentary
    if (this.matchState!.commentaryHistory.length > 18) {
      this.matchState!.commentaryHistory = this.matchState!.commentaryHistory.slice(-18);
    }
    
    console.log(`# 📝 Commentary history updated: ${this.matchState!.commentaryHistory.length} events stored`);
  }

  // Handle strike rotation based on runs scored and ball type
  private handleStrikeRotation(event: CricketEvent, battingTeam: 'team1' | 'team2'): void {
    const batsmanStats = this.matchState!.batsmanStats[battingTeam];
    let shouldRotateStrike = false;
    
    // Determine if strike should rotate based on cricket rules
    if (event.type === 'ball') {
      // For regular balls, rotate strike for odd runs (1, 3, 5)
      shouldRotateStrike = event.runs % 2 === 1;
    } else if (event.type === 'wide' || event.type === 'noball') {
      // For wides and no-balls, rotate strike for odd runs
      shouldRotateStrike = event.runs % 2 === 1;
    } else if (event.type === 'bye' || event.type === 'legbye') {
      // For byes and leg byes, rotate strike for odd runs
      shouldRotateStrike = event.runs % 2 === 1;
    } else if (event.type === 'wicket') {
      // For wickets, no strike rotation (new batsman comes in)
      shouldRotateStrike = false;
    }
    
    if (shouldRotateStrike) {
      console.log(`# 🔄 Strike rotation: ${event.runs} runs scored (odd), switching strike`);
      
      // Toggle strike between current batsmen
      const temp = this.matchState!.strikerIndex;
      this.matchState!.strikerIndex = this.matchState!.nonStrikerIndex;
      this.matchState!.nonStrikerIndex = temp;
      
      // Update isOnStrike flags
      batsmanStats.forEach((batsman, index) => {
        batsman.isOnStrike = index === this.matchState!.strikerIndex;
      });
      
      this.matchState!.currentBatsman = batsmanStats[this.matchState!.strikerIndex].name;
      console.log(`# 🎯 New striker: ${this.matchState!.currentBatsman}`);
    } else {
      console.log(`# ⚡ No strike rotation: ${event.runs} runs scored (even), same striker continues`);
    }
  }

  // Update last over details
  private updateLastOver(event: CricketEvent, battingTeam: 'team1' | 'team2'): void {
    const currentBall = this.matchState![battingTeam].balls;
    const currentOver = this.matchState![battingTeam].overs;
    
    // Create ball details
    const ballDetails: BallDetails = {
      ball: currentBall,
      runs: event.runs,
      type: event.type,
      description: event.description
    };
    
    // If this is the first ball of a new over (ball 0), move current over to last over
    if (currentBall === 0) {
      // Move current over to last over if it has balls
      if (this.matchState!.currentOver.length > 0) {
        this.matchState!.lastOver = [...this.matchState!.currentOver];
      }
      // Clear current over for new over
      this.matchState!.currentOver = [];
      return;
    }
    
    // Add current ball to current over
    this.matchState!.currentOver.push(ballDetails);
    
    // Add to last 18 balls (add at right, remove from left if > 18)
    this.matchState!.last18Balls.push(ballDetails);
    if (this.matchState!.last18Balls.length > 18) {
      this.matchState!.last18Balls = this.matchState!.last18Balls.slice(1);
    }
    
    // If over is completed (ball 6), move current over to last over
    // Note: This happens AFTER adding the 6th ball to current over
    if (currentBall >= 6) {
      this.matchState!.lastOver = [...this.matchState!.currentOver];
      this.matchState!.currentOver = [];
      console.log(`# 🎯 Over ${currentOver} completed with ${this.matchState!.lastOver.length} balls`);
    }
  }

  // Validate data consistency across all components
  private validateDataConsistency(): void {
    if (!this.matchState) return;

    console.log('🔍 Validating data consistency...');
    
    // Check team totals consistency
    const team1Consistency = this.verifyScoreConsistency('team1');
    const team2Consistency = this.verifyScoreConsistency('team2');
    
    // Check lastWicket consistency
    if (this.matchState.lastWicket) {
      const lastWicket = this.matchState.lastWicket;
      console.log('🎯 Last wicket validation:', {
        batsman: lastWicket.batsman,
        runs: lastWicket.runs,
        balls: lastWicket.balls,
        fallOfWicket: lastWicket.fallOfWicket,
        over: lastWicket.over,
        isValid: lastWicket.batsman && lastWicket.batsman !== 'No batsman' && lastWicket.fallOfWicket !== '0/0'
      });
    }

    // Check batsman stats consistency
    Object.entries(this.matchState.batsmanStats).forEach(([team, batsmen]) => {
      batsmen.forEach(batsman => {
        const expectedStrikeRate = batsman.balls > 0 ? Number(((batsman.runs / batsman.balls) * 100).toFixed(1)) : 0;
        if (batsman.strikeRate !== expectedStrikeRate) {
          console.warn(`⚠️ Strike rate mismatch for ${batsman.name}: expected ${expectedStrikeRate}, got ${batsman.strikeRate}`);
        }
      });
    });

    console.log('✅ Data consistency validation complete');
  }

  // Verify score consistency
  private verifyScoreConsistency(team: 'team1' | 'team2'): { isValid: boolean; details: string } {
    const teamState = this.matchState![team];
    const batsmanStats = this.matchState!.batsmanStats[team];
    const bowlerStats = this.matchState!.bowlerStats[team === 'team1' ? 'team2' : 'team1'];
    const lastEvent = this.matchState!.lastEvent;
    
    // Calculate total from batsman scores
    const totalBatsmanRuns = batsmanStats.reduce((sum, batsman) => sum + batsman.runs, 0);
    const totalFromBatsmen = totalBatsmanRuns + teamState.extras;
    
    // Calculate total from bowler runs conceded (extras are NOT added to bowler runs)
    const totalBowlerRuns = bowlerStats.reduce((sum, bowler) => sum + bowler.runs, 0);
    const totalFromBowlers = totalBowlerRuns + teamState.extras;
    
    // Check consistency
    const isConsistent = teamState.runs === totalFromBatsmen && teamState.runs === totalFromBowlers;
    
    // Additional check: Verify last event runs consistency
    let eventConsistency = true;
    let eventDetails = '';
    if (lastEvent) {
      // Check if the runs in the event match what should be added
      const expectedRuns = lastEvent.runs;
      const actualRuns = teamState.runs - (this.matchState!.lastUpdateTime - 1000 < Date.now() ? 0 : lastEvent.runs);
      eventConsistency = expectedRuns === actualRuns;
      eventDetails = `Event runs: ${expectedRuns}, Commentary: "${lastEvent.description}"`;
    }
    
    return {
      isValid: isConsistent && eventConsistency,
      details: `Team ${team}: Total=${teamState.runs}, Batsmen+Extras=${totalFromBatsmen}, BowlerRuns+Extras=${totalFromBowlers}. ${eventDetails}`
    };
  }

  // Sync current bowler with actual bowling bowler
  private syncCurrentBowler(bowlingTeam: 'team1' | 'team2'): void {
    const bowlerStats = this.matchState!.bowlerStats[bowlingTeam];
    const currentBowler = bowlerStats.find(b => b.isBowling);
    if (currentBowler) {
      this.matchState!.currentBowler = currentBowler.name;
      console.log(`🔄 Synced current bowler: ${currentBowler.name}`);
    } else {
      console.log(`⚠️ No bowler found with isBowling=true in ${bowlingTeam}`);
    }
  }

  // Sync current batsman with actual batting batsman
  private syncCurrentBatsman(battingTeam: 'team1' | 'team2'): void {
    const batsmanStats = this.matchState!.batsmanStats[battingTeam];
    const currentBatsman = batsmanStats.find(b => b.isOnStrike);
    if (currentBatsman) {
      this.matchState!.currentBatsman = currentBatsman.name;
      console.log(`🔄 Synced current batsman: ${currentBatsman.name}`);
    } else {
      // No batsman on strike, set the first available batsman on strike
      const firstBatsman = batsmanStats.find(b => !b.isOut);
      if (firstBatsman) {
        firstBatsman.isOnStrike = true;
        this.matchState!.currentBatsman = firstBatsman.name;
        this.matchState!.strikerIndex = batsmanStats.indexOf(firstBatsman);
        console.log(`⚠️ No batsman on strike, set ${firstBatsman.name} on strike`);
      }
    }
  }

  // Sync team runs with batsman runs to ensure consistency
  private syncTeamRunsWithBatsmen(team: 'team1' | 'team2'): void {
    const teamState = this.matchState![team];
    const batsmanStats = this.matchState!.batsmanStats[team];
    
    // Calculate total from batsman scores
    const totalBatsmanRuns = batsmanStats.reduce((sum, batsman) => sum + batsman.runs, 0);
    const expectedTotal = totalBatsmanRuns + teamState.extras;
    
    // If there's a mismatch, log it and fix it
    if (teamState.runs !== expectedTotal) {
      console.warn(`⚠️ Score inconsistency detected for ${team}: Team runs=${teamState.runs}, Batsmen+Extras=${expectedTotal}. Fixing...`);
      teamState.runs = expectedTotal;
      console.log(`✅ Fixed ${team} runs: ${teamState.runs}`);
    }
  }

  // Verify event consistency across all three places
  private verifyEventConsistency(event: CricketEvent): void {
    const currentBattingTeam = this.matchState!.currentInnings === 1 ? 'team1' : 'team2';
    const currentBowlingTeam = this.matchState!.currentInnings === 1 ? 'team2' : 'team1';
    
    // Get the batsman who should have scored the runs
    const batsmanStats = this.matchState!.batsmanStats[currentBattingTeam];
    const batsman = batsmanStats.find(b => b.name === event.batsman);
    
    // Get the bowler who should have conceded the runs
    const bowlerStats = this.matchState!.bowlerStats[currentBowlingTeam];
    const bowler = bowlerStats.find(b => b.name === event.bowler);
    
    // Check consistency
    const eventRuns = event.runs;
    const commentaryRuns = this.extractRunsFromCommentary(event.description);
    
    console.log('🔍 Event Consistency Check:', {
      event: {
        type: event.type,
        runs: eventRuns,
        batsman: event.batsman,
        bowler: event.bowler,
        description: event.description
      },
      commentaryRuns: commentaryRuns,
      batsmanRuns: batsman?.runs || 'N/A',
      bowlerRuns: bowler?.runs || 'N/A',
      isConsistent: eventRuns === commentaryRuns
    });
    
    if (eventRuns !== commentaryRuns) {
      console.error('❌ Event inconsistency detected:', {
        eventRuns,
        commentaryRuns,
        description: event.description
      });
    }
  }

  // Extract runs from commentary description
  private extractRunsFromCommentary(description: string): number {
    if (description.includes('Dot ball')) return 0;
    if (description.includes('Single')) return 1;
    if (description.includes('Two runs')) return 2;
    if (description.includes('Three runs')) return 3;
    if (description.includes('FOUR')) return 4;
    if (description.includes('FIVE')) return 5;
    if (description.includes('SIX')) return 6;
    if (description.includes('Wide ball')) {
      const match = description.match(/(\d+) run/);
      return match ? parseInt(match[1]) : 1;
    }
    if (description.includes('No ball')) {
      const match = description.match(/(\d+) run/);
      return match ? parseInt(match[1]) : 1;
    }
    return 0;
  }

  // Build match data from current state
  private buildMatchData(): MatchData {
    if (!this.matchState) {
      throw new Error('No match state available');
    }

    // Debug logging for data consistency
    console.log('🔍 Building match data - Current state:', {
      team1: this.matchState.team1,
      team2: this.matchState.team2,
      lastWicket: this.matchState.lastWicket,
      currentBatsman: this.matchState.currentBatsman,
      currentBowler: this.matchState.currentBowler,
      isMatchCompleted: this.matchState.isMatchCompleted
    });

    // Sync team runs with batsman runs to ensure consistency
    this.syncTeamRunsWithBatsmen('team1');
    this.syncTeamRunsWithBatsmen('team2');

    // Validate data consistency
    this.validateDataConsistency();

    // Create match data
    const baseMatch: MatchData = {
      id: 'live-1',
      team1: 'Mumbai Indians',
      team2: 'Chennai Super Kings',
      venue: 'Wankhede Stadium, Mumbai',
      date: 'Mar 15',
      time: '7:30 PM',
      status: this.matchState.isMatchCompleted ? 'completed' : 'live',
      liveScore: {
        team1: {
          runs: this.matchState.team1.runs,
          wickets: this.matchState.team1.wickets,
          overs: (() => {
            const totalBalls = this.matchState.team1.overs * 6 + this.matchState.team1.balls;
            const overs = Math.floor(totalBalls / 6);
            const balls = totalBalls % 6;
            const ballDecimal = balls === 0 ? 0 : balls / 10;
            if (balls === 6) {
              return Number((overs - 1 + 0.6).toFixed(1));
            }
            return Number((overs + ballDecimal).toFixed(1));
          })()
        },
        team2: {
          runs: this.matchState.team2.runs,
          wickets: this.matchState.team2.wickets,
          overs: (() => {
            const totalBalls = this.matchState.team2.overs * 6 + this.matchState.team2.balls;
            const overs = Math.floor(totalBalls / 6);
            const balls = totalBalls % 6;
            const ballDecimal = balls === 0 ? 0 : balls / 10;
            if (balls === 6) {
              return Number((overs - 1 + 0.6).toFixed(1));
            }
            return Number((overs + ballDecimal).toFixed(1));
          })()
        },
        currentBatsman: this.matchState.currentBatsman,
        currentBowler: this.matchState.currentBowler,
        requiredRunRate: this.matchState.requiredRunRate,
        currentRunRate: (() => {
          let battingTeamForRunRate: 'team1' | 'team2';
          if (this.matchState.currentInnings === 1) {
            if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
              battingTeamForRunRate = this.matchState.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
            } else {
              battingTeamForRunRate = this.matchState.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
            }
          } else {
            if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
              battingTeamForRunRate = this.matchState.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
            } else {
              battingTeamForRunRate = this.matchState.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
            }
          }
          
          const oversFaced = this.matchState[battingTeamForRunRate].overs + this.matchState[battingTeamForRunRate].balls / 6;
          return oversFaced > 0 ? Number((this.matchState[battingTeamForRunRate].runs / oversFaced).toFixed(2)) : 0;
        })()
      }
    };

    // Add additional data
    (baseMatch as any).ballInfo = {
      team1: {
        currentBall: this.matchState.team1.balls,
        completedOvers: this.matchState.team1.overs
      },
      team2: {
        currentBall: this.matchState.team2.balls,
        completedOvers: this.matchState.team2.overs
      },
      currentInnings: this.matchState.currentInnings,
      target: this.matchState.target
    };

    (baseMatch as any).lastEvent = this.matchState.lastEvent;
    (baseMatch as any).teams = this.matchState.teams;
    (baseMatch as any).commentaryHistory = this.matchState.commentaryHistory;
    
    baseMatch.tossInfo = this.matchState.tossInfo;
    baseMatch.batsmanStats = this.matchState.batsmanStats;
    baseMatch.bowlerStats = this.matchState.bowlerStats;
    baseMatch.lastOver = this.matchState.lastOver;
    baseMatch.lastWicket = this.matchState.lastWicket;
    baseMatch.last18Balls = this.matchState.last18Balls;
    
    (baseMatch as any).extras = {
      team1: this.matchState.team1.extras,
      team2: this.matchState.team2.extras
    };

    return baseMatch;
  }

  // Generate dynamic live match data
  generateLiveMatch(): MatchData {
    // Initialize match state if not exists
    if (!this.matchState) {
      this.matchState = this.initializeMatchState();
      console.log('🏏 Initialized new match state');
    }

    // Don't generate new events if match is completed
    if (this.matchState.isMatchCompleted) {
      console.log('🏆 Match completed - returning final state');
      return this.buildMatchData();
    }

    // Check if enough time has passed since last update
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - this.matchState.lastUpdateTime;
    const minUpdateInterval = 1000; // Minimum 1 second between updates

    // Only generate new event if enough time has passed
    let event: CricketEvent;
    let shouldUpdateMatchState = false;
    
    if (timeSinceLastUpdate >= minUpdateInterval) {
      event = this.generateCricketEvent();
      console.log('# 🎯 Generated new event:', event);
      this.matchState.lastUpdateTime = currentTime;
      shouldUpdateMatchState = true;
    } else {
      // Return existing event if not enough time has passed
      event = this.matchState.lastEvent || this.generateCricketEvent();
      console.log('# ⏰ Using existing event (too soon for new ball):', event);
      shouldUpdateMatchState = false;
    }
    
    // Ensure we always have a valid event
    if (!event) {
      event = this.generateCricketEvent();
      console.log('# 🔄 Generated fallback event:', event);
    }
    
    // Only update match state if we generated a new event
    if (shouldUpdateMatchState) {
      // Get current batting and bowling teams based on toss decision and current innings
      let currentBattingTeam: 'team1' | 'team2';
      let currentBowlingTeam: 'team1' | 'team2';
      
      if (this.matchState.currentInnings === 1) {
        // First innings - use toss decision
        if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
          if (this.matchState.tossInfo.choseTo === 'bat') {
            currentBattingTeam = 'team1'; // MI bats first
            currentBowlingTeam = 'team2'; // CSK bowls first
          } else {
            currentBattingTeam = 'team2'; // CSK bats first
            currentBowlingTeam = 'team1'; // MI bowls first
          }
        } else {
          if (this.matchState.tossInfo.choseTo === 'bat') {
            currentBattingTeam = 'team2'; // CSK bats first
            currentBowlingTeam = 'team1'; // MI bowls first
          } else {
            currentBattingTeam = 'team1'; // MI bats first
            currentBowlingTeam = 'team2'; // CSK bowls first
          }
        }
      } else {
        // Second innings - opposite of first innings
        if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
          if (this.matchState.tossInfo.choseTo === 'bat') {
            currentBattingTeam = 'team2'; // CSK bats second
            currentBowlingTeam = 'team1'; // MI bowls second
          } else {
            currentBattingTeam = 'team1'; // MI bats second
            currentBowlingTeam = 'team2'; // CSK bowls second
          }
        } else {
          if (this.matchState.tossInfo.choseTo === 'bat') {
            currentBattingTeam = 'team1'; // MI bats second
            currentBowlingTeam = 'team2'; // CSK bowls second
          } else {
            currentBattingTeam = 'team2'; // CSK bats second
            currentBowlingTeam = 'team1'; // MI bowls second
          }
        }
      }
      
      // Sync current bowler with actual bowling bowler
      this.syncCurrentBowler(currentBowlingTeam);
      
      // Update team totals with proper extras tracking
      const beforeState = { ...this.matchState[currentBattingTeam] };
      
      if (event.type === 'wicket') {
        this.matchState[currentBattingTeam].wickets += 1;
        this.matchState[currentBattingTeam].balls += 1;
        console.log(`🎯 Wicket fallen! ${currentBattingTeam} now has ${this.matchState[currentBattingTeam].wickets} wickets`);
        // Wicket doesn't add runs unless it's a run out with runs
      } else if (event.type === 'wide') {
        this.matchState[currentBattingTeam].runs += event.runs;
        this.matchState[currentBattingTeam].extras += event.runs;
        // Wide doesn't count as legal ball
      } else if (event.type === 'noball') {
        this.matchState[currentBattingTeam].runs += event.runs;
        this.matchState[currentBattingTeam].extras += event.runs;
        // No ball doesn't count as legal ball
      } else if (event.type === 'bye' || event.type === 'legbye') {
        this.matchState[currentBattingTeam].runs += event.runs;
        this.matchState[currentBattingTeam].extras += event.runs;
        this.matchState[currentBattingTeam].balls += 1; // Byes and leg byes count as legal balls
      } else {
        // Regular ball
        this.matchState[currentBattingTeam].runs += event.runs;
        this.matchState[currentBattingTeam].balls += 1;
      }

      const afterState = { ...this.matchState[currentBattingTeam] };
      
      console.log(`📊 Team state updated (${currentBattingTeam}):`, {
        event: event.type,
        runs: event.runs,
        before: beforeState,
        after: afterState,
        change: {
          runs: afterState.runs - beforeState.runs,
          balls: afterState.balls - beforeState.balls,
          wickets: afterState.wickets - beforeState.wickets
        }
      });

      // Update batsman stats
      this.updateBatsmanStats(event, currentBattingTeam);
      
      // Handle strike rotation based on runs scored
      this.handleStrikeRotation(event, currentBattingTeam);
      
      // Update bowler stats
      this.updateBowlerStats(event, currentBowlingTeam);
      
      // Update commentary history
      this.updateCommentaryHistory(event);
      
      // Store the event for reuse
      this.matchState.lastEvent = event;

      // Track last over details (BEFORE over completion check to ensure 6th ball is included)
      this.updateLastOver(event, currentBattingTeam);

      // Check for over completion and bowler change
      // Balls go 0,1,2,3,4,5 then over increments and balls reset to 0
      console.log(`# 🔍 Over check: balls=${this.matchState[currentBattingTeam].balls}, overs=${this.matchState[currentBattingTeam].overs}`);
      if (this.matchState[currentBattingTeam].balls > 5) {
        console.log(`# 🎯 Over completed! Changing bowler and handling strike`);
        this.matchState[currentBattingTeam].overs += 1;
        this.matchState[currentBattingTeam].balls = 0;
        
        // Change bowler after every over
        this.changeBowler(currentBowlingTeam);
        
        // Handle strike rotation at end of over
        // If the last ball was odd runs, strike already changed, so don't change again
        // If the last ball was even runs, strike needs to change now
        const lastBallRuns = event.runs;
        if (lastBallRuns % 2 === 0) {
          console.log(`# 🔄 End of over: last ball was ${lastBallRuns} runs (even), switching strike`);
          this.switchStrike(currentBattingTeam);
        } else {
          console.log(`# ⚡ End of over: last ball was ${lastBallRuns} runs (odd), strike already changed`);
        }
      }
    }

    // Check if innings is complete (20 overs or all wickets)
    // Recalculate currentBattingTeam for innings completion check
    let currentBattingTeamForInnings: 'team1' | 'team2';
    if (this.matchState.currentInnings === 1) {
      // First innings - use toss decision
      if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
        currentBattingTeamForInnings = this.matchState.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
      } else {
        currentBattingTeamForInnings = this.matchState.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
      }
    } else {
      // Second innings - opposite of first innings
      if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
        currentBattingTeamForInnings = this.matchState.tossInfo.choseTo === 'bat' ? 'team2' : 'team1';
      } else {
        currentBattingTeamForInnings = this.matchState.tossInfo.choseTo === 'bat' ? 'team1' : 'team2';
      }
    }
    
    const isInningsComplete = this.matchState[currentBattingTeamForInnings].overs >= 20 || this.matchState[currentBattingTeamForInnings].wickets >= 10;
    
    console.log(`🔍 Innings completion check: ${currentBattingTeamForInnings} - Overs: ${this.matchState[currentBattingTeamForInnings].overs}/20, Wickets: ${this.matchState[currentBattingTeamForInnings].wickets}/10, Complete: ${isInningsComplete}`);
    
    // Check if target is achieved in second innings
    if (this.matchState.currentInnings === 2 && this.matchState.target) {
      const currentRuns = this.matchState[currentBattingTeamForInnings].runs;
      if (currentRuns >= this.matchState.target) {
        console.log(`🏆 Target achieved! ${currentBattingTeamForInnings} scored ${currentRuns}, target was ${this.matchState.target}`);
        this.matchState.isMatchCompleted = true;
      }
    }

    // Check if 10 wickets are down (match should stop regardless of innings)
    if (this.matchState[currentBattingTeamForInnings].wickets >= 10) {
      console.log(`🏆 All out! ${currentBattingTeamForInnings} lost all 10 wickets. Match complete.`);
      this.matchState.isMatchCompleted = true;
    }
    
    if (isInningsComplete && this.matchState.currentInnings === 1) {
      // First innings complete, switch to second innings
      this.matchState.currentInnings = 2;
      this.matchState.target = this.matchState[currentBattingTeamForInnings].runs + 1; // Target is first innings score + 1
      
      // Set up second innings players based on toss decision
      if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
        if (this.matchState.tossInfo.choseTo === 'bat') {
          // MI batted first, CSK bats second
          this.matchState.currentBatsman = 'Ruturaj Gaikwad'; // CSK opener
          this.matchState.currentBowler = 'Jasprit Bumrah'; // MI bowler
        } else {
          // CSK batted first, MI bats second
          this.matchState.currentBatsman = 'Rohit Sharma'; // MI opener
          this.matchState.currentBowler = 'Deepak Chahar'; // CSK bowler
        }
      } else {
        if (this.matchState.tossInfo.choseTo === 'bat') {
          // CSK batted first, MI bats second
          this.matchState.currentBatsman = 'Rohit Sharma'; // MI opener
          this.matchState.currentBowler = 'Deepak Chahar'; // CSK bowler
        } else {
          // MI batted first, CSK bats second
          this.matchState.currentBatsman = 'Ruturaj Gaikwad'; // CSK opener
          this.matchState.currentBowler = 'Jasprit Bumrah'; // MI bowler
        }
      }

      // Update bowler isBowling flags for second innings
      // Reset all bowlers to not bowling
      this.matchState.bowlerStats.team1.forEach(bowler => bowler.isBowling = false);
      this.matchState.bowlerStats.team2.forEach(bowler => bowler.isBowling = false);
      
      // Set the current bowler to bowling
      const currentBowlingTeam = this.matchState.currentInnings === 1 ? 'team2' : 'team1';
      const currentBowlerStats = this.matchState.bowlerStats[currentBowlingTeam];
      const activeBowler = currentBowlerStats.find(b => b.name === this.matchState.currentBowler);
      if (activeBowler) {
        activeBowler.isBowling = true;
        console.log(`🏏 Second innings: ${this.matchState.currentBowler} is now bowling for ${currentBowlingTeam}`);
      }
      
      const firstInningsTeam = this.matchState[currentBattingTeamForInnings].runs;
      const secondInningsTeam = this.matchState.tossInfo.wonBy === 'Mumbai Indians' 
        ? (this.matchState.tossInfo.choseTo === 'bat' ? 'CSK' : 'MI')
        : (this.matchState.tossInfo.choseTo === 'bat' ? 'MI' : 'CSK');
      
      console.log(`🏏 Innings break! First innings team scored ${firstInningsTeam}. ${secondInningsTeam} needs ${this.matchState.target} to win.`);
    } else if (isInningsComplete && this.matchState.currentInnings === 2) {
      // Match complete
      const secondInningsScore = this.matchState[currentBattingTeamForInnings].runs;
      console.log(`🏆 Match complete! Second innings team scored ${secondInningsScore}. Target was ${this.matchState.target}.`);
      
      // Mark match as completed
      this.matchState.isMatchCompleted = true;
    }

    // Check for free hit
    if (event.type === 'noball') {
      this.matchState.isFreeHit = true;
    } else if (event.type === 'ball' && this.matchState.isFreeHit) {
      this.matchState.isFreeHit = false;
    }

    // Update run rates (only after scores are updated)
    if (shouldUpdateMatchState) {
      if (this.matchState.currentInnings === 1) {
        // First innings - no required run rate (no target to chase)
        this.matchState.requiredRunRate = undefined;
      } else {
        // Second innings - calculate required run rate for batting team to win
        const oversFaced = this.matchState[currentBattingTeamForInnings].overs + this.matchState[currentBattingTeamForInnings].balls / 6;
        const oversRemaining = 20 - oversFaced;
        const runsNeeded = (this.matchState.target || 0) - this.matchState[currentBattingTeamForInnings].runs;
        
        if (oversRemaining > 0 && runsNeeded > 0) {
          this.matchState.requiredRunRate = Number((runsNeeded / oversRemaining).toFixed(2));
        } else if (runsNeeded <= 0) {
          this.matchState.requiredRunRate = 0; // Target achieved
        } else {
          this.matchState.requiredRunRate = 0; // No overs remaining
        }
      }
    }

    // Sync current bowler and batsman before creating match data
    // Determine batting and bowling teams based on toss and current innings
    let syncBattingTeam: 'team1' | 'team2';
    let syncBowlingTeam: 'team1' | 'team2';
    
    if (this.matchState.currentInnings === 1) {
      // First innings - use toss decision
      if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
        if (this.matchState.tossInfo.choseTo === 'bat') {
          syncBattingTeam = 'team1'; // MI bats first
          syncBowlingTeam = 'team2'; // CSK bowls first
        } else {
          syncBattingTeam = 'team2'; // CSK bats first
          syncBowlingTeam = 'team1'; // MI bowls first
        }
      } else { // CSK won the toss
        if (this.matchState.tossInfo.choseTo === 'bat') {
          syncBattingTeam = 'team2'; // CSK bats first
          syncBowlingTeam = 'team1'; // MI bowls first
        } else {
          syncBattingTeam = 'team1'; // MI bats first
          syncBowlingTeam = 'team2'; // CSK bowls first
        }
      }
    } else {
      // Second innings - opposite of first innings
      if (this.matchState.tossInfo.wonBy === 'Mumbai Indians') {
        if (this.matchState.tossInfo.choseTo === 'bat') {
          syncBattingTeam = 'team2'; // CSK bats second
          syncBowlingTeam = 'team1'; // MI bowls second
        } else {
          syncBattingTeam = 'team1'; // MI bats second
          syncBowlingTeam = 'team2'; // CSK bowls second
        }
      } else {
        if (this.matchState.tossInfo.choseTo === 'bat') {
          syncBattingTeam = 'team1'; // MI bats second
          syncBowlingTeam = 'team2'; // CSK bowls second
        } else {
          syncBattingTeam = 'team2'; // CSK bats second
          syncBowlingTeam = 'team1'; // MI bowls second
        }
      }
    }
    
    this.syncCurrentBowler(syncBowlingTeam);
    this.syncCurrentBatsman(syncBattingTeam);

    // Build and return match data
    const baseMatch = this.buildMatchData();
    
    // Add event-specific data
    (baseMatch as any).lastEvent = event;
    
    // Verify score consistency
    const team1Consistency = this.verifyScoreConsistency('team1');
    const team2Consistency = this.verifyScoreConsistency('team2');
    (baseMatch as any).scoreConsistency = {
      team1: team1Consistency,
      team2: team2Consistency,
      overallValid: team1Consistency.isValid && team2Consistency.isValid
    };
    
    // Log consistency check
    if (!team1Consistency.isValid || !team2Consistency.isValid) {
      console.warn('⚠️ Score inconsistency detected:', {
        team1: team1Consistency.details,
        team2: team2Consistency.details
      });
    }
    
    // Additional detailed consistency check for the last event
    if (event && shouldUpdateMatchState) {
      this.verifyEventConsistency(event);
    }

    this.liveMatchData = baseMatch;
    return baseMatch;
  }

  // Get current live match data
  getCurrentLiveMatch(): MatchData | null {
    return this.liveMatchData;
  }

  // Reset match to initial state
  resetMatch(): void {
    this.matchState = null;
    this.liveMatchData = null;
    console.log('🔄 Match reset to initial state');
  }

  // Reset match with specific team batting first
  resetMatchWithTeamSelection(batFirst: 'MI' | 'CSK'): void {
    this.matchState = this.initializeMatchStateWithTeamSelection(batFirst);
    this.liveMatchData = null;
    console.log(`🔄 Match reset with ${batFirst} batting first`);
  }

  // Generate upcoming matches
  generateUpcomingMatches(): MatchData[] {
    return [
      {
        id: 'upcoming-1',
        team1: 'Royal Challengers Bangalore',
        team2: 'Kolkata Knight Riders',
        venue: 'M. Chinnaswamy Stadium, Bangalore',
        date: 'Mar 16',
        time: '7:30 PM',
        status: 'upcoming'
      },
      {
        id: 'upcoming-2',
        team1: 'Delhi Capitals',
        team2: 'Punjab Kings',
        venue: 'Arun Jaitley Stadium, Delhi',
        date: 'Mar 17',
        time: '3:30 PM',
        status: 'upcoming'
      },
      {
        id: 'upcoming-3',
        team1: 'Rajasthan Royals',
        team2: 'Sunrisers Hyderabad',
        venue: 'Sawai Mansingh Stadium, Jaipur',
        date: 'Mar 18',
        time: '7:30 PM',
        status: 'upcoming'
      }
    ];
  }

  // Generate all matches (live + upcoming)
  generateAllMatches(): MatchData[] {
    const liveMatch = this.generateLiveMatch();
    const upcomingMatches = this.generateUpcomingMatches();
    return [liveMatch, ...upcomingMatches];
  }

  // Generate dynamic points table (with minor variations)
  generatePointsTable(): PointsTableData[] {
    const baseTable: PointsTableData[] = [
      {
        team: 'Mumbai Indians',
        matches: 5,
        won: 4,
        lost: 1,
        tied: 0,
        noResult: 0,
        points: 8,
        netRunRate: 1.25,
        position: 1
      },
      {
        team: 'Chennai Super Kings',
        matches: 5,
        won: 3,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 6,
        netRunRate: 0.85,
        position: 2
      },
      {
        team: 'Royal Challengers Bangalore',
        matches: 4,
        won: 3,
        lost: 1,
        tied: 0,
        noResult: 0,
        points: 6,
        netRunRate: 0.65,
        position: 3
      },
      {
        team: 'Kolkata Knight Riders',
        matches: 4,
        won: 2,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 4,
        netRunRate: 0.15,
        position: 4
      },
      {
        team: 'Delhi Capitals',
        matches: 4,
        won: 2,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 4,
        netRunRate: -0.25,
        position: 5
      },
      {
        team: 'Punjab Kings',
        matches: 4,
        won: 2,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 4,
        netRunRate: -0.45,
        position: 6
      },
      {
        team: 'Rajasthan Royals',
        matches: 3,
        won: 1,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 2,
        netRunRate: -0.35,
        position: 7
      },
      {
        team: 'Sunrisers Hyderabad',
        matches: 3,
        won: 1,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 2,
        netRunRate: -0.65,
        position: 8
      },
      {
        team: 'Gujarat Titans',
        matches: 3,
        won: 1,
        lost: 2,
        tied: 0,
        noResult: 0,
        points: 2,
        netRunRate: -0.85,
        position: 9
      },
      {
        team: 'Lucknow Super Giants',
        matches: 3,
        won: 0,
        lost: 3,
        tied: 0,
        noResult: 0,
        points: 0,
        netRunRate: -1.25,
        position: 10
      }
    ];

    // Add small random variations to make it feel dynamic
    return baseTable.map(team => ({
      ...team,
      netRunRate: Number((team.netRunRate + (Math.random() - 0.5) * 0.1).toFixed(3))
    }));
  }
}
