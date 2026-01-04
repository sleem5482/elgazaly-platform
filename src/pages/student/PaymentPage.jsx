import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { CreditCard, CheckCircle, Smartphone, Copy, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function PaymentPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Data State
    const [courses, setCourses] = useState([]);
    const [months, setMonths] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingMonths, setLoadingMonths] = useState(false);

    // Form State
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedMonthId, setSelectedMonthId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('VodafoneCash');
    const [walletNumber, setWalletNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [transferImage, setTransferImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    // UI State
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch My Courses on Mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Ensure we get all courses to populate the dropdown
                const data = await studentService.getMyCourses();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
                showToast('فشل تحميل الكورسات', 'error');
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    // Fetch Months when Course Changes
    useEffect(() => {
        if (!selectedCourseId) {
            setMonths([]);
            return;
        }

        const fetchMonths = async () => {
            setLoadingMonths(true);
            try {
                const data = await studentService.getAvailableMonths(selectedCourseId);
                // Filter only unsubscribed months? Or show all? Usually payment is for new subscriptions.
                // Let's show all but maybe visually indicate subscribed ones or filter them.
                // For now, showing all available months to subscribe to.
                setMonths(data.filter(m => !m.alreadySubscribed));
            } catch (error) {
                console.error('Failed to fetch months', error);
                showToast('فشل تحميل الشهور', 'error');
            } finally {
                setLoadingMonths(false);
            }
        };
        fetchMonths();
    }, [selectedCourseId]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        showToast('تم النسخ بنجاح', 'success');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTransferImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedMonthId || !walletNumber || !amount || !transferImage) {
            showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('CourseMonthId', selectedMonthId);
        formData.append('PaymentMethod', paymentMethod);
        formData.append('WalletNumber', walletNumber);
        formData.append('Amount', amount);
        formData.append('TransferImage', transferImage);

        try {
            await studentService.subscribeToMonth(formData);
            setStep(3); // Success Step
            showToast('تم إرسال الطلب بنجاح', 'success');
        } catch (error) {
            console.error('Payment submission failed', error);
            showToast('فشل إرسال الطلب. حاول مرة أخرى', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCourseData = courses.find(c => c.courseId == selectedCourseId || c.id == selectedCourseId);
    // Try to find month data safely
    const selectedMonthData = months.find(m => m.id == selectedMonthId);

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-dark mb-2">إتمام الاشتراك</h1>
                    <p className="text-gray-600">قم بتعبئة البيانات لتفعيل اشتراكك</p>
                </header>

                <div className="max-w-3xl mx-auto">
                    {/* Step 1: Selection & Payment Method */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-md bg-white">
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="text-xl font-bold text-dark mb-4">1. اختر المحتوى</h2>
                                    
                                    {/* Course Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الكورس</label>
                                        {loadingCourses ? (
                                            <div className="flex items-center gap-2 text-gray-500"><Loader2 className="animate-spin" size={16}/> جار التحميل...</div>
                                        ) : (
                                            <select 
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                value={selectedCourseId}
                                                onChange={(e) => {
                                                    setSelectedCourseId(e.target.value);
                                                    setSelectedMonthId(''); 
                                                }}
                                            >
                                                <option value="">اختر الكورس...</option>
                                                {courses.map(course => (
                                                    <option key={course.courseId || course.id} value={course.courseId || course.id}>
                                                        {course.courseName || course.title}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    {/* Month Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الشهر</label>
                                        <select 
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            value={selectedMonthId}
                                            onChange={(e) => setSelectedMonthId(e.target.value)}
                                            disabled={!selectedCourseId || loadingMonths}
                                        >
                                            <option value="">
                                                {loadingMonths ? 'جار تحميل الشهور...' : 'اختر الشهر...'}
                                            </option>
                                            {months.map(month => (
                                                <option key={month.id} value={month.id}>
                                                    {month.monthName} {month.price ? `(${month.price} ج.م)` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {months.length === 0 && selectedCourseId && !loadingMonths && (
                                            <p className="text-xs text-red-500 mt-1">لا توجد شهور متاحة للاشتراك في هذا الكورس حالياً.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-white">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold text-dark mb-4">2. طريقة الدفع</h2>
                                    <div 
                                        onClick={() => setPaymentMethod('VodafoneCash')}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'VodafoneCash' ? 'border-primary bg-primary/5' : 'border-gray-100 peer-checked:border-primary'}`}
                                    >
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">فودافون كاش</h3>
                                            <p className="text-sm text-gray-500">ادفع بسهولة عن طريق محفظة فودافون</p>
                                        </div>
                                        {paymentMethod === 'VodafoneCash' && <CheckCircle className="mr-auto text-primary" size={24} />}
                                    </div>
                                </CardContent>
                            </Card>

                            <Button 
                                onClick={() => setStep(2)} 
                                disabled={!selectedMonthId}
                                className="w-full py-4 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                متابعة لبيانات الدفع
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Payment Details Form */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-md bg-white">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-0 hover:bg-transparent text-gray-400 hover:text-dark">
                                            رجوع
                                        </Button>
                                        <h2 className="text-xl font-bold text-dark flex-1 text-center pl-8">بيانات التحويل</h2>
                                    </div>

                                    {/* Transfer Info Box */}
                                    <div className="bg-gray-50 p-6 rounded-xl mb-8 text-center border border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">يرجى تحويل المبلغ المطلوب إلى الرقم التالي:</p>
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            <span className="text-3xl font-bold text-primary tracking-wider" dir="ltr">01050940343</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleCopy('01050940343')} className="bg-white shadow-sm hover:text-primary">
                                                <Copy size={18} />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-400">فودافون كاش</p>
                                        {selectedMonthData?.price && (
                                             <div className="mt-4 pt-4 border-t border-gray-200">
                                                 <p className="text-gray-600">المبلغ المستحق: <span className="font-bold text-dark text-lg">{selectedMonthData.price} ج.م</span></p>
                                             </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم المحفظة / الرقم المحول منه <span className="text-red-500">*</span></label>
                                            <Input
                                                required
                                                placeholder="أدخل رقم المحفظة"
                                                value={walletNumber}
                                                onChange={(e) => setWalletNumber(e.target.value)}
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ المحول <span className="text-red-500">*</span></label>
                                            <Input
                                                required
                                                type="number"
                                                placeholder="مثال: 150"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">صورة التحويل (السكرين شوت) <span className="text-red-500">*</span></label>
                                            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${transferImage ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'}`}>
                                                <input 
                                                    type="file" 
                                                    id="transferImage" 
                                                    className="hidden" 
                                                    onChange={handleImageUpload} 
                                                    accept="image/*"
                                                    required 
                                                />
                                                <label htmlFor="transferImage" className="cursor-pointer flex flex-col items-center gap-2">
                                                    {imagePreview ? (
                                                        <img src={imagePreview} alt="Preview" className="h-40 object-contain rounded-lg shadow-sm" />
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                                                <Upload size={24} />
                                                            </div>
                                                            <p className="text-sm font-medium text-gray-700">اضغط لرفع الصورة</p>
                                                            <p className="text-xs text-gray-400">JPG, PNG, JPEG</p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                            {imagePreview && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => { setTransferImage(null); setImagePreview(null); }}
                                                    className="text-xs text-red-500 mt-2 hover:underline"
                                                >
                                                    حذف الصورة
                                                </button>
                                            )}
                                        </div>

                                        <Button 
                                            type="submit" 
                                            className="w-full py-4 text-lg rounded-xl bg-secondary hover:bg-secondary/90 text-white shadow-lg mt-8"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="animate-spin ml-2" /> جاري الإرسال...
                                                </>
                                            ) : 'تأكيد ودفع الاشتراك'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 animate-bounce">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-dark mb-4">تم استلام طلبك بنجاح!</h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                سيتم مراجعة الدفع وتفعيل الاشتراك في أقرب وقت. يمكنك متابعة حالة اشتراكك من صفحة الكورس.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => navigate('/dashboard')} variant="outline" className="min-w-[140px]">
                                    الرئيسية
                                </Button>
                                <Button onClick={() => navigate('/courses')} className="min-w-[140px]">
                                    العودة للكورسات
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
