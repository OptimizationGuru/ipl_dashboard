import { NextRequest, NextResponse } from 'next/server';
import { ScheduleScraper } from '@/lib/scrapers/scheduleScraper';
import { getCachedData, setCachedData } from '@/lib/cache';
import { dummySchedule } from '@/lib/dummyData';
import { ScheduleData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // For now, immediately return dummy data to avoid scraping timeouts
    console.log('Returning dummy data for schedule');
    
    return NextResponse.json({
      data: dummySchedule,
      success: true,
      cached: false,
      fallback: true,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      data: dummySchedule,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      timestamp: Date.now()
    }, { status: 500 });
  }
}
