import { PointsTableData } from '../types';

// Types for better type safety
type YearKey = '2020' | '2021' | '2022' | '2023' | '2024' | '2025';

interface SeasonContext {
  totalMatches: number;
  seasonType: string;
  winner: string;
  teams: string[];
}

interface TeamPerformance {
  [teamName: string]: number;
}

export class DynamicDataGenerator {
  // IPL Teams (current 10 teams)
  private readonly IPL_TEAMS = [
    'Mumbai Indians',
    'Chennai Super Kings', 
    'Royal Challengers Bangalore',
    'Kolkata Knight Riders',
    'Delhi Capitals',
    'Punjab Kings',
    'Rajasthan Royals',
    'Sunrisers Hyderabad',
    'Gujarat Titans',
    'Lucknow Super Giants'
  ] as const;

  // Historical season data with real context
  private readonly SEASON_DATA: Record<YearKey, SeasonContext> = {
    '2020': { 
      totalMatches: 60, 
      seasonType: 'COVID-19 affected', 
      winner: 'Mumbai Indians',
      teams: ['Mumbai Indians', 'Delhi Capitals', 'Sunrisers Hyderabad', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Kings XI Punjab', 'Chennai Super Kings', 'Rajasthan Royals']
    },
    '2021': { 
      totalMatches: 60, 
      seasonType: 'UAE hosted', 
      winner: 'Chennai Super Kings',
      teams: ['Chennai Super Kings', 'Delhi Capitals', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Mumbai Indians', 'Punjab Kings', 'Rajasthan Royals', 'Sunrisers Hyderabad']
    },
    '2022': { 
      totalMatches: 74, 
      seasonType: '10 teams', 
      winner: 'Gujarat Titans',
      teams: ['Gujarat Titans', 'Rajasthan Royals', 'Lucknow Super Giants', 'Royal Challengers Bangalore', 'Delhi Capitals', 'Punjab Kings', 'Kolkata Knight Riders', 'Sunrisers Hyderabad', 'Chennai Super Kings', 'Mumbai Indians']
    },
    '2023': { 
      totalMatches: 74, 
      seasonType: '10 teams', 
      winner: 'Chennai Super Kings',
      teams: ['Gujarat Titans', 'Chennai Super Kings', 'Lucknow Super Giants', 'Mumbai Indians', 'Rajasthan Royals', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Punjab Kings', 'Delhi Capitals', 'Sunrisers Hyderabad']
    },
    '2024': { 
      totalMatches: 74, 
      seasonType: '10 teams', 
      winner: 'Kolkata Knight Riders',
      teams: ['Kolkata Knight Riders', 'Sunrisers Hyderabad', 'Rajasthan Royals', 'Royal Challengers Bangalore', 'Chennai Super Kings', 'Delhi Capitals', 'Lucknow Super Giants', 'Gujarat Titans', 'Punjab Kings', 'Mumbai Indians']
    },
    '2025': { 
      totalMatches: 74, 
      seasonType: '10 teams', 
      winner: 'TBD',
      teams: ['Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings', 'Rajasthan Royals', 'Sunrisers Hyderabad', 'Gujarat Titans', 'Lucknow Super Giants']
    }
  };

  // Historical team performance data
  private readonly TEAM_PERFORMANCE: TeamPerformance = {
    'Mumbai Indians': 0.65,
    'Chennai Super Kings': 0.62,
    'Kolkata Knight Riders': 0.55,
    'Royal Challengers Bangalore': 0.52,
    'Rajasthan Royals': 0.50,
    'Delhi Capitals': 0.48,
    'Punjab Kings': 0.45,
    'Sunrisers Hyderabad': 0.47,
    'Gujarat Titans': 0.58, // New team but performed well
    'Lucknow Super Giants': 0.45 // New team
  };

  /**
   * Generate realistic points table data for a given year
   */
  generatePointsTable(year: string): PointsTableData[] {
    
    const seasonContext = this.getSeasonContext(year);
    const seed = this.createYearSeed(year);
    
    // Generate team data with realistic statistics
    const teams = this.IPL_TEAMS.map((team, index) => 
      this.generateTeamData(team, seasonContext, seed + index)
    );

    // Sort and assign positions
    const result = this.sortAndRankTeams(teams);
    
    
    return result;
  }

  /**
   * Get season context for a given year
   */
  private getSeasonContext(year: string): SeasonContext {
    return this.SEASON_DATA[year as YearKey] || this.SEASON_DATA['2025'];
  }

  /**
   * Generate individual team data with realistic statistics
   */
  private generateTeamData(team: string, context: SeasonContext, seed: number): PointsTableData {
    const random = this.createSeededRandom(seed);
    const matchesPerTeam = Math.floor(context.totalMatches / this.IPL_TEAMS.length * 2);
    
    // Generate match statistics
    const matches = Math.floor(matchesPerTeam + (random() - 0.5) * 2); // 13-15 matches
    const winRate = this.calculateWinRate(team, random);
    const wins = Math.floor(matches * winRate);
    const losses = matches - wins;
    const tied = Math.floor(random() * 2); // 0-1 tied matches
    const noResult = Math.floor(random() * 2); // 0-1 no result matches
    
    // Calculate points and NRR
    const points = wins * 2 + tied + noResult;
    const netRunRate = this.calculateNetRunRate(wins, losses, random);
    
    return {
      team,
      matches,
      won: wins,
      lost: losses,
      tied,
      noResult,
      points,
      netRunRate,
      position: 0 // Will be set after sorting
    };
  }

  /**
   * Sort teams by points and NRR, then assign positions
   */
  private sortAndRankTeams(teams: PointsTableData[]): PointsTableData[] {
    // Sort by points (descending), then by NRR (descending)
    teams.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.netRunRate - a.netRunRate;
    });

    // Assign positions
    teams.forEach((team, index) => {
      team.position = index + 1;
    });

    return teams;
  }

  /**
   * Create a consistent seed based on year
   */
  private createYearSeed(year: string): number {
    return parseInt(year) * 1000 + 42;
  }

  /**
   * Create a seeded random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let currentSeed = seed;
    return () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  /**
   * Calculate realistic win rate for a team
   */
  private calculateWinRate(team: string, random: () => number): number {
    const baseRate = this.TEAM_PERFORMANCE[team] || 0.50;
    
    // Add some variation for realism
    const randomVariation = (random() - 0.5) * 0.1; // -0.05 to 0.05
    
    return Math.max(0.1, Math.min(0.9, baseRate + randomVariation));
  }

  /**
   * Calculate realistic Net Run Rate based on win/loss ratio
   */
  private calculateNetRunRate(wins: number, losses: number, random: () => number): number {
    const winRate = wins / (wins + losses);
    
    // Base NRR calculation
    let baseNRR = (winRate - 0.5) * 2; // -1 to 1 range
    
    // Add some randomness
    const randomFactor = (random() - 0.5) * 0.5; // -0.25 to 0.25
    const finalNRR = baseNRR + randomFactor;
    
    // Round to 3 decimal places
    return Math.round(finalNRR * 1000) / 1000;
  }

  /**
   * Generate data that changes slightly over time (for demo purposes)
   */
  generateTimeBasedData(year: string, timeOffset: number = 0): PointsTableData[] {
    const baseData = this.generatePointsTable(year);
    
    // Add small time-based variations to make it feel more dynamic
    return baseData.map(team => {
      const variation = Math.sin(timeOffset + team.position) * 0.1;
      return {
        ...team,
        netRunRate: Math.round((team.netRunRate + variation) * 1000) / 1000
      };
    });
  }
}
