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
    const errorText = await response.text();
    let errorMessage = defaultMessage;
    try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch (e) {
        errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
};

export const studentService = {
    getAllExams: async () => {
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.AVAILABLE, {
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch available exams');
        return response.json();
    },

    startExam: async (examId) => {
        const response = await fetch(API_ENDPOINTS.STUDENT.EXAMS.START(examId), {
            method: 'POST', // Changed to POST based on user request image
            headers: getAuthHeader()
        });
        if (!response.ok) await handleResponseError(response, 'Failed to start exam');
        return response.json(); // Expected to return questions
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
    }
};
