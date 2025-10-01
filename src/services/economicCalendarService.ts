import axios from 'axios';

const API_URL = 'https://portalnews.newsmaker.id/api/v1/kalender-ekonomi';
const TOKEN = 'BPF-91e516ac4fe2e8ae';

export interface EconomicEvent {
  id: number;
  sources: string;
  measures: string;
  usual_effect: string;
  frequency: string;
  next_released: string;
  notes: string | null;
  why_trader_care: string | null;
  date: string;
  time: string;
  country: string;
  impact: 'High' | 'Medium' | 'Low';
  figures: string;
  previous: string;
  forecast: string;
  actual: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  status: string;
  data: EconomicEvent[];
}

export const fetchEconomicCalendar = async (): Promise<EconomicEvent[]> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`
      }
    });
    
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error('Failed to fetch economic calendar data');
  } catch (error) {
    console.error('Error fetching economic calendar:', error);
    throw error;
  }
};