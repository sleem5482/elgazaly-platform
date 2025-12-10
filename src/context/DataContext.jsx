import { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';
import gradesData from '../data/grades.json';
import coursesData from '../data/courses.json';
import monthsData from '../data/months.json';
import weeksData from '../data/weeks.json';
import lessonsData from '../data/lessons.json';
import examsData from '../data/exams.json';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [users, setUsers] = useState(() => {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : usersData;
    });

    const [grades, setGrades] = useState(() => {
        const stored = localStorage.getItem('grades');
        return stored ? JSON.parse(stored) : gradesData;
    });

    const [courses, setCourses] = useState(() => {
        const stored = localStorage.getItem('courses');
        return stored ? JSON.parse(stored) : coursesData;
    });

    const [months, setMonths] = useState(() => {
        const stored = localStorage.getItem('months');
        return stored ? JSON.parse(stored) : monthsData;
    });

    const [weeks, setWeeks] = useState(() => {
        const stored = localStorage.getItem('weeks');
        return stored ? JSON.parse(stored) : weeksData;
    });

    const [lessons, setLessons] = useState(() => {
        const stored = localStorage.getItem('lessons');
        return stored ? JSON.parse(stored) : lessonsData;
    });

    const [exams, setExams] = useState(() => {
        const stored = localStorage.getItem('exams');
        return stored ? JSON.parse(stored) : examsData;
    });

    const [subscriptions, setSubscriptions] = useState(() => {
        const stored = localStorage.getItem('subscriptions');
        return stored ? JSON.parse(stored) : [];
    });

    // Sync to localStorage
    useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('grades', JSON.stringify(grades)), [grades]);
    useEffect(() => localStorage.setItem('courses', JSON.stringify(courses)), [courses]);
    useEffect(() => localStorage.setItem('months', JSON.stringify(months)), [months]);
    useEffect(() => localStorage.setItem('weeks', JSON.stringify(weeks)), [weeks]);
    useEffect(() => localStorage.setItem('lessons', JSON.stringify(lessons)), [lessons]);
    useEffect(() => localStorage.setItem('exams', JSON.stringify(exams)), [exams]);
    useEffect(() => localStorage.setItem('subscriptions', JSON.stringify(subscriptions)), [subscriptions]);

    const subscribe = (userId, itemId, type) => {
        console.log('Subscribing:', { userId, itemId, type });
        const newSubscription = {
            id: Date.now().toString(),
            userId,
            itemId,
            type,
            date: new Date().toISOString(),
            status: 'active'
        };
        setSubscriptions(prev => {
            const updated = [...prev, newSubscription];
            console.log('Updated Subscriptions:', updated);
            return updated;
        });
    };

    const checkSubscription = (userId, itemId, type) => {
        // Admin always has access
        const user = users.find(u => u.id === userId);
        if (user?.role === 'admin') return true;

        const isSubscribed = subscriptions.some(sub =>
            sub.userId === userId &&
            sub.itemId === itemId &&
            sub.type === type &&
            sub.status === 'active'
        );
        console.log('Checking Subscription:', { userId, itemId, type, isSubscribed, subscriptions });
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
        subscriptions, subscribe, checkSubscription
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
