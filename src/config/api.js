// API Configuration
// Use relative path to use Netlify proxy (avoids CORS issues)
export const API_BASE_URL = '/api';

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
        FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
    },
    ADMIN: {
        STUDENTS: `${API_BASE_URL}/Admin/students`,
        STUDENT_BY_ID: (id) => `${API_BASE_URL}/Admin/students/${id}`,
        TOGGLE_ACTIVE: (id) => `${API_BASE_URL}/Admin/students/${id}/toggle-active`,
    }
};

