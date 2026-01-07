import { API_ENDPOINTS } from '../config/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
        // 'Content-Type': 'application/json' // Don't set globally because FormData needs to set its own multipart boundary
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

export const adminService = {
    // --- Payments ---
    getPayments: async () => {
        const response = await fetch(API_ENDPOINTS.ADMIN.PAYMENTS, {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch payments');
        return response.json();
    },

    updatePaymentStatus: async (id, status) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.PAYMENT_STATUS(id, status), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to update payment status');
        return true;
    },

    // --- Students ---
    getAllStudents: async () => {
        const response = await fetch(API_ENDPOINTS.ADMIN.STUDENTS, {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) await handleResponseError(response, 'Failed to fetch students');
        return response.json();
    },

    createStudent: async (data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.STUDENTS, {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to create student';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) { errorMessage = errorText || errorMessage; }
            throw new Error(errorMessage);
        }
        return response.json(); // or true depending on API
    },

    updateStudent: async (id, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to update student';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) { errorMessage = errorText || errorMessage; }
            throw new Error(errorMessage);
        }
        return response.status !== 204 ? response.json() : true;
    },

    deleteStudent: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = 'Failed to delete student';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) { errorMessage = errorText || errorMessage; }
            throw new Error(errorMessage);
        }
        return true;
    },

    toggleStudentActive: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.TOGGLE_ACTIVE(id), {
            method: 'PATCH',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to toggle student status');
        return true;
    },

    // --- Courses ---
    getAllCourses: async () => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSES, {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch courses');
        return response.json();
    },

    getCourseById: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_BY_ID(id), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch course');
        return response.json();
    },

    getSections: async () => {
        const response = await fetch(API_ENDPOINTS.ADMIN.SECTIONS, {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch sections');
        return response.json();
    },

    // --- Grades ---
    getGrades: async () => {
        const response = await fetch(API_ENDPOINTS.ADMIN.GRADES, {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch grades');
        return response.json();
    },

    createGrade: async (data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.GRADES, {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = 'Failed to create grade';
             try {
                 const errorJson = JSON.parse(errorText);
                 errorMessage = errorJson.message || errorJson.error || errorMessage;
             } catch (e) { errorMessage = errorText || errorMessage; }
             throw new Error(errorMessage);
        }
        return response.json();
    },

    updateGrade: async (id, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.GRADE_BY_ID(id), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = 'Failed to update grade';
             try {
                 const errorJson = JSON.parse(errorText);
                 errorMessage = errorJson.message || errorJson.error || errorMessage;
             } catch (e) { errorMessage = errorText || errorMessage; }
             throw new Error(errorMessage);
        }
        return response.status !== 204 ? response.json() : true;
    },

    deleteGrade: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.GRADE_BY_ID(id), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = 'Failed to delete grade';
             try {
                 const errorJson = JSON.parse(errorText);
                 errorMessage = errorJson.message || errorJson.error || errorMessage;
             } catch (e) { errorMessage = errorText || errorMessage; }
             throw new Error(errorMessage);
        }
        return true;
    },

    createSection: async (data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.SECTIONS, {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = 'Failed to create section';
             try {
                 const errorJson = JSON.parse(errorText);
                 errorMessage = errorJson.message || errorJson.error || errorMessage;
             } catch (e) { errorMessage = errorText || errorMessage; }
             throw new Error(errorMessage);
        }
        return response.json();
    },
    
    deleteSection: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.SECTION_BY_ID(id), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = 'Failed to delete section';
             try {
                 const errorJson = JSON.parse(errorText);
                 errorMessage = errorJson.message || errorJson.error || errorMessage;
             } catch (e) { errorMessage = errorText || errorMessage; }
             throw new Error(errorMessage);
        }
        return true;
    },

    createCourse: async (data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSES, {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create course');
        return response.json();
    },

    updateCourse: async (id, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_BY_ID(id), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update course');
        // PUT APIs sometimes return nothing or the updated obj. 
        // We'll return response status or json if available.
        return response.status !== 204 ? response.json() : true; 
    },

    deleteCourse: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_BY_ID(id), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete course');
        return true;
    },

    toggleCourseActive: async (id) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_TOGGLE_ACTIVE(id), {
            method: 'PATCH',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to toggle course status');
        return true;
    },

    // --- Months ---
    getMonths: async (courseId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_MONTHS(courseId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch months');
        return response.json();
    },

    createMonth: async (courseId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_MONTHS(courseId), {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create month');
        return response.json();
    },

    updateMonth: async (courseId, monthId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_MONTHS_BY_ID(courseId, monthId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update month');
        return response.status !== 204 ? response.json() : true;
    },

    deleteMonth: async (courseId, monthId) => {
        // Updated based on user request: DELETE https://elghazaly.runasp.net/api/Admin/courses/2/months/1
         const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_MONTHS_BY_ID(courseId, monthId), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete month');
        return true;
    },

    // --- Weeks ---
    getWeeks: async (monthId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_WEEKS(monthId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch weeks');
        return response.json();
    },

    createWeek: async (monthId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_WEEKS(monthId), {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create week');
        console.log(response);
        return response.json();
    },

    updateWeek: async (monthId, weekId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_WEEKS_BY_ID(monthId, weekId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update week');
        return response.status !== 204 ? response.json() : true;
    },

    deleteWeek: async (monthId, weekId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_WEEKS_BY_ID(monthId, weekId), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete week');
        return true;
    },

    // --- Videos ---
    getVideos: async (weekId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.VIDEOS(weekId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch videos');
        return response.json();
    },

    createVideo: async (weekId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.VIDEOS(weekId), {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create video');
        return response.json();
    },

    updateVideo: async (weekId, videoId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.VIDEO_BY_ID(weekId, videoId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update video');
        return response.status !== 204 ? response.json() : true;
    },

    deleteVideo: async (weekId, videoId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.VIDEO_BY_ID(weekId, videoId), {
            method: 'DELETE',
            headers: { ...getAuthHeader() } // DELETE usually doesn't have body, but if it did, content-type json
        });
        if (!response.ok) throw new Error('Failed to delete video');
        return true;
    },

    // --- Exams ---
    getExams: async (courseId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_EXAMS(courseId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch exams');
        return response.json();
    },

    createExam: async (courseId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_EXAMS(courseId), {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) await handleResponseError(response, 'Failed to create exam');
        return response.json();
    },

    updateExam: async (courseId, examId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_EXAM_BY_ID(courseId, examId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) await handleResponseError(response, 'Failed to update exam');
        return response.status !== 204 ? response.json() : true;
    },

    getExamById: async (courseId, examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_EXAM_BY_ID(courseId, examId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch exam');
        return response.json();
    },

    deleteExam: async (courseId, examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.COURSE_EXAM_BY_ID(courseId, examId), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete exam');
        return true;
    },

    getExamResults: async (examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_RESULTS(examId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch exam results');
        return response.json();
    },

    getExamStats: async (examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_STATS(examId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch exam stats');
        return response.json();
    },

    openExam: async (examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_OPEN(examId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to open exam');
        return true;
    },

    closeExam: async (examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_CLOSE(examId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to close exam');
        return true;
    },

    // --- Exam Questions ---
    getQuestions: async (examId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_QUESTIONS(examId), {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch questions');
        return response.json();
    },

    createQuestion: async (examId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_QUESTIONS(examId), {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create question');
        return response.json();
    },

    updateQuestion: async (examId, questionId, data) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_QUESTION_BY_ID(examId, questionId), {
            method: 'PUT',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update question');
        return response.status !== 204 ? response.json() : true;
    },

    deleteQuestion: async (examId, questionId) => {
        const response = await fetch(API_ENDPOINTS.ADMIN.EXAM_QUESTION_BY_ID(examId, questionId), {
            method: 'DELETE',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete question');
        return true;
    }
};
