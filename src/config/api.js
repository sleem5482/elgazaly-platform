// API Configuration
// Use environment variable for direct API calls (bypassing Netlify proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/Auth/login`,
        REGISTER: `${API_BASE_URL}/Auth/register`,
        FORGOT_PASSWORD: `${API_BASE_URL}/Auth/forgot-password`,
        RESET_PASSWORD: `${API_BASE_URL}/Auth/reset-password`,
    },
    ADMIN: {
        STUDENTS: `${API_BASE_URL}/Admin/students`,
        STUDENT_BY_ID: (id) => `${API_BASE_URL}/Admin/students/${id}`,
        TOGGLE_ACTIVE: (id) => `${API_BASE_URL}/Admin/students/${id}/toggle-active`,
        GRADES: `${API_BASE_URL}/Admin/grades`,
        GRADE_BY_ID: (id) => `${API_BASE_URL}/Admin/grades/${id}`,
        SECTIONS: `${API_BASE_URL}/Admin/sections`,
        SECTION_BY_ID: (id) => `${API_BASE_URL}/Admin/sections/${id}`,

        // Payments
        PAYMENTS: `${API_BASE_URL}/admin/payments`,
        PAYMENT_STATUS: (id, status) => `${API_BASE_URL}/admin/payments/${id}/status?status=${status}`,

        // Courses
        COURSES: `${API_BASE_URL}/Admin/courses`,
        COURSE_BY_ID: (id) => `${API_BASE_URL}/Admin/courses/${id}`,
        COURSE_TOGGLE_ACTIVE: (id) => `${API_BASE_URL}/Admin/courses/${id}/toggle-active`,
        // Course Months
        COURSE_MONTHS: (courseId) => `${API_BASE_URL}/Admin/courses/${courseId}/months`,
        COURSE_MONTHS_BY_ID: (courseId, id) => `${API_BASE_URL}/Admin/courses/${courseId}/months/${id}`,
        // Course Weeks
        COURSE_WEEKS: (monthId) => `${API_BASE_URL}/Admin/course-months/${monthId}/weeks`,
        COURSE_WEEKS_BY_ID: (monthId, id) => `${API_BASE_URL}/Admin/course-months/${monthId}/weeks/${id}`, // Note: URL might be /Admin/course-months/MID/weeks/WID or just /Admin/course-months/weeks/WID? Checking user request...
        // User request says DELETE https://elghazaly.runasp.net//api/Admin/course-months/2/weeks/1 - looks like standard nested or flat? 
        // Actually: PUT https://elghazaly.runasp.net/api/Admin/course-months/2/weeks/1 
        // So yes, it includes the parent ID in the path.
        
        // Videos
        VIDEOS: (weekId) => `${API_BASE_URL}/Admin/course-weeks/${weekId}/videos`,
        VIDEO_BY_ID: (weekId, id) => `${API_BASE_URL}/Admin/course-weeks/${weekId}/videos/${id}`,
        // Video Streaming
        VIDEO_STREAM: (id) => `${API_BASE_URL}/VideoStreaming/stream/${id}`,

        // Exams (Course Context)
        COURSE_EXAMS: (courseId) => `${API_BASE_URL}/Admin/courses/${courseId}/exams`,
        COURSE_EXAM_BY_ID: (courseId, examId) => `${API_BASE_URL}/Admin/courses/${courseId}/exams/${examId}`,
        
        // Exams (Direct Context - Results/Status)
        EXAM_RESULTS: (examId) => `${API_BASE_URL}/Admin/Exams/${examId}/results`,
        EXAM_STATS: (examId) => `${API_BASE_URL}/Admin/Exams/${examId}/results/stats`,
        EXAM_OPEN: (examId) => `${API_BASE_URL}/Admin/Exams/${examId}/open`,
        EXAM_CLOSE: (examId) => `${API_BASE_URL}/Admin/Exams/${examId}/close`,

        // Exam Questions
        EXAM_QUESTIONS: (examId) => `${API_BASE_URL}/Admin/Exams/${examId}/questions`,
        EXAM_QUESTION_BY_ID: (examId, questionId) => `${API_BASE_URL}/Admin/Exams/${examId}/questions/${questionId}`,
    },
    STUDENT: {
        // Updated based on user request
        COURSES: {
             MY_COURSES: `${API_BASE_URL}/student/courses/my`,
             ALL_COURSES: `${API_BASE_URL}/student/courses/GetAllCourseForStudent`,
             ACCESS: (id) => `${API_BASE_URL}/student/courses/${id}/access`
        },
        PAYMENTS: {
            AVAILABLE_MONTHS: (courseId) => `${API_BASE_URL}/student/payments/available-months/${courseId}`,
            SUBSCRIBE: `${API_BASE_URL}/student/payments/subscribe`
        },
        EXAMS: {
            FREE: `${API_BASE_URL}/student/exams/free`,
            BY_COURSE: (courseId) => `${API_BASE_URL}/student/exams/courses/${courseId}/exams`,
            QUESTIONS: (id) => `${API_BASE_URL}/student/exams/${id}/questions`,
            START: (id) => `${API_BASE_URL}/student/exams/start/${id}`,
            SUBMIT: `${API_BASE_URL}/student/exams/submit`
        },
        VIDEOS: (weekId) => `${API_BASE_URL}/student/course-weeks/${weekId}/videos`,
        ACCESS_VIDEO: (id) => `${API_BASE_URL}/student/videos/${id}/access`,
        AVAILABLE_WEEKS: (courseId, monthId) => `${API_BASE_URL}/student/courses/AvailableWeeks/${courseId}/${monthId}`
    }
};

