import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScheduleData, ScrapingResult } from '@/types';

export class ScheduleScraper {
  private baseUrl = 'https://www.espncricinfo.com/series/indian-premier-league-2024-1417499';

  async scrapeSchedule(): Promise<ScrapingResult<ScheduleData>> {
    try {
      const response = await axios.get(`${this.baseUrl}/match-schedule-fixtures`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const schedule: ScheduleData[] = [];

      // Look for match schedule items
      $('.ds-bg-fill-content-prime.ds-rounded-lg, .ds-flex.ds-flex-col').each((index, element) => {
        const $match = $(element);
        
        // Try different selectors for match information
        const teamElements = $match.find('.ds-text-tight-l, .ds-text-tight-m, .ds-text-tight-s');
        const teams = teamElements.map((i, el) => $(el).text().trim()).get();
        
        if (teams.length >= 2) {
          const venue = $match.find('.ds-text-tight-xs').first().text().trim() || 'TBD';
          const dateTime = $match.find('.ds-text-tight-xs').last().text().trim() || new Date().toLocaleDateString();
          
          // Extract match number from text or use index
          const matchNumberMatch = $match.text().match(/Match\s*(\d+)/i);
          const matchNumber = matchNumberMatch ? parseInt(matchNumberMatch[1]) : index + 1;

          schedule.push({
            id: `match-${matchNumber}`,
            team1: teams[0],
            team2: teams[1],
            venue,
            date: this.extractDate(dateTime),
            time: this.extractTime(dateTime),
            matchNumber,
            season: '2024'
          });
        }
      });

      return {
        data: schedule,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error scraping schedule:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  private extractDate(dateTime: string): string {
    // Extract date from dateTime string
    const dateMatch = dateTime.match(/(\w{3}\s+\d{1,2})/);
    return dateMatch ? dateMatch[1] : new Date().toLocaleDateString();
  }

  private extractTime(dateTime: string): string {
    // Extract time from dateTime string
    const timeMatch = dateTime.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
    return timeMatch ? timeMatch[1] : 'TBD';
  }
}
