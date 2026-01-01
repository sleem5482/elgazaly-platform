import { AlertCircle, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

export default function ConfirmToast({ toast, onConfirm, onCancel }) {
    const { id, message } = toast;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
                relative flex flex-col items-center gap-3 p-4 rounded-xl shadow-lg border-2
                bg-gray-50 border-gray-200
                min-w-[300px] max-w-[500px]
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 text-gray-600`}>
                    <AlertCircle size={24} />
                </div>
                <p className={`flex-1 font-medium text-gray-800`}>{message}</p>
            </div>
            <div className="flex gap-2 mt-2">
                <Button onClick={() => onConfirm(id, true)} size="sm" className="bg-green-500 hover:bg-green-600">
                    <Check size={16} className="mr-1" />
                    Confirm
                </Button>
                <Button onClick={() => onCancel(id)} size="sm" className="bg-red-500 hover:bg-red-600">
                    <X size={16} className="mr-1" />
                    Cancel
                </Button>
            </div>
        </motion.div>
    );
}
