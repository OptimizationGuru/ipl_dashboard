import { NextRequest, NextResponse } from 'next/server';
import { MatchScraper } from '@/lib/scrapers/matchScraper';
import { getCachedData, setCachedData } from '@/lib/cache';
import { dummyMatches } from '@/lib/dummyData';
import { DynamicDataGenerator } from '@/lib/dynamicData';
import { MatchData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'live', 'upcoming', or 'all'
    
    // 1. Try to get cached data first
    const cacheKey = `matches:${type}`;
    const cachedData = await getCachedData<MatchData[]>(cacheKey);
    
    if (cachedData) {
      console.log(`Returning cached data for matches type: ${type}, count: ${cachedData.length}`);
      return NextResponse.json({
        data: cachedData,
        success: true,
        cached: true,
        timestamp: Date.now()
      });
    }
    
    // 2. Try to scrape real IPL data
    const scraper = new MatchScraper();
    let scrapedData;
    
    if (type === 'live') {
      scrapedData = await scraper.scrapeLiveMatches();
    } else if (type === 'upcoming') {
      scrapedData = await scraper.scrapeUpcomingMatches();
    } else {
      // For 'all', try to get both live and upcoming
      const [liveResult, upcomingResult] = await Promise.all([
        scraper.scrapeLiveMatches(),
        scraper.scrapeUpcomingMatches()
      ]);
      
      scrapedData = {
        data: [...liveResult.data, ...upcomingResult.data],
        success: liveResult.success || upcomingResult.success,
        timestamp: Date.now()
      };
    }
    
    // 3. If scraping succeeded, cache and return real data
    if (scrapedData.success && scrapedData.data.length > 0) {
      await setCachedData(cacheKey, scrapedData.data, 300); // Cache for 5 minutes
      console.log(`Returning scraped data for matches type: ${type}, count: ${scrapedData.data.length}`);
      
      return NextResponse.json({
        data: scrapedData.data,
        success: true,
        cached: false,
        scraped: true,
        timestamp: Date.now()
      });
    }
    
    // 4. If scraping failed, use dynamic data generator as fallback
    console.log(`Scraping failed for ${type}, using dynamic data generator as fallback`);
    const dataGenerator = DynamicDataGenerator.getInstance();
    let matches: MatchData[] = [];
    
    if (type === 'live') {
      const liveMatch = dataGenerator.generateLiveMatch();
      matches = [liveMatch];
    } else if (type === 'upcoming') {
      matches = dataGenerator.generateUpcomingMatches();
    } else {
      matches = dataGenerator.generateAllMatches();
    }

    // Cache the fallback data for shorter time
    await setCachedData(cacheKey, matches, 60); // Cache for 1 minute

    console.log(`Returning dynamic fallback data for matches type: ${type}, count: ${matches.length}`);

    return NextResponse.json({
      data: matches,
      success: true,
      cached: false,
      dynamic: true,
      fallback: true,
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('API error:', error);
    
    // 5. Final fallback: use static dummy data
    console.log('All methods failed, using static dummy data as final fallback');
    
    return NextResponse.json({
      data: dummyMatches,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      static: true,
      timestamp: Date.now()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'reset') {
      const dataGenerator = DynamicDataGenerator.getInstance();
      const batFirst = searchParams.get('batFirst');
      
      if (batFirst === 'MI' || batFirst === 'CSK') {
        dataGenerator.resetMatchWithTeamSelection(batFirst);
        return NextResponse.json({
          success: true,
          message: `Match reset successfully with ${batFirst} batting first`,
          timestamp: Date.now()
        });
      } else {
        dataGenerator.resetMatch();
        return NextResponse.json({
          success: true,
          message: 'Match reset successfully',
          timestamp: Date.now()
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action',
      timestamp: Date.now()
    }, { status: 400 });
    
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 500 });
  }
}
