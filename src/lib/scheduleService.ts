import { ScheduleData } from '@/types';

export async function getSchedule(year: string = '2025'): Promise<ScheduleData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/schedule?year=${year}`, {
      next: { revalidate: 0 } // No caching for testing
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}
