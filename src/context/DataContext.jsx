import { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import freeVideosData from '../data/freeVideos.json';

const DataContext = createContext();

export function DataProvider({ children }) {
    // Users are now managed via API, but keep for backward compatibility
    const [users, setUsers] = useState(() => {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : [];
    });

    // Grades are fetched from API
    const [grades, setGrades] = useState(() => {
        const stored = localStorage.getItem('grades');
        return stored ? JSON.parse(stored) : [];
    });

    // Other data - provide empty defaults since they're not being used from API yet
    const [courses, setCourses] = useState(() => {
        const stored = localStorage.getItem('courses');
        return stored ? JSON.parse(stored) : [];
    });

    const [months, setMonths] = useState(() => {
        const stored = localStorage.getItem('months');
        return stored ? JSON.parse(stored) : [];
    });

    const [weeks, setWeeks] = useState(() => {
        const stored = localStorage.getItem('weeks');
        return stored ? JSON.parse(stored) : [];
    });

    const [lessons, setLessons] = useState(() => {
        const stored = localStorage.getItem('lessons');
        return stored ? JSON.parse(stored) : [];
    });

    const [exams, setExams] = useState(() => {
        const stored = localStorage.getItem('exams');
        return stored ? JSON.parse(stored) : [];
    });

    const [subscriptions, setSubscriptions] = useState(() => {
        const stored = localStorage.getItem('subscriptions');
        return stored ? JSON.parse(stored) : [];
    });

    const [freeVideos, setFreeVideos] = useState(() => {
        const stored = localStorage.getItem('freeVideos_v2');
        return stored ? JSON.parse(stored) : freeVideosData;
    });

    const [freeExams, setFreeExams] = useState(() => {
        const stored = localStorage.getItem('freeExams');
        return stored ? JSON.parse(stored) : [];
    });

    // Fetch grades from API on mount
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.ADMIN.GRADES, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Transform API response to match expected format (id, title/name)
                    const transformedGrades = Array.isArray(data) 
                        ? data.map(grade => ({
                            id: grade.id,
                            title: grade.name || grade.title,
                            name: grade.name || grade.title
                        }))
                        : [];
                    setGrades(transformedGrades);
                }
            } catch (err) {
                console.error('Error fetching grades from API:', err);
                // Silently fail - grades will remain from localStorage or empty
            }
        };

        fetchGrades();
    }, []); // Only run once on mount

    // Sync to localStorage
    useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('grades', JSON.stringify(grades)), [grades]);
    useEffect(() => localStorage.setItem('courses', JSON.stringify(courses)), [courses]);
    useEffect(() => localStorage.setItem('months', JSON.stringify(months)), [months]);
    useEffect(() => localStorage.setItem('weeks', JSON.stringify(weeks)), [weeks]);
    useEffect(() => localStorage.setItem('lessons', JSON.stringify(lessons)), [lessons]);
    useEffect(() => localStorage.setItem('exams', JSON.stringify(exams)), [exams]);
    useEffect(() => localStorage.setItem('subscriptions', JSON.stringify(subscriptions)), [subscriptions]);
    useEffect(() => localStorage.setItem('freeVideos_v2', JSON.stringify(freeVideos)), [freeVideos]);

    const subscribe = (userId, itemId, type, paymentData = {}) => {
        console.log('Subscribing:', { userId, itemId, type, paymentData });
        const newSubscription = {
            id: Date.now().toString(),
            userId,
            itemId,
            type,
            date: new Date().toISOString(),
            status: 'active',
            ...paymentData
        };
        setSubscriptions(prev => {
            const updated = [...prev, newSubscription];
            console.log('Updated Subscriptions:', updated);
            return updated;
        });

        // Update user with latest payment info for Admin View
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...paymentData } : u));
    };

    const checkSubscription = (userId, itemId, type) => {
        // Admin always has access
        const user = users.find(u => u.id === userId);
        if (user?.role === 'admin') return true;

        // For course-based payment model
        if (type === 'week' || type === 'month') {
            // Find the course this week/month belongs to
            let courseId;
            if (type === 'week') {
                const week = weeks.find(w => w.id === itemId);
                const month = months.find(m => m.id === week?.monthId);
                courseId = month?.courseId;
            } else {
                const month = months.find(m => m.id === itemId);
                courseId = month?.courseId;
            }

            // Check if user has subscribed to the course
            const isSubscribed = subscriptions.some(sub =>
                sub.userId === userId &&
                sub.itemId === courseId &&
                sub.type === 'course' &&
                sub.status === 'active'
            );
            return isSubscribed;
        }

        // For direct course subscription check
        const isSubscribed = subscriptions.some(sub =>
            sub.userId === userId &&
            sub.itemId === itemId &&
            sub.type === 'course' &&
            sub.status === 'active'
        );
        return isSubscribed;
    };

    const value = {
        users, setUsers,
        grades, setGrades,
        courses, setCourses,
        months, setMonths,
        weeks, setWeeks,
        lessons, setLessons,
        exams, setExams,
        subscriptions, subscribe, checkSubscription,
          freeVideos, setFreeVideos,
        freeExams, setFreeExams
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
