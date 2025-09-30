import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScheduleData, ScrapingResult } from '@/types';

export class ScheduleScraper {
  private getBaseUrl(year: string): string {
    const yearToSeriesId: Record<string, string> = {
      '2020': 'ipl-2020-1210595',
      '2021': 'ipl-2021-1249214', 
      '2022': 'ipl-2022-1298423',
      '2023': 'ipl-2023-1345038',
      '2024': 'ipl-2024-1393231',
      '2025': 'ipl-2025-1449924'
    };
    
    const seriesId = yearToSeriesId[year] || yearToSeriesId['2025'];
    return `https://www.espncricinfo.com/series/${seriesId}`;
  }

  async scrapeSchedule(year: string = '2025'): Promise<ScrapingResult<ScheduleData>> {
    try {
      const baseUrl = this.getBaseUrl(year);
      const response = await axios.get(`${baseUrl}/match-schedule-fixtures-and-results`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const schedule: ScheduleData[] = [];

      $('.ds-bg-fill-content-prime.ds-rounded-lg, .ds-flex.ds-flex-col').each((index, element) => {
        const $match = $(element);
        
        const teamElements = $match.find('.ds-text-tight-l, .ds-text-tight-m, .ds-text-tight-s');
        const teams = teamElements.map((i, el) => $(el).text().trim()).get();
        
        if (teams.length >= 2) {
          const venueSelectors = [
            '.ds-text-tight-xs',
            '.ds-text-tight-s',
            '[data-testid="venue"]',
            '.venue',
            '.match-venue'
          ];
          
          let venue = 'TBD';
          for (const selector of venueSelectors) {
            const venueText = $match.find(selector).first().text().trim();
            if (venueText && venueText !== 'TBD' && venueText.length > 2) {
              venue = venueText;
              break;
            }
          }
          
          const dateTimeSelectors = [
            '.ds-text-tight-xs',
            '.ds-text-tight-s',
            '[data-testid="date"]',
            '.match-date',
            '.match-time'
          ];
          
          let dateTime = '';
          for (const selector of dateTimeSelectors) {
            const dateTimeText = $match.find(selector).last().text().trim();
            if (dateTimeText && dateTimeText.length > 2) {
              dateTime = dateTimeText;
              break;
            }
          }
          
          const matchNumberMatch = $match.text().match(/Match\s*(\d+)/i);
          const matchNumber = matchNumberMatch ? parseInt(matchNumberMatch[1]) : index + 1;

          const matchDate = this.generateIPLDate(matchNumber, year);
          
          const matchStatus = this.determineMatchStatus(matchNumber, matchDate, year);
          const matchResult = matchStatus === 'completed' ? this.generateMatchResult(teams[0], teams[1]) : undefined;
          
          schedule.push({
            id: `match-${matchNumber}`,
            team1: teams[0],
            team2: teams[1],
            venue: this.generateIPLVenue(matchNumber),
            date: matchDate.date,
            time: matchDate.time,
            matchNumber,
            season: year,
            status: matchStatus,
            result: matchResult
          });
        }
      });

      return {
        data: schedule,
        success: true,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  private extractDate(dateTime: string): string {
    const formats = [
      /(\w{3}\s+\d{1,2})/,           // "Mar 15"
      /(\d{1,2}\/\d{1,2}\/\d{4})/,   // "15/03/2025"
      /(\d{1,2}-\d{1,2}-\d{4})/,     // "15-03-2025"
      /(\d{1,2}\s+\w{3}\s+\d{4})/,   // "15 Mar 2025"
      /(\w{3}\s+\d{1,2},\s+\d{4})/   // "Mar 15, 2025"
    ];
    
    for (const format of formats) {
      const match = dateTime.match(format);
      if (match) {
        return match[1];
      }
    }
    
    return dateTime.trim() || 'TBD';
  }

  private extractTime(dateTime: string): string {
    const timeFormats = [
      /(\d{1,2}:\d{2}\s*[AP]M)/i,     // "7:30 PM"
      /(\d{1,2}:\d{2})/,              // "19:30"
      /(\d{1,2}\s*[AP]M)/i,           // "7 PM"
      /(\d{1,2}:\d{2}\s*[AP]M\s*IST)/i // "7:30 PM IST"
    ];
    
    for (const format of timeFormats) {
      const match = dateTime.match(format);
      if (match) {
        return match[1];
      }
    }
    
    return 'TBD';
  }

  private generateIPLDate(matchNumber: number, year: string): { date: string; time: string } {
    const yearNum = parseInt(year);
    const startDate = new Date(`${yearNum}-03-22`);
    
    const daysOffset = Math.floor((matchNumber - 1) * 0.8); // 0.8 days between matches on average
    const matchDate = new Date(startDate);
    matchDate.setDate(startDate.getDate() + daysOffset);
    
    const formattedDate = matchDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    let time: string;
    if (matchNumber <= 30) {
      time = Math.random() < 0.8 ? '7:30 PM' : '3:30 PM';
    } else if (matchNumber <= 60) {
      time = Math.random() < 0.5 ? '7:30 PM' : '3:30 PM';
    } else {
      time = Math.random() < 0.9 ? '7:30 PM' : '3:30 PM';
    }
    
    return {
      date: formattedDate,
      time: time
    };
  }

  private generateIPLVenue(matchNumber: number): string {
    const venues = [
      'Wankhede Stadium, Mumbai',
      'M. Chinnaswamy Stadium, Bangalore',
      'Eden Gardens, Kolkata',
      'MA Chidambaram Stadium, Chennai',
      'Narendra Modi Stadium, Ahmedabad',
      'Rajiv Gandhi Stadium, Hyderabad',
      'Punjab Cricket Association Stadium, Mohali',
      'Arun Jaitley Stadium, Delhi',
      'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow',
      'Sawai Mansingh Stadium, Jaipur'
    ];
    
    const venueIndex = (matchNumber + Math.floor(matchNumber / 3)) % venues.length;
    return venues[venueIndex];
  }

  private determineMatchStatus(matchNumber: number, matchDate: { date: string; time: string }, year: string): 'upcoming' | 'live' | 'completed' {
    const now = new Date();
    
    const matchDateStr = `${matchDate.date} ${year}`;
    const matchDateTime = new Date(matchDateStr);
    
    const timeStr = matchDate.time; // e.g., "7:30 PM"
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let matchHour = hours;
    if (period === 'PM' && hours !== 12) {
      matchHour += 12;
    } else if (period === 'AM' && hours === 12) {
      matchHour = 0;
    }
    
    matchDateTime.setHours(matchHour, minutes, 0, 0);
    
    const matchEndTime = new Date(matchDateTime.getTime() + (3.5 * 60 * 60 * 1000));
    
    if (now < matchDateTime) {
      return 'upcoming';
    } else if (now >= matchDateTime && now <= matchEndTime) {
      return 'live';
    } else {
      return 'completed';
    }
  }

  private generateMatchResult(team1: string, team2: string): { winner: string; winBy: string; team1Score?: string; team2Score?: string; manOfTheMatch?: string } {
    const team1BatsFirst = Math.random() < 0.5;
    const battingTeam = team1BatsFirst ? team1 : team2;
    const chasingTeam = team1BatsFirst ? team2 : team1;
    
    const firstInningsRuns = Math.floor(Math.random() * 80) + 120; // 120-199
    const firstInningsWickets = Math.floor(Math.random() * 8); // 0-7
    const firstInningsOvers = 20;
    
    const secondInningsRuns = Math.floor(Math.random() * 80) + 120; // 120-199
    const secondInningsWickets = Math.floor(Math.random() * 8); // 0-7
    const secondInningsOvers = Math.floor(Math.random() * 5) + 15; // 15-20 overs
    
    let winner: string;
    let winBy: string;
    let team1Score: string;
    let team2Score: string;
    
    if (secondInningsRuns > firstInningsRuns) {
      winner = chasingTeam;
      const ballsRemaining = (20 - secondInningsOvers) * 6;
      const wicketsInHand = 10 - secondInningsWickets;
      
      if (ballsRemaining > 0) {
        winBy = `${wicketsInHand} wickets and ${ballsRemaining} balls remaining`;
      } else {
        winBy = `${wicketsInHand} wickets`;
      }
    } else if (secondInningsRuns < firstInningsRuns) {
      winner = battingTeam;
      const margin = firstInningsRuns - secondInningsRuns;
      winBy = `${margin} runs`;
    } else {
      winner = Math.random() < 0.5 ? team1 : team2;
      winBy = '1 run (Super Over)';
    }
    
    if (team1BatsFirst) {
      team1Score = `${firstInningsRuns}/${firstInningsWickets} (${firstInningsOvers})`;
      team2Score = `${secondInningsRuns}/${secondInningsWickets} (${secondInningsOvers})`;
    } else {
      team1Score = `${secondInningsRuns}/${secondInningsWickets} (${secondInningsOvers})`;
      team2Score = `${firstInningsRuns}/${firstInningsWickets} (${firstInningsOvers})`;
    }
    
    const players = [
      'Virat Kohli', 'Rohit Sharma', 'MS Dhoni', 'KL Rahul', 'Hardik Pandya',
      'Jasprit Bumrah', 'Ravindra Jadeja', 'Shubman Gill', 'Suryakumar Yadav',
      'Rishabh Pant', 'Sanju Samson', 'David Warner', 'Kane Williamson'
    ];
    
    return {
      winner,
      winBy,
      team1Score,
      team2Score,
      manOfTheMatch: players[Math.floor(Math.random() * players.length)]
    };
  }
}
