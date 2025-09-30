/**
 * ESPN Cricinfo API Service
 * 
 * Main service that orchestrates API calls and data transformation
 */

import { MatchData, PointsTableData, ScheduleData } from '@/types';
import { ESPNApiClient, ESPNApiResponse } from './ESPNApiClient';
import { ESPNDataTransformer } from './ESPNDataTransformer';

export interface ESPNServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ESPNApiService {
  private apiClient: ESPNApiClient;
  private dataTransformer: ESPNDataTransformer;

  constructor() {
    this.apiClient = new ESPNApiClient();
    this.dataTransformer = new ESPNDataTransformer();
  }

  /**
   * Get current/live matches
   */
  async getCurrentMatches(): Promise<ESPNServiceResponse<MatchData[]>> {
    try {
      const response = await this.apiClient.getCurrentMatches();
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch current matches'
        };
      }

      const transformedData = this.dataTransformer.transformMatchesData(response.data);
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('ESPN Service Error (getCurrentMatches):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(): Promise<ESPNServiceResponse<MatchData[]>> {
    try {
      const response = await this.apiClient.getUpcomingMatches();
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch upcoming matches'
        };
      }

      const transformedData = this.dataTransformer.transformMatchesData(response.data);
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('ESPN Service Error (getUpcomingMatches):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get points table for a series
   */
  async getPointsTable(seriesId: string): Promise<ESPNServiceResponse<PointsTableData[]>> {
    try {
      const response = await this.apiClient.getPointsTable(seriesId);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch points table'
        };
      }

      const transformedData = this.dataTransformer.transformPointsTableData(response.data);
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('ESPN Service Error (getPointsTable):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get series details
   */
  async getSeriesDetails(seriesId: string): Promise<ESPNServiceResponse<any>> {
    try {
      const response = await this.apiClient.getSeriesDetails(seriesId);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch series details'
        };
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('ESPN Service Error (getSeriesDetails):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get match details
   */
  async getMatchDetails(matchId: string): Promise<ESPNServiceResponse<MatchData>> {
    try {
      const response = await this.apiClient.getMatchDetails(matchId);
      
      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Failed to fetch match details'
        };
      }

      const transformedData = this.dataTransformer.transformMatchesData([response.data])[0];
      
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('ESPN Service Error (getMatchDetails):', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if ESPN API is available
   */
  async isAvailable(): Promise<boolean> {
    return this.apiClient.isAvailable();
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    this.apiClient.setAuthToken(token);
  }

  /**
   * Check if auth token is available
   */
  hasAuthToken(): boolean {
    return this.apiClient.hasAuthToken();
  }

  /**
   * Get API client instance (for advanced usage)
   */
  getApiClient(): ESPNApiClient {
    return this.apiClient;
  }

  /**
   * Get data transformer instance (for advanced usage)
   */
  getDataTransformer(): ESPNDataTransformer {
    return this.dataTransformer;
  }
}
