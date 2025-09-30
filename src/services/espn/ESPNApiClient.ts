/**
 * ESPN Cricinfo API Client
 * 
 * Handles HTTP requests and authentication for ESPN Cricinfo APIs
 */

export interface ESPNApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ESPNApiClient {
  private baseUrl = 'https://hs-consumer-api.espncricinfo.com/v1';
  private authToken: string | null = null;

  constructor() {
    this.authToken = process.env.ESPN_AUTH_TOKEN || null;
  }

  /**
   * Make authenticated request to ESPN API
   */
  async makeRequest<T>(endpoint: string): Promise<ESPNApiResponse<T>> {
    try {
      if (!this.authToken) {
        throw new Error('No auth token available');
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'origin': 'https://www.espncricinfo.com',
          'referer': 'https://www.espncricinfo.com/',
          'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
          'x-hsci-auth-token': this.authToken
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('ESPN API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get current/live matches
   */
  async getCurrentMatches(): Promise<ESPNApiResponse> {
    return this.makeRequest('/pages/matches/live?lang=en');
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(): Promise<ESPNApiResponse> {
    return this.makeRequest('/pages/matches/upcoming?lang=en');
  }

  /**
   * Get points table for a series
   */
  async getPointsTable(seriesId: string): Promise<ESPNApiResponse> {
    return this.makeRequest(`/pages/series/${seriesId}/points-table?lang=en`);
  }

  /**
   * Get series details
   */
  async getSeriesDetails(seriesId: string): Promise<ESPNApiResponse> {
    return this.makeRequest(`/pages/series/${seriesId}?lang=en`);
  }

  /**
   * Get match details
   */
  async getMatchDetails(matchId: string): Promise<ESPNApiResponse> {
    return this.makeRequest(`/pages/match/${matchId}?lang=en`);
  }

  /**
   * Check if API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await this.getCurrentMatches();
      return response.success;
    } catch {
      return false;
    }
  }

  /**
   * Set auth token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get current auth token status
   */
  hasAuthToken(): boolean {
    return this.authToken !== null;
  }
}
