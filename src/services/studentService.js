import { API_ENDPOINTS } from '../config/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
};

const handleResponseError = async (response, defaultMessage) => {
    let errorMessage = defaultMessage;
    // Try to get JSON error
    try {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
    } catch (e) {
        // ignore
    }
    
    // Add status and URL for debugging
    throw new Error(`${errorMessage} (Status: ${response.status}, URL: ${response.url})`);
};

export const studentService = {
    getAllExams: async () => {
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.AVAILABLE, {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch available exams');
        return response.json();
    },

    getCourseExams: async (courseId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.BY_COURSE(courseId), {
            headers: getAuthHeader()
        });
        // Handle 404 or empty specifically if needed, but general error is fine for now
        if (!response.ok) await handleResponseError(response, 'Failed to fetch course exams');
        return response.json();
    },

    startExam: async (examId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.START(examId), {
            method: 'POST', 
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to start exam');
        return response.json(); 
    },

    getExamQuestions: async (examId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.QUESTIONS(examId), {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch exam questions');
        return response.json();
    },

    submitExam: async (examData) => {
        /*
        Payload structure:
        {
          "examId": 4,
          "answers": [
            {
              "questionId": 3,
              "selectedOption": "optionB" 
            }
          ]
        }
        */
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.SUBMIT, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(examData)
        });
        
        if (!response.ok) await handleResponseError(response, 'Failed to submit exam');
        return response.json();
    },

    // Course Methods
    getMyCourses: async () => {
        const response = await fetch(API_ENDPOINTS.STUDENT.COURSES.MY_COURSES, {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch my courses');
        return response.json();
    },

    accessCourse: async (courseId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.COURSES.ACCESS(courseId), {
            headers: getAuthHeader()
        
        });
        if (!response.ok) await handleResponseError(response, 'Failed to access course');
        return response.json();
    },

    // --- Payments ---
    getAvailableMonths: async (courseId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.PAYMENTS.AVAILABLE_MONTHS(courseId), {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch available months');
        return response.json();
    },

    subscribeToMonth: async (formData) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.PAYMENTS.SUBSCRIBE, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                // Content-Type not set for FormData
            },
            body: formData
        });
        if (!response.ok) await handleResponseError(response, 'Failed to subscribe');
        // The API might return the created payment object or just success
        return response.json(); 
    },

    getVideoStreamUrl: (videoId) => {
        return API_ENDPOINTS.STUDENT.VIDEO_STREAM(videoId);
    },

    getVideos: async (weekId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.VIDEOS(weekId), {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch videos');
        return response.json();
    },

    accessVideo: async (videoId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.ACCESS_VIDEO(videoId), {
            method: 'POST',
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to access video');
        return response.json();
    },

    getAvailableWeeks: async (id) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.AVAILABLE_WEEKS(id), {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch weeks');
        return response.json();
    }
};
