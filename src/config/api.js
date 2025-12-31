// API Configuration
// Use environment variable for direct API calls (bypassing Netlify proxy)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elghazaly.runasp.net/api';

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
        GRADES: `${API_BASE_URL}/Admin/grades`,
        GRADE_BY_ID: (id) => `${API_BASE_URL}/Admin/grades/${id}`,
        SECTIONS: `${API_BASE_URL}/Admin/sections`,
        SECTION_BY_ID: (id) => `${API_BASE_URL}/Admin/sections/${id}`,
    }
};

