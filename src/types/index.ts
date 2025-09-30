export interface CricketEvent {
  type: 'ball' | 'wicket' | 'wide' | 'noball' | 'bye' | 'legbye' | 'stumped';
  runs: number;
  description: string;
  batsman?: string;
  bowler?: string;
  nextBallDelay?: number;
}

export interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  isOnStrike: boolean;
}

export interface BowlerStats {
  name: string;
  overs: number; // Keep for backward compatibility (decimal format)
  balls: number; // Keep balls as the source of truth
  runs: number;
  wickets: number;
  economy: number;
  isBowling: boolean;
  // New display fields for overs
  oversStr: string; // e.g., "2.5"
  completedOvers: number; // e.g., 2
}

export interface TossInfo {
  wonBy: string;
  choseTo: 'bat' | 'field';
  description: string;
}

export interface BallDetails {
  ball: number | string; // Allow string for extras (e.g., "1+", "2+")
  runs: number;
  type: 'ball' | 'wide' | 'noball' | 'wicket' | 'bye' | 'legbye' | 'freehit';
  description: string;
}

export interface WicketDetails {
  batsman: string;
  bowler: string;
  wicketType: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
  runs: number;
  balls: number;
  fallOfWicket: string; // e.g., "61/1"
  over: string; // e.g., "3.2"
  description: string;
}

export interface MatchData {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming' | 'completed';
  score?: {
    team1: string;
    team2: string;
  };
  liveScore?: {
    team1: {
      runs: number;
      wickets: number;
      overs: number; // Keep for backward compatibility (decimal format)
      balls: number; // Keep balls as source of truth
      oversStr: string; // Display format e.g., "2.5"
      completedOvers: number; // Completed overs e.g., 2
    };
    team2: {
      runs: number;
      wickets: number;
      overs: number; // Keep for backward compatibility (decimal format)
      balls: number; // Keep balls as source of truth
      oversStr: string; // Display format e.g., "2.5"
      completedOvers: number; // Completed overs e.g., 2
    };
    currentBatsman?: string;
    currentBowler?: string;
    requiredRunRate?: number;
    currentRunRate?: number;
  };
  tossInfo?: TossInfo;
  teams?: {
    team1: {
      name: string;
      players: Array<{
        name: string;
        role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
        skill: string;
        isCaptain: boolean;
        isWicketKeeper: boolean;
        battingOrder?: number;
        bowlingOrder?: number;
      }>;
      captain: string;
      wicketKeeper: string;
    };
    team2: {
      name: string;
      players: Array<{
        name: string;
        role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
        skill: string;
        isCaptain: boolean;
        isWicketKeeper: boolean;
        battingOrder?: number;
        bowlingOrder?: number;
      }>;
      captain: string;
      wicketKeeper: string;
    };
  };
  batsmanStats?: {
    team1: BatsmanStats[];
    team2: BatsmanStats[];
  };
  bowlerStats?: {
    team1: BowlerStats[];
    team2: BowlerStats[];
  };
  lastOver?: BallDetails[];
  currentOver?: BallDetails[];
  lastWicket?: WicketDetails;
  last18Balls?: BallDetails[];
  commentaryHistory?: CricketEvent[];
  lastEvent?: CricketEvent;
}

export interface PointsTableData {
  team: string;
  matches: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: number;
  position: number;
}

export interface ScheduleData {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  date: string;
  time: string;
  matchNumber: number;
  season: string;
  status: 'upcoming' | 'live' | 'completed';
  result?: {
    winner: string;
    winBy: string; // e.g., "7 wickets", "45 runs", "won by 3 wickets"
    team1Score?: string; // e.g., "185/7 (20)"
    team2Score?: string; // e.g., "178/9 (20)"
    manOfTheMatch?: string;
  };
}

export interface ScrapingResult<T> {
  data: T[];
  success: boolean;
  error?: string;
  timestamp: number;
}
