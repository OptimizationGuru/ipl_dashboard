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
    
    // Use dynamic data generator for live updates
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

    console.log(`Returning dynamic data for matches type: ${type}, count: ${matches.length}`);

    return NextResponse.json({
      data: matches,
      success: true,
      cached: false,
      dynamic: true,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json({
      data: dummyMatches,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
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
