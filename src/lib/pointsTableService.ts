import { PointsTableData } from '@/types';
import { ESPNApiClient } from './espnApiClient';
import { DynamicDataGenerator } from './dynamicDataGenerator';

export async function getPointsTable(year: string = '2025'): Promise<PointsTableData[]> {
  try {
    // Try ESPN API directly (not HTTP request to own API)
    const espnClient = new ESPNApiClient();
    const espnData = await espnClient.fetchPointsTable(year);
    
    if (espnData && espnData.length > 0) {
      return espnData;
    }
  } catch (espnError) {
    console.log('ESPN API failed, using dynamic data generation');
  }

  // Fallback to dynamic data generation
  const dataGenerator = new DynamicDataGenerator();
  return dataGenerator.generatePointsTable(year);
}
