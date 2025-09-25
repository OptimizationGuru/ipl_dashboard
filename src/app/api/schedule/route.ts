import { NextRequest, NextResponse } from 'next/server';
import { ScheduleScraper } from '@/lib/scrapers/scheduleScraper';
import { getCachedData, setCachedData } from '@/lib/cache';
import { dummySchedule } from '@/lib/dummyDataNew';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || '2025';
    
    const validYears = ['2020', '2021', '2022', '2023', '2024', '2025'];
    if (!validYears.includes(year)) {
      return NextResponse.json({
        data: [],
        success: false,
        error: `Invalid year. Please choose from: ${validYears.join(', ')}`,
        timestamp: Date.now()
      }, { status: 400 });
    }
    
    const cacheKey = `schedule_data_${year}`;
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      return NextResponse.json({
        data: cachedData,
        success: true,
        cached: true,
        timestamp: Date.now()
      });
    }

    const scraper = new ScheduleScraper();
    const scrapingResult = await scraper.scrapeSchedule(year);
    
    if (scrapingResult.success && scrapingResult.data.length > 0) {
      await setCachedData(cacheKey, scrapingResult.data, 3600);
      
      return NextResponse.json({
        data: scrapingResult.data,
        success: true,
        cached: false,
        source: 'scraped',
        timestamp: Date.now()
      });
    }

    
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
