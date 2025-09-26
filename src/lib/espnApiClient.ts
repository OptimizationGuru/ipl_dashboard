import axios from 'axios';
import { PointsTableData } from '../types';

export class ESPNApiClient {
  private readonly baseUrl = 'https://site.api.espn.com/apis/v2/sports';
  private readonly timeout = 10000;
  private readonly headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9'
  };

  // Team name mapping for consistency
  private readonly teamMap = new Map([
    ['mumbai indians', 'Mumbai Indians'],
    ['chennai super kings', 'Chennai Super Kings'],
    ['royal challengers bangalore', 'Royal Challengers Bangalore'],
    ['royal challengers bengaluru', 'Royal Challengers Bangalore'],
    ['kolkata knight riders', 'Kolkata Knight Riders'],
    ['delhi capitals', 'Delhi Capitals'],
    ['punjab kings', 'Punjab Kings'],
    ['kings xi punjab', 'Punjab Kings'],
    ['rajasthan royals', 'Rajasthan Royals'],
    ['sunrisers hyderabad', 'Sunrisers Hyderabad'],
    ['gujarat titans', 'Gujarat Titans'],
    ['lucknow super giants', 'Lucknow Super Giants']
  ]);

  async fetchPointsTable(year: string): Promise<PointsTableData[]> {
    try {
      const endpoint = `${this.baseUrl}/cricket/ipl/standings?season=${year}`;
      const response = await axios.get(endpoint, {
        headers: this.headers,
        timeout: this.timeout
      });

      const data = response.data;
      if (!data || (!data.children?.length && !data.standings?.length && !data.teams?.length)) {
        throw new Error('No valid data found');
      }

      // Extract teams from response
      const teams = data.children || data.standings || data.teams || [];
      
      return teams.map((team: any, index: number) => {
        const teamData = team.team || team;
        const stats = team.stats || team.record || {};
        
        return {
          team: this.cleanTeamName(teamData.displayName || teamData.name || `Team ${index + 1}`),
          matches: parseInt(stats.gamesPlayed || stats.matches || '0') || 0,
          won: parseInt(stats.wins || stats.won || '0') || 0,
          lost: parseInt(stats.losses || stats.lost || '0') || 0,
          tied: parseInt(stats.ties || stats.tied || '0') || 0,
          noResult: parseInt(stats.noResults || stats.noResult || '0') || 0,
          points: parseInt(stats.points || '0') || 0,
          netRunRate: parseFloat(stats.netRunRate || stats.nrr || '0') || 0,
          position: index + 1
        };
      });
    } catch (error) {
      console.log('ESPN API failed:', error);
      throw new Error('ESPN API endpoint not available for cricket data');
    }
  }

  private cleanTeamName(teamName: string): string {
    const normalizedName = teamName.toLowerCase();
    
    for (const [key, value] of this.teamMap) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return value;
      }
    }

    return teamName;
  }
}

