const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const api = {
  // Website blocking
  getBlockedWebsites: () => fetchWithAuth('/websites/blocked'),
  addBlockedWebsite: (url: string, category?: string) =>
    fetchWithAuth('/websites/block', {
      method: 'POST',
      body: JSON.stringify({ url, category }),
    }),
  removeBlockedWebsite: (websiteId: string) =>
    fetchWithAuth(`/websites/block/${websiteId}`, {
      method: 'DELETE',
    }),

  // Focus schedules
  getFocusSchedules: () => fetchWithAuth('/focus/schedules'),
  addFocusSchedule: (schedule: any) =>
    fetchWithAuth('/focus/schedule', {
      method: 'POST',
      body: JSON.stringify(schedule),
    }),
  updateFocusSchedule: (scheduleId: string, schedule: any) =>
    fetchWithAuth(`/focus/schedule/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    }),
};