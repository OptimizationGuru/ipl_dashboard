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
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  economy: number;
  isBowling: boolean;
}

export interface TossInfo {
  wonBy: string;
  choseTo: 'bat' | 'field';
  description: string;
}

export interface BallDetails {
  ball: number;
  runs: number;
  type: 'ball' | 'wide' | 'noball' | 'wicket' | 'bye' | 'legbye' | 'freehit';
  description: string;
}

export interface WicketDetails {
  batsman: string;
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
      overs: number;
    };
    team2: {
      runs: number;
      wickets: number;
      overs: number;
    };
    currentBatsman?: string;
    currentBowler?: string;
    requiredRunRate?: number;
    currentRunRate?: number;
  };
  tossInfo?: TossInfo;
  batsmanStats?: {
    team1: BatsmanStats[];
    team2: BatsmanStats[];
  };
  bowlerStats?: {
    team1: BowlerStats[];
    team2: BowlerStats[];
  };
  lastOver?: BallDetails[];
  lastWicket?: WicketDetails;
  last18Balls?: BallDetails[];
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
}

export interface ScrapingResult<T> {
  data: T[];
  success: boolean;
  error?: string;
  timestamp: number;
}
