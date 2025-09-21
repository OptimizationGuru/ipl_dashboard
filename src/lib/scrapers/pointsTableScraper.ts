import axios from 'axios';
import * as cheerio from 'cheerio';
import { PointsTableData, ScrapingResult } from '@/types';

export class PointsTableScraper {
  private baseUrl = 'https://www.espncricinfo.com/series/indian-premier-league-2024-1417499/points-table-standings';

  async scrapePointsTable(): Promise<ScrapingResult<PointsTableData>> {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const pointsTable: PointsTableData[] = [];

      // Look for points table rows
      $('.ds-w-full.ds-table.ds-table-xs.ds-table-auto').find('tbody tr').each((index, element) => {
        const $row = $(element);
        const cells = $row.find('td').map((i, el) => $(el).text().trim()).get();
        
        if (cells.length >= 8) {
          const team = cells[1] || cells[0]; // Team name is usually in second column
          const matches = parseInt(cells[2]) || 0;
          const won = parseInt(cells[3]) || 0;
          const lost = parseInt(cells[4]) || 0;
          const tied = parseInt(cells[5]) || 0;
          const noResult = parseInt(cells[6]) || 0;
          const points = parseInt(cells[7]) || 0;
          const netRunRate = parseFloat(cells[8]) || 0;

          pointsTable.push({
            team: this.cleanTeamName(team),
            matches,
            won,
            lost,
            tied,
            noResult,
            points,
            netRunRate,
            position: index + 1
          });
        }
      });

      return {
        data: pointsTable,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error scraping points table:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  private cleanTeamName(teamName: string): string {
    // Clean up team names to standard format
    const teamMap: { [key: string]: string } = {
      'Mumbai Indians': 'Mumbai Indians',
      'Chennai Super Kings': 'Chennai Super Kings',
      'Royal Challengers Bangalore': 'Royal Challengers Bangalore',
      'Kolkata Knight Riders': 'Kolkata Knight Riders',
      'Delhi Capitals': 'Delhi Capitals',
      'Punjab Kings': 'Punjab Kings',
      'Rajasthan Royals': 'Rajasthan Royals',
      'Sunrisers Hyderabad': 'Sunrisers Hyderabad',
      'Gujarat Titans': 'Gujarat Titans',
      'Lucknow Super Giants': 'Lucknow Super Giants'
    };

    // Try to match with known team names
    for (const [key, value] of Object.entries(teamMap)) {
      if (teamName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(teamName.toLowerCase())) {
        return value;
      }
    }

    return teamName;
  }
}
