import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء محاولة استعادة كلمة المرور');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:block relative w-0 flex-1 bg-secondary overflow-hidden order-2">
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary to-primary opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
                    <h1 className="text-6xl font-bold mb-6">استعادة الحساب</h1>
                    <p className="text-2xl text-white/90 max-w-md leading-relaxed mb-8">
                        لا تقلق، سنساعدك في استعادة كلمة المرور الخاصة بك والعودة للتعلم.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10 order-1">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-secondary mb-2">نسيت كلمة المرور؟</h2>
                        <p className="text-gray-500">أدخل البريد الإلكتروني أو رقم الهاتف لاستعادة حسابك</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني / رقم الهاتف</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        required
                                        className="pr-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg rounded-xl shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح</h3>
                            <p className="text-gray-600 mb-8">
                                تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.
                            </p>
                            <Button
                                onClick={() => setIsSubmitted(false)}
                                variant="outline"
                                className="w-full"
                            >
                                إرسال مرة أخرى
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-1 transition-colors">
                            <ArrowLeft size={14} />
                            العودة لتسجيل الدخول
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
