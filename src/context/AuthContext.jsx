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
            const userData = JSON.parse(storedUser);
            // Ensure role is set if missing (for backward compatibility)
            if (!userData.role) {
                if (userData.studentType === 0) {
                    userData.role = 'admin';
                } else {
                    userData.role = 'student';
                }
                setUser(userData);
                localStorage.setItem('currentUser', JSON.stringify(userData));
            } else {
                setUser(userData);
            }
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password, loginType) => {
        try {
            // Prepare payload according to API requirements
            // API expects: loginType (Online, Center, Admin), identifier (phone number, code, or email), password
            const payload = {
                loginType: loginType, // Online, Center, or Admin
                identifier: identifier.trim(),
                password: password
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
                // Handle empty response
                if (!responseText || responseText.trim() === '') {
                    throw new Error(`خطأ في الخادم (${response.status}). يرجى المحاولة مرة أخرى.`);
                }
                
                try {
                    const errorJson = JSON.parse(responseText);
                    
                    // Handle ASP.NET Core validation errors dictionary
                    if (errorJson.errors) {
                        const messages = Object.values(errorJson.errors).flat().join(', ');
                        throw new Error(messages);
                    }
                    
                    throw new Error(errorJson.message || errorJson.error || errorJson.title || `خطأ في الخادم (${response.status})`);
                } catch (parseErr) {
                    if (parseErr instanceof Error && parseErr.message && !parseErr.message.includes('JSON') && !parseErr.message.includes('parse')) {
                        throw parseErr;
                    }
                    console.error("Parse Error:", parseErr);
                    // If responseText exists, use it (might be HTML or plain text)
                    throw new Error(responseText.length > 200 ? responseText.substring(0, 200) + '...' : responseText || 'بيانات الدخول غير صحيحة');
                }
            }

            // Parse successful response - handle empty response
            if (!responseText || responseText.trim() === '') {
                throw new Error('استجابة فارغة من الخادم. يرجى المحاولة مرة أخرى.');
            }
            
            const data = JSON.parse(responseText);
            // Determine role based on loginType or studentType
            // Admin login type or studentType === 0 means admin
            let userRole = 'student';
            if (loginType === 'Admin' || data.studentType === 0 || data.role === 'admin') {
                userRole = 'admin';
            }
            
            // Normalize user data structure for consistent access (API returns fullName, phoneNumber, gradeId, etc.)
            const normalizedUser = {
                ...data,
                name: data.fullName || data.name,
                fullName: data.fullName || data.name,
                grade: data.gradeId || data.grade,
                gradeId: data.gradeId || data.grade,
                phone: data.phoneNumber || data.phone,
                phoneNumber: data.phoneNumber || data.phone,
                role: userRole, // Set role based on login type or API response
            };
            setUser(normalizedUser);
            localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
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
            // Determine role - admin if studentType is 0, otherwise student
            const userRole = data.studentType === 0 ? 'admin' : 'student';
            
            // Normalize user data structure for consistent access (API returns fullName, phoneNumber, gradeId, etc.)
            const normalizedUser = {
                ...data,
                name: data.fullName || data.name,
                fullName: data.fullName || data.name,
                grade: data.gradeId || data.grade,
                gradeId: data.gradeId || data.grade,
                phone: data.phoneNumber || data.phone,
                phoneNumber: data.phoneNumber || data.phone,
                role: userRole, // Set role based on studentType
            };
            setUser(normalizedUser);
            localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
            setUsers(prev => [...prev, normalizedUser]);
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

    const forgotPassword = async (identifier) => {
        try {
            console.group('🔐 Forgot Password Request');
            console.log('URL:', API_ENDPOINTS.AUTH.FORGOT_PASSWORD);
            console.log('Identifier:', identifier);
            console.groupEnd();

            const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ identifier }),
            });

            const responseText = await response.text();

            console.group('🔐 Forgot Password Response');
            console.log('Status:', response.status);
            console.log('Response:', responseText);
            console.groupEnd();

            if (!response.ok) {
                try {
                    const errorJson = JSON.parse(responseText);
                    throw new Error(errorJson.message || errorJson.error || 'فشلت عملية استعادة كلمة المرور');
                } catch (e) {
                    throw new Error(responseText || 'فشلت عملية استعادة كلمة المرور');
                }
            }
            
            return true;
        } catch (err) {
            console.error("❌ Forgot Password Error:", err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, forgotPassword, logout, loading }}>
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
