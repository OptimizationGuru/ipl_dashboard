/**
 * ESPN Data Transformer
 * 
 * Transforms ESPN Cricinfo API data to our internal format
 */

import { MatchData, PointsTableData, ScheduleData } from '@/types';

export interface ESPNMatch {
  id: string;
  name: string;
  status: string;
  startTime: string;
  endTime?: string;
  teams: {
    id: string;
    name: string;
    shortName: string;
    logo: string;
  }[];
  venue: {
    name: string;
    location: string;
  };
  series: {
    id: string;
    name: string;
    shortName: string;
  };
  score?: {
    home: {
      runs: number;
      wickets: number;
      overs: number;
    };
    away: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
  liveScore?: {
    currentRunRate: number;
    requiredRunRate?: number;
    lastWicket?: string;
    lastEvent?: string;
  };
}

export class ESPNDataTransformer {
  
  /**
   * Transform ESPN matches data to our MatchData format
   */
  transformMatchesData(espnData: any): MatchData[] {
    if (!espnData || !espnData.content || !Array.isArray(espnData.content.matches)) {
      return [];
    }

    return espnData.content.matches.map((match: any) => this.transformMatch(match));
  }

  /**
   * Transform single ESPN match to our format
   */
  private transformMatch(espnMatch: any): MatchData {
    const teams = espnMatch.teams || [];
    const team1 = teams[0];
    const team2 = teams[1];

    return {
      id: espnMatch.id || `espn-${Date.now()}`,
      team1: team1?.name || 'Team 1',
      team2: team2?.name || 'Team 2',
      venue: espnMatch.venue?.name || 'Unknown Venue',
      date: this.formatDate(espnMatch.startTime),
      time: this.formatTime(espnMatch.startTime),
      status: this.mapStatus(espnMatch.status),
      liveScore: this.transformLiveScore(espnMatch),
      tossInfo: this.transformTossInfo(espnMatch),
      teams: this.transformTeamsData(espnMatch)
    };
  }

  /**
   * Transform live score data
   */
  private transformLiveScore(espnMatch: any): any {
    if (!espnMatch.score) {
      return {
        team1: { runs: 0, wickets: 0, overs: 0 },
        team2: { runs: 0, wickets: 0, overs: 0 },
        currentBatsman: '',
        currentBowler: '',
        currentRunRate: 0
      };
    }

    const score = espnMatch.score;
    const teams = espnMatch.teams || [];
    
    return {
      team1: {
        runs: score.home?.runs || 0,
        wickets: score.home?.wickets || 0,
        overs: score.home?.overs || 0
      },
      team2: {
        runs: score.away?.runs || 0,
        wickets: score.away?.wickets || 0,
        overs: score.away?.overs || 0
      },
      currentBatsman: espnMatch.liveScore?.currentBatsman || '',
      currentBowler: espnMatch.liveScore?.currentBowler || '',
      currentRunRate: espnMatch.liveScore?.currentRunRate || 0,
      requiredRunRate: espnMatch.liveScore?.requiredRunRate
    };
  }

  /**
   * Transform toss information
   */
  private transformTossInfo(espnMatch: any): any {
    // ESPN API might not have toss info in the same format
    // This is a placeholder implementation
    return {
      wonBy: espnMatch.tossWinner || 'TBD',
      choseTo: espnMatch.tossDecision || 'bat',
      description: espnMatch.tossDescription || 'Toss details not available'
    };
  }

  /**
   * Transform teams data
   */
  private transformTeamsData(espnMatch: any): any {
    const teams = espnMatch.teams || [];
    
    return {
      team1: {
        name: teams[0]?.name || 'Team 1',
        players: [], // ESPN API might not provide detailed player info
        captain: teams[0]?.captain || 'TBD',
        wicketKeeper: teams[0]?.wicketKeeper || 'TBD'
      },
      team2: {
        name: teams[1]?.name || 'Team 2',
        players: [],
        captain: teams[1]?.captain || 'TBD',
        wicketKeeper: teams[1]?.wicketKeeper || 'TBD'
      }
    };
  }

  /**
   * Transform points table data
   */
  transformPointsTableData(espnData: any): PointsTableData[] {
    if (!espnData || !espnData.content || !Array.isArray(espnData.content.teams)) {
      return [];
    }

    return espnData.content.teams.map((team: any, index: number) => ({
      team: team.name || `Team ${index + 1}`,
      matches: team.matches || 0,
      won: team.won || 0,
      lost: team.lost || 0,
      tied: team.tied || 0,
      noResult: team.noResult || 0,
      points: team.points || 0,
      netRunRate: team.netRunRate || 0,
      position: index + 1
    }));
  }

  /**
   * Transform schedule data
   */
  transformScheduleData(espnData: any): ScheduleData[] {
    if (!espnData || !espnData.content || !Array.isArray(espnData.content.matches)) {
      return [];
    }

    return espnData.content.matches.map((match: any, index: number) => ({
      id: match.id || `schedule-${index + 1}`,
      team1: match.teams?.[0]?.name || 'Team 1',
      team2: match.teams?.[1]?.name || 'Team 2',
      venue: match.venue?.name || 'Unknown Venue',
      date: this.formatDate(match.startTime),
      time: this.formatTime(match.startTime),
      matchNumber: index + 1,
      season: match.series?.name || '2024'
    }));
  }

  /**
   * Map ESPN status to our status format
   */
  private mapStatus(espnStatus: string): 'live' | 'upcoming' | 'completed' {
    const status = espnStatus?.toLowerCase() || '';
    
    if (status.includes('live') || status.includes('in progress')) {
      return 'live';
    } else if (status.includes('completed') || status.includes('finished')) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  }

  /**
   * Format date from ESPN timestamp
   */
  private formatDate(timestamp: string): string {
    if (!timestamp) return 'TBD';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'TBD';
    }
  }

  /**
   * Format time from ESPN timestamp
   */
  private formatTime(timestamp: string): string {
    if (!timestamp) return 'TBD';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return 'TBD';
    }
  }
}
