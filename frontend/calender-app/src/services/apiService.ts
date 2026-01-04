import { Api } from "../CalendarApi";

const API_BASE_URL = "http://localhost:5000";
const ADMIN_TOKEN = "admin-secret-token-2026";

/**
 * Creates an API instance with proper authentication headers
 */
export function createApiClient() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const headers: Record<string, string> = {};
  
  // Add employee ID header if user is logged in
  if (user.id) {
    headers['X-Employee-Id'] = user.id.toString();
  }
  
  // Add admin token if user is admin
  if (user.isAdmin) {
    headers['X-ADMIN'] = ADMIN_TOKEN;
  }
  
  return new Api({
    baseUrl: API_BASE_URL,
    baseApiParams: {
      headers
    }
  });
}

/**
 * Creates an API instance with admin token (for admin-only operations)
 */
export function createAdminApiClient() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return new Api({
    baseUrl: API_BASE_URL,
    baseApiParams: {
      headers: {
        'X-ADMIN': ADMIN_TOKEN,
        'X-Employee-Id': user.id?.toString() || ''
      }
    }
  });
}

/**
 * Creates a basic API instance for public endpoints (like login)
 */
export function createPublicApiClient() {
  return new Api({
    baseUrl: API_BASE_URL
  });
}

export { API_BASE_URL };
