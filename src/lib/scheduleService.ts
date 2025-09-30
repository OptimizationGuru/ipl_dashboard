import { ScheduleData } from '@/types';
import { ScheduleScraper } from './scrapers/scheduleScraper';
import { dummySchedule } from './dummyDataNew';

export async function getSchedule(year: string = '2025'): Promise<ScheduleData[]> {
  try {
    // Try scraping directly (not HTTP request to own API)
    const scraper = new ScheduleScraper();
    const result = await scraper.scrapeSchedule(year);
    
    if (result.success && result.data && result.data.length > 0) {
      return result.data;
    }
  } catch (scrapingError) {
    console.log('Schedule scraping failed, using dummy data');
  }

  // Fallback to dummy data
  return dummySchedule;
}
