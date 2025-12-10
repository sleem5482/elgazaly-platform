import { createContext, useContext, useState, useEffect } from 'react';
import { useData } from './DataContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { users, setUsers } = useData();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (identifier, password, method = 'phone') => {
        const foundUser = users.find(u => {
            if (method === 'phone') {
                return u.phone === identifier && u.password === password;
            } else {
                return u.code === identifier && u.password === password;
            }
        });

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const register = (userData) => {
        if (users.find(u => u.phone === userData.phone)) {
            // Return false instead of throwing to handle it gracefully in the UI
            return false;
        }

        // Generate a random 6-digit code for the student
        const studentCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = {
            ...userData,
            id: `u${Date.now()}`,
            code: studentCode,
            role: 'student',
            isSubscribed: false,
            subscribedCourses: []
        };

        setUsers([...users, newUser]);
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
