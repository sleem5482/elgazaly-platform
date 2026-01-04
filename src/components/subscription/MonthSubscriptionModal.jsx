import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext';

export default function MonthSubscriptionModal({ courseId, isOpen, onClose, initialSelectedMonth }) {
    const toast = useToast();
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [receiptImage, setReceiptImage] = useState(null);
    const [walletNumber, setWalletNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchMonths = async () => {
        setLoading(true);
        try {
            const data = await studentService.getCourseMonths(courseId);
            setMonths(data);
        } catch (error) {
            console.error("Failed to fetch months:", error);
            toast.error('فشل في تحميل الشهور المتاحة.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptImage(e.target.files[0]);
        } else {
            setReceiptImage(null);
        }
    };

    useEffect(() => {
        if (isOpen && courseId) {
            fetchMonths();
            if (initialSelectedMonth) {
                setSelectedMonth(initialSelectedMonth);
            } else {
                setSelectedMonth(null);
            }
        }
    }, [isOpen, courseId, initialSelectedMonth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMonth || !receiptImage || !walletNumber || !amount) {
            toast.error('الرجاء إكمال جميع البيانات');
            return;
        }

        setSubmitting(true);
        const formData = new FormData();
        // Exact keys from user request: CourseMonthId, PaymentMethod, WalletNumber, TransferImage, Amount
        formData.append('CourseMonthId', selectedMonth.id);
        formData.append('PaymentMethod', 'VodafoneCash');
        formData.append('WalletNumber', walletNumber);
        formData.append('TransferImage', receiptImage);
        formData.append('Amount', amount);

        try {
            await studentService.subscribeToMonth(formData);
            toast.success('تم إرسال طلب الاشتراك بنجاح سيتم مراجعته قريباً');
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('فشل إرسال الطلب');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-dark">الاشتراك في شهر جديد</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-primary w-10 h-10" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Available Months Grid */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">اختر الشهر:</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {months.map(month => (
                                        <div 
                                            key={month.id}
                                            onClick={() => !month.alreadySubscribed && setSelectedMonth(month)}
                                            className={`
                                                relative p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${month.alreadySubscribed 
                                                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' 
                                                    : selectedMonth?.id === month.id 
                                                        ? 'bg-primary/5 border-primary shadow-sm' 
                                                        : 'bg-white border-gray-100 hover:border-primary/50'
                                                }
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-dark">{month.monthName}</h3>
                                                {month.alreadySubscribed && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">مشترك بالفعل</span>}
                                                {selectedMonth?.id === month.id && <CheckCircle size={20} className="text-primary" />}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>
                                                    {new Date(month.startDate).toLocaleDateString('ar-EG')} - {new Date(month.endDate).toLocaleDateString('ar-EG')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedMonth && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-6 border-t border-gray-100 pt-6"
                                >
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-yellow-800 text-sm">
                                        <AlertCircle className="shrink-0" size={20} />
                                        <p>
                                            قم بتحويل مبلغ الاشتراك على فودافون كاش ثم املأ البيانات وارفع صورة الإيصال.
                                            <br />
                                            <span className="font-bold">رقم التحويل: 01000000000</span>
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">مبلغ التحويل (ج.م)</label>
                                            <input 
                                                type="number" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50"
                                                placeholder="500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">رقم المحفظة المحول منها</label>
                                            <input 
                                                type="text" 
                                                value={walletNumber}
                                                onChange={(e) => setWalletNumber(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50 text-left"
                                                placeholder="010xxxxxxxx"
                                                dir="ltr"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">صورة الإيصال:</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {receiptImage ? (
                                                <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                                    <CheckCircle size={20} />
                                                    {receiptImage.name}
                                                </div>
                                            ) : (
                                                <div className="text-gray-500">
                                                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                                                    <p>اضغط لرفع صورة الإيصال</p>
                                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full py-3" 
                                        disabled={submitting}
                                    >
                                        {submitting ? 'جاري الإرسال...' : 'تأكيد طلب الاشتراك'}
                                    </Button>
                                </motion.div>
                            )}
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
