import axios from 'axios';

const API_ENDPOINTS = {
  today: 'https://endpoapi-production-3202.up.railway.app/api/calendar/today',
  thisWeek: 'https://endpoapi-production-3202.up.railway.app/api/calendar/this-week',
  nextWeek: 'https://endpoapi-production-3202.up.railway.app/api/calendar/next-week',
  previousWeek: 'https://endpoapi-production-3202.up.railway.app/api/calendar/previous-week',
} as const;

export type EconomicCalendarFilter = keyof typeof API_ENDPOINTS;

export interface EconomicEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  country: string;
  impact: string; // "?", "??", "???" or "Low/Medium/High"
  figures: string; // event name/title
  previous?: string;
  forecast?: string;
  actual?: string;
  details?: EconomicEventDetails;
}

export interface EconomicEventDetails {
  sources?: string;
  measures?: string;
  usualEffect?: string;
  frequency?: string;
  nextReleased?: string;
  notes?: string;
  whyTraderCare?: string;
  history?: Array<{
    date?: string;
    previous?: string;
    forecast?: string;
    actual?: string;
  }>;
}

interface ApiEvent {
  time: string;
  currency: string;
  impact?: string;
  event: string;
  previous?: string;
  forecast?: string;
  actual?: string;
  date?: string;
  details?: EconomicEventDetails;
}

interface ApiResponse {
  status: string;
  data: ApiEvent[];
}

const getLocalISODate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeTime = (rawTime: string) => {
  if (!rawTime) return '';
  // Some endpoints return "YYYY-MM-DD HH.mm", strip date prefix if present.
  return rawTime.replace(/^\d{4}-\d{2}-\d{2}\s+/, '');
};

export const fetchEconomicCalendar = async (
  filter: EconomicCalendarFilter = 'today',
): Promise<EconomicEvent[]> => {
  const url = API_ENDPOINTS[filter] ?? API_ENDPOINTS.today;
  const fallbackDate = getLocalISODate();

  const response = await axios.get<ApiResponse>(url, { timeout: 30000 });
  if (response.data?.status !== 'success' || !Array.isArray(response.data?.data)) {
    throw new Error('Failed to fetch economic calendar data');
  }

  return response.data.data.map((item, index) => {
    const date = item.date || fallbackDate;
      return {
        id: `${filter}-${date}-${index}`,
        date,
        time: normalizeTime(item.time),
        country: String(item.currency || '').trim(),
        impact: String(item.impact || '').trim(),
        figures: item.event,
        previous: item.previous,
        forecast: item.forecast,
        actual: item.actual,
        details: item.details,
      };
  });
};
