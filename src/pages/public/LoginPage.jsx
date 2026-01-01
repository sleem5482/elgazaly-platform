import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Phone, Lock, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const [loginType, setLoginType] = useState('Online'); // 'Online', 'Center', or 'Admin'
    const [identifier, setIdentifier] = useState(''); // phone number, code, or email
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(identifier, password, loginType);
            if (success) {
                // Navigate based on login type
                if (loginType === 'Admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('بيانات الدخول غير صحيحة');
            }
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-primary mb-2">أهلاً بك مجدداً</h2>
                        <p className="text-gray-500 text-lg">جاهز للمذاكرة؟ سجل دخولك الآن</p>
                    </div>

                    {/* Login Type Toggle */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl mb-8">
                        <button
                            type="button"
                            className={`py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'Online' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setLoginType('Online')}
                        >
                            Online
                        </button>
                        <button
                            type="button"
                            className={`py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'Center' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setLoginType('Center')}
                        >
                            Center
                        </button>
                        <button
                            type="button"
                            className={`py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'Admin' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setLoginType('Admin')}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {loginType === 'Admin' ? 'البريد الإلكتروني':loginType === 'Center' ? ' الكود' : 'رقم الهاتف'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    {loginType === 'Admin' ? (
                                        <User className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    )}
                                </div>
                                <Input
                                    type={loginType === 'Admin' ? 'text' : 'text'}
                                    required
                                    className="pr-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    placeholder={loginType === 'Admin' ? 'email' : 'رقم الهاتف أو الكود'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    type="password"
                                    required
                                    className="pr-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="text-left mt-2">
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    نسيت كلمة المرور؟
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            ليس لديك حساب؟{' '}
                            <Link to="/register" className="font-bold text-secondary hover:text-secondary/80 transition-colors">
                                انشئ حساب جديد
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-1 transition-colors">
                            <ArrowLeft size={14} />
                            العودة للرئيسية
                        </Link>
                    </div>
                </div>
            </div>

            {/* Left Side - Image/Branding */}
            <div className="hidden lg:block relative w-0 flex-1 bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
                    <div className="mb-8 bg-white/10 p-8 rounded-full backdrop-blur-sm border border-white/20">
                        <h1 className="text-6xl font-bold mb-2">الغزالي</h1>
                    </div>
                    <h2 className="text-4xl font-bold mb-6">طريقك نحو التفوق</h2>
                    <p className="text-xl text-white/80 max-w-md leading-relaxed">
                        انضم إلى آلاف الطلاب المتفوقين في اللغة العربية واستمتع بتجربة تعليمية فريدة.
                    </p>

                    {/* Decorative Circles */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
