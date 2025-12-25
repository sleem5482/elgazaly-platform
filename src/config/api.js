// API Configuration
// Use relative path to use Netlify proxy (avoids CORS issues)
export const API_BASE_URL = '/api';

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
    }
};

