import axios from 'axios';
import * as cheerio from 'cheerio';
import { MatchData, ScrapingResult } from '@/types';

export class MatchScraper {
  private baseUrl = 'https://www.espncricinfo.com/series/indian-premier-league-2024-1417499';

  async scrapeLiveMatches(): Promise<ScrapingResult<MatchData>> {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const matches: MatchData[] = [];

      // Look for live matches
      $('.ds-bg-fill-content-prime.ds-rounded-lg').each((index, element) => {
        const $match = $(element);
        const status = $match.find('.ds-text-tight-s').text().toLowerCase();
        
        if (status.includes('live') || status.includes('in progress')) {
          const teams = $match.find('.ds-text-tight-l').map((i, el) => $(el).text().trim()).get();
          const venue = $match.find('.ds-text-tight-xs').first().text().trim();
          const dateTime = $match.find('.ds-text-tight-xs').last().text().trim();
          
          if (teams.length >= 2) {
            matches.push({
              id: `live-${index}`,
              team1: teams[0],
              team2: teams[1],
              venue,
              date: this.extractDate(dateTime),
              time: this.extractTime(dateTime),
              status: 'live',
              liveScore: this.extractLiveScore($match)
            });
          }
        }
      });

      return {
        data: matches,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error scraping live matches:', error);
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async scrapeUpcomingMatches(): Promise<ScrapingResult<MatchData>> {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const matches: MatchData[] = [];

      // Look for upcoming matches
      $('.ds-bg-fill-content-prime.ds-rounded-lg').each((index, element) => {
        const $match = $(element);
        const status = $match.find('.ds-text-tight-s').text().toLowerCase();
        
        if (status.includes('upcoming') || status.includes('tomorrow') || status.includes('today')) {
          const teams = $match.find('.ds-text-tight-l').map((i, el) => $(el).text().trim()).get();
          const venue = $match.find('.ds-text-tight-xs').first().text().trim();
          const dateTime = $match.find('.ds-text-tight-xs').last().text().trim();
          
          if (teams.length >= 2) {
            matches.push({
              id: `upcoming-${index}`,
              team1: teams[0],
              team2: teams[1],
              venue,
              date: this.extractDate(dateTime),
              time: this.extractTime(dateTime),
              status: 'upcoming'
            });
          }
        }
      });

      return {
        data: matches,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error scraping upcoming matches:', error);
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

  private extractLiveScore($match: cheerio.Cheerio<cheerio.Element>): MatchData['liveScore'] {
    try {
      const scores = $match.find('.ds-text-tight-m').map((i, el) => $(el).text().trim()).get();
      
      if (scores.length >= 2) {
        const team1Score = this.parseScore(scores[0]);
        const team2Score = this.parseScore(scores[1]);
        
        return {
          team1: team1Score,
          team2: team2Score,
          currentBatsman: $match.find('.ds-text-tight-xs').eq(2).text().trim() || undefined,
          currentBowler: $match.find('.ds-text-tight-xs').eq(3).text().trim() || undefined
        };
      }
    } catch (error) {
      console.error('Error extracting live score:', error);
    }
    
    return undefined;
  }

  private parseScore(scoreText: string): { runs: number; wickets: number; overs: number } {
    // Parse score like "120/3 (15.2)" or "89/2 (12.0)"
    const match = scoreText.match(/(\d+)\/(\d+)\s*\((\d+\.?\d*)\)/);
    if (match) {
      return {
        runs: parseInt(match[1]),
        wickets: parseInt(match[2]),
        overs: parseFloat(match[3])
      };
    }
    
    return { runs: 0, wickets: 0, overs: 0 };
  }
}
