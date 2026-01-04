import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { MEDIA_BASE_URL } from '../../config/api';
import { CheckCircle, XCircle, Clock, Loader2, Image as ImageIcon, Phone, Wallet, Calendar } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export default function AdminSubscriptions() {
    const toast = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

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

    useEffect(() => {
        fetchPayments();
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

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">طلبات الاشتراك</h1>
                        <p className="text-gray-500">مراجعة وإدارة طلبات اشتراك الطلاب</p>
                    </div>
                    <Button variant="outline" onClick={fetchPayments} disabled={loading} className="gap-2">
                        <Clock size={18} /> تحديث
                    </Button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        {payments.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">لا توجد طلبات اشتراك حالياً</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-600">الطالب</th>
                                            <th className="p-4 font-bold text-gray-600">تفاصيل الاشتراك</th>
                                            <th className="p-4 font-bold text-gray-600">بيانات الدفع</th>
                                            <th className="p-4 font-bold text-gray-600">التاريخ</th>
                                            <th className="p-4 font-bold text-gray-600">الإيصال</th>
                                            <th className="p-4 font-bold text-gray-600">الحالة</th>
                                            <th className="p-4 font-bold text-gray-600">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {payments.map(payment => (
                                            <tr key={payment.paymentId} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-800">{payment.studentName}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Phone size={12} /> {payment.studentPhone}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-secondary">{payment.courseName}</div>
                                                    <div className="text-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mt-1">
                                                        {payment.monthName}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-800">{payment.amount} ج.م</div>
                                                    <div className="text-xs text-gray-500 mt-1">{payment.paymentMethod}</div>
                                                    {payment.walletNumber && (
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Wallet size={10} /> {payment.walletNumber}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                        <Calendar size={14} />
                                                        {new Date(payment.paymentDate).toLocaleDateString('ar-EG')}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {new Date(payment.paymentDate).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="p-4">
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
                                                <td className="p-4">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="p-4">
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
