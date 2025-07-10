// Example: src/utils/constants.ts

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const ENV = import.meta.env.VITE_ENV || 'development';

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_RETRY_ATTEMPTS = 3;