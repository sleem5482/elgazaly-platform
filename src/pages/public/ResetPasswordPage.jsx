import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    
    // Get token and email from URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('كلمة المرور غير متطابقة');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
            setIsLoading(false);
            return;
        }

        try {
            await resetPassword(email, token, newPassword);
            setIsSubmitted(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء محاولة تغيير كلمة المرور');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">رابط غير صالح</h2>
                    <p className="text-gray-600 mb-6">عذراً، رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية.</p>
                    <Link to="/forgot-password" className="text-primary hover:underline">
                        طلب رابط جديد
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:block relative w-0 flex-1 bg-secondary overflow-hidden order-2">
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary to-primary opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
                    <h1 className="text-6xl font-bold mb-6">كلمة المرور الجديدة</h1>
                    <p className="text-2xl text-white/90 max-w-md leading-relaxed mb-8">
                        قم بتعيين كلمة مرور جديدة قوية لحماية حسابك والعودة للتعلم.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10 order-1">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-secondary mb-2">تعيين كلمة مرور جديدة</h2>
                        <p className="text-gray-500">أدخل كلمة المرور الجديدة وتأكيدها</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pr-10 pl-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="pr-10 pl-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg rounded-xl shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">تم التغيير بنجاح</h3>
                            <p className="text-gray-600 mb-8">
                                تم تغيير كلمة المرور بنجاح. سيتم تحويلك لصفحة تسجيل الدخول...
                            </p>
                            <Link to="/login">
                                <Button
                                    className="w-full"
                                >
                                    الذهاب لتسجيل الدخول
                                </Button>
                            </Link>
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
