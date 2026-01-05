import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Clock, AlertCircle, Loader2, PlayCircle, GraduationCap, Calendar, Lock } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function ExamsPage() {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
             // Default to grade 1 if not found, to match user request "1 means first secondary"
             // Ideally we should handle "no grade" case
             const gradeId = user?.gradeId || user?.grade || 1;
             
            try {
                // Fetch exams for the specific course/grade
                const data = await studentService.getCourseExams(gradeId);
                setExams(data);
            } catch (error) {
                console.error('Failed to fetch exams', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (user) {
            fetchExams();
        } else {
             setLoading(false);
        }
    }, [user]);

    const getAccessBadge = (accessType) => {
        if (accessType === 'Free' || accessType === '0') {
            return <Badge className="bg-green-100 text-green-700">مجاني</Badge>;
        }
        return <Badge className="bg-blue-100 text-blue-700">منصة</Badge>;
    };

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-dark mb-2">الامتحانات</h1>
                    <p className="text-gray-600">اختبر مستواك باستمرار لضمان التفوق</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-primary w-8 h-8" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.length > 0 ? exams.map((exam) => {
                            // Check access type mapping
                            const isFree = exam.accessType === 'Free' || exam.accessType === '0';
                            const canStart = exam.canStart; // Boolean from API

                            return (
                                <Card key={exam.id} className="border-none shadow-md bg-white hover:shadow-lg transition-all group">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-xl ${isFree ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'} transition-colors`}>
                                                <GraduationCap size={24} />
                                            </div>
                                            {getAccessBadge(exam.accessType)}
                                        </div>

                                        <h3 className="text-xl font-bold text-dark mb-2 line-clamp-1" title={exam.title}>{exam.title}</h3>
                                        
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                            <Calendar size={14} />
                                            <span dir="ltr">{new Date(exam.examDate).toLocaleDateString('ar-EG', {
                                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                <span>{exam.durationMinutes} دقيقة</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <AlertCircle size={16} />
                                                <span>{exam.totalMarks} {exam.totalMarks > 1 ? 'درجات' : 'درجة'}</span>
                                            </div>
                                        </div>

                                        <Link to={canStart ? `/student/exam/${exam.id}` : '#'} className="block">
                                            <Button 
                                                className="w-full gap-2" 
                                                variant={canStart ? (isFree ? 'success' : 'primary') : 'secondary'}
                                                disabled={!canStart}
                                            >
                                                {canStart ? (
                                                    <>
                                                        <PlayCircle size={18} />
                                                        ابدأ الامتحان
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock size={18} />
                                                        غير متاح
                                                    </>
                                                )}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        }) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-400 mb-4 flex justify-center"><AlertCircle size={48} /></div>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد امتحانات متاحة</h3>
                                <p className="text-gray-500">تابع الكورسات والدروس لتظهر لك الامتحانات الجديدة</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
