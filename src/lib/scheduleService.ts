import { ScheduleData } from '@/types';

export async function getSchedule(): Promise<ScheduleData[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('Fetching schedule from:', `${baseUrl}/api/schedule`);
    const response = await fetch(`${baseUrl}/api/schedule`, {
      next: { revalidate: 0 } // No caching for testing
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch schedule');
    }
    
    const data = await response.json();
    console.log('Schedule data:', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return [];
  }
}
