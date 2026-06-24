// In dev the frontend runs on :3000 and backend on :8000; in production they share the same origin.
export const API_BASE =
  typeof window !== 'undefined' && window.location.port === '3000'
    ? 'http://localhost:8000'
    : '';
