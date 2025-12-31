import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toastTypes = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        textColor: 'text-green-800',
    },
    error: {
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
    },
    warning: {
        icon: AlertCircle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-800',
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-800',
    },
};

export default function Toast({ toast, onClose }) {
    const { id, message, type = 'info', duration = 3000 } = toast;
    const config = toastTypes[type] || toastTypes.info;
    const Icon = config.icon;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -300, scale: 0.9 }}
            className={`
                relative flex items-center gap-3 p-4 rounded-xl shadow-lg border-2
                ${config.bgColor} ${config.borderColor}
                min-w-[300px] max-w-[500px]
            `}
        >
            <div className={`flex-shrink-0 ${config.iconColor}`}>
                <Icon size={24} />
            </div>
            <p className={`flex-1 font-medium ${config.textColor}`}>{message}</p>
            <button
                onClick={() => onClose(id)}
                className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
            >
                <X size={18} />
            </button>
        </motion.div>
    );
}

export function ToastContainer({ toasts, onClose }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast toast={toast} onClose={onClose} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}

