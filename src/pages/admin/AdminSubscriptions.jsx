import { useState, useEffect, useMemo } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { MEDIA_BASE_URL } from '../../config/api';
import { CheckCircle, XCircle, Clock, Loader2, Image as ImageIcon, Phone, Wallet, Calendar, Filter } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';

export default function AdminSubscriptions() {
    const toast = useToast();
    const { grades } = useData();
    const [payments, setPayments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    // Filter States
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');

    const fetchPayments = async () => {
        try {
            const data = await adminService.getPayments();
            setPayments(data);
        } catch (error) {
            console.error(error);
            toast.error('فشل تحميل الاشتراكات');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const data = await adminService.getAllCourses();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses for filtering', error);
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchCourses();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        const confirmed = await toast.confirm(status === 1 ? 'هل أنت متأكد من قبول الاشتراك؟' : 'هل أنت متأكد من رفض الاشتراك؟');
        if (!confirmed) return;

        setProcessingId(id);
        try {
            await adminService.updatePaymentStatus(id, status);
            toast.success(status === 1 ? 'تم قبول الاشتراك' : 'تم رفض الاشتراك');
            fetchPayments();
        } catch (error) {
            console.error(error);
            toast.error('فشل تحديث الحالة');
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 1: return <Badge className="bg-green-100 text-green-700 flex items-center gap-1"><CheckCircle size={14} /> مقبول</Badge>;
            case 2: return <Badge className="bg-red-100 text-red-700 flex items-center gap-1"><XCircle size={14} /> مرفوض</Badge>;
            default: return <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock size={14} /> قيد الانتظار</Badge>;
        }
    };

    // Filter Logic
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            // Filter by Grade
            if (selectedGrade !== 'all') {
                // Find course for this payment
                // Assuming payment has courseId or we match by Name
                const course = courses.find(c => c.id === payment.courseId || c.name === payment.courseName || c.title === payment.courseName);
                if (!course || String(course.gradeId) !== String(selectedGrade)) {
                    return false;
                }
            }

            // Filter by Month
            if (selectedMonth !== 'all') {
                if (payment.monthName !== selectedMonth) {
                    return false;
                }
            }

            return true;
        });
    }, [payments, courses, selectedGrade, selectedMonth]);

    // Get unique months from payments for the filter dropdown
    const availableMonths = useMemo(() => {
        const months = new Set(payments.map(p => p.monthName).filter(Boolean));
        return Array.from(months);
    }, [payments]);

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                <header className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">طلبات الاشتراك</h1>
                            <p className="text-gray-500 text-sm md:text-base">مراجعة وإدارة طلبات اشتراك الطلاب</p>
                        </div>
                        <Button variant="outline" onClick={fetchPayments} disabled={loading} className="gap-2 w-full md:w-auto justify-center">
                            <Clock size={18} /> تحديث
                        </Button>
                    </div>

                    {/* Filters Section */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center">
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Filter size={20} />
                            <span className="md:inline">تصفية حسب:</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg md:bg-transparent md:p-0">
                                <label className="text-sm text-gray-600 whitespace-nowrap min-w-[60px]">الصف الدراسي:</label>
                                <select 
                                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                                    value={selectedGrade}
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                >
                                    <option value="all">الكل</option>
                                    {grades.map(grade => (
                                        <option key={grade.id} value={grade.id}>{grade.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg md:bg-transparent md:p-0">
                                <label className="text-sm text-gray-600 whitespace-nowrap min-w-[60px]">الشهر:</label>
                                <select 
                                    className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm bg-white"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                >
                                    <option value="all">الكل</option>
                                    {availableMonths.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {(selectedGrade !== 'all' || selectedMonth !== 'all') && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:bg-red-50 w-full md:w-auto justify-center"
                                onClick={() => { setSelectedGrade('all'); setSelectedMonth('all'); }}
                            >
                                إلغاء التصفية
                            </Button>
                        )}
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        {filteredPayments.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                {payments.length === 0 ? 'لا توجد طلبات اشتراك حالياً' : 'لا توجد نتائج مطابقة للتصفية'}
                            </div>
                        ) : (
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-right min-w-[800px]">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">الطالب</th>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">تفاصيل الاشتراك</th>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">بيانات الدفع</th>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">التاريخ</th>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">الإيصال</th>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">الحالة</th>
                                            <th className="p-4 font-bold text-gray-600 whitespace-nowrap">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredPayments.map(payment => (
                                            <tr key={payment.paymentId} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-800">{payment.studentName}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Phone size={12} /> {payment.studentPhone}
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="font-bold text-secondary">{payment.courseName}</div>
                                                    <div className="text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                                        {payment.monthName}
                                                    </div>
                                                    {/* Debug helper if needed: gradeId logic */}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="font-bold text-gray-800">{payment.amount} ج.م</div>
                                                    <div className="text-xs text-gray-500 mt-1">{payment.paymentMethod}</div>
                                                    {payment.walletNumber && (
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Wallet size={10} /> {payment.walletNumber}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                        <Calendar size={14} />
                                                        {new Date(payment.paymentDate).toLocaleDateString('ar-EG')}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {new Date(payment.paymentDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    {payment.transferImage ? (
                                                        <a 
                                                            href={payment.transferImage.startsWith('http') ? payment.transferImage : `${MEDIA_BASE_URL}${payment.transferImage}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm border border-blue-100 bg-blue-50 px-3 py-1 rounded-lg"
                                                        >
                                                            <ImageIcon size={16} /> عرض الصورة
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        {payment.status !== 1 && (
                                                            <Button 
                                                                size="sm" 
                                                                className="bg-green-600 hover:bg-green-700 text-white gap-1 px-3"
                                                                onClick={() => handleStatusUpdate(payment.paymentId, 1)}
                                                                disabled={processingId === payment.paymentId}
                                                            >
                                                                <CheckCircle size={14} /> قبول
                                                            </Button>
                                                        )}
                                                        {payment.status !== 2 && (
                                                            <Button 
                                                                size="sm" 
                                                                className="bg-red-600 hover:bg-red-700 text-white gap-1 px-3"
                                                                onClick={() => handleStatusUpdate(payment.paymentId, 2)}
                                                                disabled={processingId === payment.paymentId}
                                                            >
                                                                <XCircle size={14} /> رفض
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
