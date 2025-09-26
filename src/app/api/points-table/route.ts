import { NextRequest, NextResponse } from 'next/server';
import { ESPNApiClient } from '../../../lib/espnApiClient';
import { DynamicDataGenerator } from '../../../lib/dynamicDataGenerator';
import { getCachedData, setCachedData } from '../../../lib/cache';

// Required for static export
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  // Get year parameter from query string
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year') || '2025';
  const cacheKey = `points_table_${year}`;
  
  try {
    
    // Validate year (2020-2025)
    const validYears = ['2020', '2021', '2022', '2023', '2024', '2025'];
    if (!validYears.includes(year)) {
      return NextResponse.json({
        data: [],
        success: false,
        error: `Invalid year. Please choose from: ${validYears.join(', ')}`,
        timestamp: Date.now()
      }, { status: 400 });
    }
    
    // Try to get cached data first
    const cachedData = await getCachedData(cacheKey);
    
    if (cachedData) {
      return NextResponse.json({
        data: cachedData,
        success: true,
        cached: true,
        timestamp: Date.now()
      });
    }

    // Try ESPN API as primary source
    try {
      const espnClient = new ESPNApiClient();
      const espnData = await espnClient.fetchPointsTable(year);
      
      if (espnData && espnData.length > 0) {
        await setCachedData(cacheKey, espnData, 3600); // Cache for 1 hour
        
        return NextResponse.json({
          data: espnData,
          success: true,
          cached: false,
          source: 'espn-api',
          timestamp: Date.now()
        });
      }
    } catch (espnError) {
      console.log('ESPN API failed, using dynamic data generation');
    }

    // Fallback to dynamic data generation
    return generateFallbackResponse(cacheKey, year);

  } catch (error) {
    console.error('API error:', error);
    return generateFallbackResponse(cacheKey, year, error instanceof Error ? error : undefined);
  }
}

// Helper function to generate fallback response
async function generateFallbackResponse(cacheKey: string, year: string, error?: Error) {
  const dataGenerator = new DynamicDataGenerator();
  const dynamicData = dataGenerator.generatePointsTable(year);
  
  // Cache the dynamic data for 30 minutes
  await setCachedData(cacheKey, dynamicData, 1800);
  
  return NextResponse.json({
    data: dynamicData,
    success: error ? false : true,
    cached: false,
    fallback: true,
    source: 'dynamic-generated',
    error: error ? error.message : undefined,
    timestamp: Date.now()
  }, { status: error ? 500 : 200 });
}
