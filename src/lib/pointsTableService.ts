import { PointsTableData } from '@/types';

export async function getPointsTable(year: string = '2025'): Promise<PointsTableData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/points-table?year=${year}`, {
      next: { revalidate: 0 } // No caching for testing
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch points table');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching points table:', error);
    return [];
  }
}
