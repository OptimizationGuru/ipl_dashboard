import { NextRequest, NextResponse } from 'next/server';
import { PointsTableScraper } from '@/lib/scrapers/pointsTableScraper';
import { getCachedData, setCachedData } from '@/lib/cache';
import { dummyPointsTable } from '@/lib/dummyData';
import { PointsTableData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // For now, immediately return dummy data to avoid scraping timeouts
    console.log('Returning dummy data for points table');
    
    return NextResponse.json({
      data: dummyPointsTable,
      success: true,
      cached: false,
      fallback: true,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      data: dummyPointsTable,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      timestamp: Date.now()
    }, { status: 500 });
  }
}
