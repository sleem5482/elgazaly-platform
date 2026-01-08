import { useState, useEffect, useEffectEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { FileQuestion, ExternalLink, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';


export default function FreeExams() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    
const { showToast } = useToast();
    useEffect(() => {
        const fetchExams = async () => {
            if (!user) return;
            
            setLoading(true);
            try {

                const data = await studentService.getAllExams();
                if (Array.isArray(data)) {
                    // Filter logic can be applied here if data has a 'type' or 'isFree' field
                    // For now assuming all returned from this endpoint are relevant 
                    setExams(data);
                } else {
                    console.error("Exams data is not an array:", data);
                }
            } catch (err) {
                console.error("Failed to fetch exams", err);
                showToast("error when fetching exams")

            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [user]);
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">الامتحانات المجانية</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        اختبر مستواك الآن مع مجموعة من الامتحانات المميزة
                    </p>
                </div>

                {!user ? (
                   <div className="max-w-2xl mx-auto text-center bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">سجل دخولك لبدء الامتحانات</h3>
                        <p className="text-gray-500 mb-8 text-lg">
                            يجب عليك تسجيل الدخول أولاً لتتمكن من الوصول إلى الامتحانات المجانية وتقييم مستواك.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                onClick={() => navigate('/login')}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                تسجيل الدخول
                            </Button>
                            <Button 
                                onClick={() => navigate('/register')}
                                className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-8 py-3 rounded-xl font-bold text-lg hover:border-primary/50 hover:text-primary transition-all"
                            >
                                إنشاء حساب جديد
                            </Button>
                        </div>
                   </div>
                ) : loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">جاري تحميل الامتحانات...</p>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد امتحانات متاحة حالياً</h3>
                        <p className="text-gray-500">تابعنا قريباً للمزيد من الامتحانات</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-100 flex flex-col"
                            >
                                <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col justify-between relative overflow-hidden">
                                     {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
                                    
                                    <div className="relative z-10 flex justify-between items-start">
                                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg text-white">
                                            <FileQuestion size={24} />
                                        </div>
                                        {/* Optional: Add badge for Free/Premium if available in data */}
                                        <span className="bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                            متاح
                                        </span>
                                    </div>
                                    
                                    <div className="relative z-10 text-white">
                                        <h3 className="text-xl font-bold mb-1 line-clamp-2" title={exam.title}>{exam.title}</h3>
                                        <h4 className='text-secondary font-bold mb-1 line-clamp-2' title={exam.examDate}>{new Date(exam.examDate).toLocaleDateString('ar-EG',{hour: '2-digit', minute: '2-digit'})}</h4>
                                        <div className="flex items-center gap-4 text-sm opacity-90">
                                            <span>{exam.durationMinutes} دقيقة</span>
                                            <span>•</span>
                                            <span>{exam.totalMarks || 0} {exam.totalMarks > 1 ? 'درجات' : 'درجة'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {exam.description || 'اختبر معلوماتك في هذا الامتحان الشامل.'}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <Button
                                            onClick={() => navigate(`/student/exam/${exam.id}`)} /* Adjust route as per app routing */
                                            className="w-full bg-gray-50 hover:bg-primary hover:text-white text-gray-900 border border-gray-200 hover:border-primary py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 group/btn"
                                        >
                                            <span>ابدأ الامتحان</span>
                                            <ArrowLeft size={18} className="group-hover/btn:-translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
