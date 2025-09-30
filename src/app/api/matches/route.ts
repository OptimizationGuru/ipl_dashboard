import { NextRequest, NextResponse } from 'next/server';
import { DynamicDataService } from '@/services/DynamicDataService';
import { getCachedData, setCachedData } from '@/lib/cache';
import { MatchData } from '@/types';

// Dynamic route for live updates
export const dynamic = 'force-static';

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
    
    // 2. Use DynamicDataService to generate live match data
    const dynamicService = DynamicDataService.getInstance();
    let matches: MatchData[] = [];
    
    if (type === 'live') {
      // Get current live match or generate new one if none exists
      let liveMatch = dynamicService.getCurrentLiveMatch();
      if (!liveMatch) {
        liveMatch = dynamicService.generateLiveMatch();
      }
      matches = [liveMatch];
    } else if (type === 'upcoming') {
      // Generate upcoming matches (for now, just create one upcoming match)
      const upcomingMatch = dynamicService.generateUpcomingMatch();
      matches = [upcomingMatch];
    } else {
      // For 'all', get current live match or generate new one, plus upcoming
      let liveMatch = dynamicService.getCurrentLiveMatch();
      if (!liveMatch) {
        liveMatch = dynamicService.generateLiveMatch();
      }
      const upcomingMatch = dynamicService.generateUpcomingMatch();
      matches = [liveMatch, upcomingMatch];
    }

    // Cache the dynamic data for shorter time
    await setCachedData(cacheKey, matches, 60); // Cache for 1 minute

    console.log(`Returning dynamic data for matches type: ${type}, count: ${matches.length}`);

    return NextResponse.json({
      data: matches,
      success: true,
      cached: false,
      dynamic: true,
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
    
    // Final fallback: try to generate basic match data
    console.log('Error occurred, attempting to generate basic match data');
    
    try {
      const dynamicService = DynamicDataService.getInstance();
      const fallbackMatch = dynamicService.generateLiveMatch();
      
      return NextResponse.json({
        data: [fallbackMatch],
        success: true,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true,
        timestamp: Date.now()
      });
    } catch (fallbackError) {
      console.error('Fallback generation failed:', fallbackError);
      
      return NextResponse.json({
        data: [],
        success: false,
        error: 'Unable to generate match data',
        timestamp: Date.now()
      }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json().catch(() => ({}));
    
    const dynamicService = DynamicDataService.getInstance();
    
    if (action === 'reset') {
      // Reset match with optional team selection
      const { random, team1, team2 } = body;
      
      if (random) {
        dynamicService.forceRandomTeams();
      } else if (team1 && team2) {
        dynamicService.setTeams(team1, team2);
      }
      
      const newMatch = dynamicService.resetMatch();
      
      // Clear cache to force fresh data
      const cacheKey = `matches:all`;
      await setCachedData(cacheKey, null, 0);
      
      return NextResponse.json({
        success: true,
        data: [newMatch],
        message: 'Match data reset successfully',
        timestamp: Date.now()
      });
    }
    
    if (action === 'nextBall') {
      // Generate next ball event
      const updatedMatch = dynamicService.updateLiveMatch();
      
      return NextResponse.json({
        success: true,
        data: [updatedMatch],
        message: 'Next ball generated',
        timestamp: Date.now()
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action',
      timestamp: Date.now()
    }, { status: 400 });
    
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 500 });
  }
}
