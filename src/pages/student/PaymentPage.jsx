import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { CreditCard, CheckCircle, Smartphone, Copy } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { subscribe } = useData();
    const { user } = useAuth();
    const { itemType, itemTitle, price, itemId } = location.state || { itemType: 'month', itemTitle: 'محتوى تعليمي', price: '150', itemId: '1' };

    const [selectedMethod, setSelectedMethod] = useState('vodafone');
    const [step, setStep] = useState(1);
    const [transactionId, setTransactionId] = useState('');

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert('تم النسخ بنجاح');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(3);

        console.log('Payment Submit:', { user, itemId, itemType });

        // Simulate API call and activate subscription
        setTimeout(() => {
            if (user && itemId) {
                console.log('Calling subscribe...');
                subscribe(user.id, itemId, itemType);
            } else {
                console.error('Missing user or itemId', { user, itemId });
            }
            navigate('/dashboard');
        }, 3000);
    };

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-dark mb-2">إتمام الاشتراك</h1>
                    <p className="text-gray-600">أنت على وشك الاشتراك في: <span className="font-bold text-primary">{itemTitle}</span></p>
                </header>

                <div className="max-w-3xl mx-auto">
                    {/* Step 1: Order Summary */}
                    <Card className="mb-8 border-none shadow-md bg-white">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">تفاصيل الطلب</p>
                                <h3 className="text-xl font-bold text-secondary">{itemTitle}</h3>
                            </div>
                            <div className="text-left">
                                <p className="text-gray-500 text-sm">المبلغ المطلوب</p>
                                <p className="text-2xl font-bold text-primary">{price} ج.م</p>
                            </div>
                        </CardContent>
                    </Card>

                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-dark mb-4">اختر طريقة الدفع</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => setSelectedMethod('vodafone')}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${selectedMethod === 'vodafone' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                                >
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                        <Smartphone size={32} />
                                    </div>
                                    <h3 className="font-bold text-lg">فودافون كاش</h3>
                                </div>
                                <div
                                    onClick={() => setSelectedMethod('instapay')}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${selectedMethod === 'instapay' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                                >
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="font-bold text-lg">InstaPay</h3>
                                </div>
                            </div>
                            <Button onClick={() => setStep(2)} className="w-full py-4 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg">
                                متابعة الدفع
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <Card className="border-none shadow-md bg-white">
                                <CardContent className="p-8 text-center">
                                    <h2 className="text-xl font-bold text-dark mb-6">بيانات التحويل</h2>

                                    <div className="bg-gray-50 p-6 rounded-xl mb-6">
                                        <p className="text-gray-500 mb-2">يرجى تحويل مبلغ <span className="font-bold text-dark">{price} ج.م</span> إلى الرقم التالي:</p>
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="text-3xl font-bold text-primary tracking-wider">01000000000</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleCopy('01000000000')}>
                                                <Copy size={20} className="text-gray-400 hover:text-primary" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {selectedMethod === 'vodafone' ? 'فودافون كاش' : 'InstaPay Username: @alghazali'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="text-right space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم المحفظة / الحساب المحول منه</label>
                                            <Input required placeholder="أدخل الرقم هنا" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">صورة التحويل (اختياري)</label>
                                            <Input type="file" className="pt-2" />
                                        </div>
                                        <div className="flex gap-4 mt-8">
                                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                                رجوع
                                            </Button>
                                            <Button type="submit" className="flex-1 bg-secondary hover:bg-secondary/90 text-white">
                                                تأكيد الدفع
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 animate-bounce">
                                <CheckCircle size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-dark mb-4">تم استلام طلبك بنجاح!</h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                سيتم مراجعة طلبك وتفعيل الاشتراك في خلال دقائق. يمكنك متابعة حالة الطلب من لوحة التحكم.
                            </p>
                            <p className="text-sm text-gray-400 mb-8">جاري تحويلك للرئيسية...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
