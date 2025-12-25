import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { UserPlus, Phone, Lock, User, GraduationCap, ArrowLeft, Mail } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        grade: '1',
        division: 'scientific',
        studentType: 'platform'
    });
    const { register } = useAuth();
    const { grades } = useData();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.phone || !formData.password) {
                setError('الرجاء ملء جميع الحقول المطلوبة');
                setIsLoading(false);
                return;
            }

            // Prepare data for API expecting Enums/Integers
            // Prepare data for API expecting PascalCase (C# style)
            const gradeId = parseInt(formData.grade);
            
            // Validate grade ID
            if (isNaN(gradeId) || gradeId < 1) {
                setError('الرجاء اختيار صف دراسي صحيح');
                setIsLoading(false);
                return;
            }

            const apiData = {
                FullName: formData.name.trim(),
                PhoneNumber: formData.phone.trim(),
                Password: formData.password,
                ConfirmPassword: formData.password,
                GradeId: gradeId,
                StudentType: formData.studentType === 'platform' ? 0 : 1,
                Division: formData.division === 'scientific' ? 0 : 1,
            };

            // UserName is typically required by ASP.NET Identity
            // Use email if provided, otherwise use phone number
            if (formData.email && formData.email.trim()) {
                apiData.Email = formData.email.trim();
                apiData.UserName = formData.email.trim();
            } else {
                // Use phone number as username if email is not provided
                apiData.UserName = formData.phone.trim();
                // Some APIs require Email field even if empty
                apiData.Email = formData.phone.trim() + '@elghazaly.com';
            }

            console.log('Registration payload:', JSON.stringify(apiData, null, 2));
            await register(apiData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.');
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
                    <h1 className="text-6xl font-bold mb-6">انضم للأبطال</h1>
                    <p className="text-2xl text-white/90 max-w-md leading-relaxed mb-8">
                        سجل حسابك الآن وابدأ رحلة التفوق في اللغة العربية مع الغزالي.
                    </p>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <h3 className="text-2xl font-bold mb-1">+500</h3>
                            <p className="text-sm opacity-80">درس تعليمي</p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <h3 className="text-2xl font-bold mb-1">+1000</h3>
                            <p className="text-sm opacity-80">سؤال وتدريب</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10 order-1">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-secondary mb-2">حساب جديد</h2>
                        <p className="text-gray-500">املأ البيانات التالية لإنشاء حسابك</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم ثلاثي</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    required
                                    className="pr-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    placeholder="اسمك بالكامل"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    type="email"
                                    className="pr-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    type="tel"
                                    required
                                    className="pr-10 py-3 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                    placeholder="01xxxxxxxxx"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الصف الدراسي</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-right"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                >
                                    {grades.map(g => (
                                        <option key={g.id} value={g.id}>{g.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الشعبة</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    className="w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none text-right"
                                    value={formData.division}
                                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                >
                                    <option value="scientific">علمي</option>
                                    <option value="literary">أدبي</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الطالب</label>
                            <div className="flex gap-4">
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="studentType"
                                        value="platform"
                                        checked={formData.studentType === 'platform'}
                                        onChange={(e) => setFormData({ ...formData, studentType: e.target.value })}
                                        className="hidden peer"
                                    />
                                    <div className="py-3 px-4 rounded-xl border-2 border-gray-200 text-center text-gray-500 peer-checked:border-secondary peer-checked:text-secondary peer-checked:bg-secondary/5 transition-all">
                                        طالب منصة
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="studentType"
                                        value="center"
                                        checked={formData.studentType === 'center'}
                                        onChange={(e) => setFormData({ ...formData, studentType: e.target.value })}
                                        className="hidden peer"
                                    />
                                    <div className="py-3 px-4 rounded-xl border-2 border-gray-200 text-center text-gray-500 peer-checked:border-secondary peer-checked:text-secondary peer-checked:bg-secondary/5 transition-all">
                                        طالب سنتر
                                    </div>
                                </label>
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg rounded-xl shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                                سجل دخولك
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
        </div>
    );
}
