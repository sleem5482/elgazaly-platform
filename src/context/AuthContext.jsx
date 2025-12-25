import { createContext, useContext, useState, useEffect } from 'react';
import { useData } from './DataContext';
import { API_ENDPOINTS } from '../config/api';

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

    const login = async (identifier, password, method = 'phone') => {
        try {
            // Prepare payload according to API requirements
            // API expects: LoginType, Identifier, Password
            const payload = {
                LoginType: method === 'code' ? 'Code' : 'Phone',
                Identifier: identifier.trim(),
                Password: password
            };

            console.group('🔐 Login Request');
            console.log('URL:', API_ENDPOINTS.AUTH.LOGIN);
            console.log('Payload:', payload);
            console.groupEnd();

            // Call the API endpoint with proper error handling
            const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            // Get response text first
            const responseText = await response.text();
            
            console.group('🔐 Login Response');
            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);
            console.log('Response:', responseText);
            console.groupEnd();

            if (!response.ok) {
                try {
                    const errorJson = JSON.parse(responseText);
                    
                    // Handle ASP.NET Core validation errors dictionary
                    if (errorJson.errors) {
                        const messages = Object.values(errorJson.errors).flat().join(', ');
                        throw new Error(messages);
                    }
                    
                    throw new Error(errorJson.message || errorJson.error || errorJson.title || responseText);
                } catch (parseErr) {
                    if (parseErr instanceof Error && parseErr.message && !parseErr.message.includes('JSON')) {
                        throw parseErr;
                    }
                    console.error("Parse Error:", parseErr);
                    throw new Error(responseText || 'بيانات الدخول غير صحيحة');
                }
            }

            // Parse successful response
            const data = responseText ? JSON.parse(responseText) : {};
            setUser(data);
            localStorage.setItem('currentUser', JSON.stringify(data));
            return true;
        } catch (err) {
            console.error("❌ Login Error:", err);
            
            // Handle network/CORS errors
            if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message.includes('fetch')) {
                throw new Error('فشل الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.');
            }
            
            // Re-throw so the UI can display the specific message
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            console.group('📝 Registration Request');
            console.log('URL:', API_ENDPOINTS.AUTH.REGISTER);
            console.log('Data:', userData);
            console.groupEnd();
            
            // Call the API endpoint for registration
            const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData),
            });

            // Get response text first to handle both JSON and text errors
            const responseText = await response.text();
            
            // Log for debugging
            console.group('📝 Registration Response');
            console.log('Status:', response.status);
            console.log('Status Text:', response.statusText);
            console.log('Response:', responseText);
            console.groupEnd();

            if (!response.ok) {
                let errorMessage = `فشل التسجيل (${response.status})`;
                
                try {
                    // Try to parse as JSON
                    const errorJson = JSON.parse(responseText);
                    console.error('❌ Error JSON:', errorJson);

                    // Handle ASP.NET Core validation errors dictionary
                    if (errorJson.errors) {
                        const errorDetails = Object.entries(errorJson.errors)
                            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                            .join(' | ');
                        errorMessage = `خطأ في التحقق: ${errorDetails}`;
                        console.error('Validation Errors:', errorJson.errors);
                        throw new Error(errorMessage);
                    }

                    // Handle different error formats
                    errorMessage = errorJson.message || errorJson.error || errorJson.title || errorJson.detail || errorMessage;
                    console.error('Error Message:', errorMessage);
                    throw new Error(errorMessage);
                } catch (parseErr) {
                    // If parsing fails, check if it's already an Error
                    if (parseErr instanceof Error && parseErr.message && !parseErr.message.includes('JSON')) {
                        throw parseErr;
                    }

                    // If response is HTML or plain text, try to extract useful info
                    if (response.status === 500) {
                        console.error('❌ Server Error 500 - Full Response:', responseText);
                        
                        // Try to extract error message from HTML
                        const errorMatch = responseText.match(/<title>(.*?)<\/title>/i) || 
                                         responseText.match(/Exception[:\s]+(.*?)(?:\n|<)/i) ||
                                         responseText.match(/Error[:\s]+(.*?)(?:\n|<)/i);
                        
                        if (errorMatch && errorMatch[1]) {
                            errorMessage = `خطأ في الخادم: ${errorMatch[1].substring(0, 200)}`;
                        } else if (responseText.length > 0 && responseText.length < 500) {
                            // If response is short, show it
                            errorMessage = `خطأ في الخادم: ${responseText.substring(0, 200)}`;
                        } else {
                            errorMessage = 'حدث خطأ في الخادم (500). يرجى التحقق من البيانات المرسلة أو الاتصال بالدعم الفني.';
                        }
                        throw new Error(errorMessage);
                    }

                    // For other errors, show the response text if available
                    if (responseText && responseText.length < 500) {
                        errorMessage = responseText;
                    }
                    throw new Error(errorMessage || `فشل التسجيل (${response.status})`);
                }
            }

            // Parse the successful response
            const data = responseText ? JSON.parse(responseText) : {};
            setUser(data);
            localStorage.setItem('currentUser', JSON.stringify(data));
            setUsers(prev => [...prev, data]);
            return true;
        } catch (err) {
            console.error("❌ Registration Error:", err);
            
            // Handle network/CORS errors
            if (err.message === 'Failed to fetch' || err.name === 'TypeError' || err.message.includes('fetch')) {
                throw new Error('فشل الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت.');
            }
            
            throw err;
        }
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
