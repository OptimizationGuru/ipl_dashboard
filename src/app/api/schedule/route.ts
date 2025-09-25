import { NextRequest, NextResponse } from 'next/server';
import { ScheduleScraper } from '@/lib/scrapers/scheduleScraper';
import { getCachedData, setCachedData } from '@/lib/cache';
import { dummySchedule } from '@/lib/dummyDataNew';
import { generateSchedule } from '@/lib/dynamicDataNew';
import { ScheduleData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Try to get cached data first
    const cacheKey = 'schedule_data';
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Returning cached schedule data');
      return NextResponse.json({
        data: cachedData,
        success: true,
        cached: true,
        timestamp: Date.now()
      });
    }

    // Try scraping first
    console.log('Attempting to scrape schedule data...');
    const scraper = new ScheduleScraper();
    const scrapingResult = await scraper.scrapeSchedule();
    
    if (scrapingResult.success && scrapingResult.data.length > 0) {
      console.log(`Successfully scraped ${scrapingResult.data.length} matches`);
      await setCachedData(cacheKey, scrapingResult.data, 3600); // Cache for 1 hour
      
      return NextResponse.json({
        data: scrapingResult.data,
        success: true,
        cached: false,
        source: 'scraped',
        timestamp: Date.now()
      });
    }

    // Fallback to static dummy data (10 matches)
    console.log('Scraping failed, using static dummy schedule data...');
    console.log(`Using ${dummySchedule.length} static matches`);
    
    // Cache the static data for 30 minutes
    await setCachedData(cacheKey, dummySchedule, 1800);
    
    return NextResponse.json({
      data: dummySchedule,
      success: true,
      cached: false,
      fallback: true,
      source: 'static',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('API error:', error);
    
    // Final fallback to static dummy data
    console.log('All methods failed, using static dummy data');
    return NextResponse.json({
      data: dummySchedule,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      source: 'static',
      timestamp: Date.now()
    }, { status: 500 });
  }
}
