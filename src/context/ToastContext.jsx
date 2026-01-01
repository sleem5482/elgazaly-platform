import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ui/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const [confirmations, setConfirmations] = useState([]);


    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };
        
        setToasts(prev => [...prev, newToast]);
        
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        return showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message, duration) => {
        return showToast(message, 'error', duration);
    }, [showToast]);

    const warning = useCallback((message, duration) => {
        return showToast(message, 'warning', duration);
    }, [showToast]);

    const info = useCallback((message, duration) => {
        return showToast(message, 'info', duration);
    }, [showToast]);

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            const id = Date.now() + Math.random();
            const newToast = { id, message, type: 'confirm' };
            setToasts(prev => [...prev, newToast]);
            setConfirmations(prev => [...prev, { id, resolve }]);
        });
    }, []);

    const handleConfirm = useCallback((id, result) => {
        const confirmation = confirmations.find(c => c.id === id);
        if (confirmation) {
            confirmation.resolve(result);
            setConfirmations(prev => prev.filter(c => c.id !== id));
            removeToast(id);
        }
    }, [confirmations, removeToast]);

    return (
        <ToastContext.Provider value={{ success, error, warning, info, showToast, confirm }}>
            {children}
            <ToastContainer 
                toasts={toasts} 
                onClose={removeToast}
                onConfirm={handleConfirm}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

