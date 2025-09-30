export interface Player {
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  skill: string;
  isCaptain: boolean;
  isWicketKeeper: boolean;
  battingOrder?: number;
  bowlingOrder?: number;
}

export interface Team {
  name: string;
  players: Player[];
  captain: string;
  wicketKeeper: string;
}

export interface PlayingXIData {
  team1: Team;
  team2: Team;
}

export type TeamTab = 'team1' | 'team2';

