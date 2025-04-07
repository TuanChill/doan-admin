export const APP_URL = {
  MANAGEMENT: {
    TOKEN_MANAGEMENT: '/management/token-management',
  },
  LOGIN: '/login',
};

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const API_ROUTES = {
  LOGIN: `${API_BASE}/auth/local`,
  REGISTER: `${API_BASE}/auth/local/register`,
  FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  SEND_CONTACT: `${API_BASE}/contact`,
  ME: `${API_BASE}/users/me`,
  USERS: `${API_BASE}/users`,
  EXHIBIT: `${API_BASE}/exhibits`,
  CATEGORY_ARTIFACT: `${API_BASE}/category-artifacts`,
  CATEGORY: `${API_BASE}/categories`,
  POST: `${API_BASE}/posts`,
  TAG: `${API_BASE}/tags`,
  UPLOAD: `${API_BASE}/upload`,
  HISTORY_SEARCH: `${API_BASE}/history-searches`,
  INVOICE: `${API_BASE}/invoices`,
  INVOICE_DETAIL: `${API_BASE}/invoice-details`,
  EMAIL_SERVICE: `${API_BASE}/email`,
  ACTIVITY_POINTS: `${API_BASE}/actions`,
  TICKETS: `${API_BASE}/tickets`,
};
