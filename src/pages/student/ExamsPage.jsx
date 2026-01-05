import { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { Link } from 'react-router-dom'; // Add Link for navigation
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowLeft, Loader2, PlayCircle, GraduationCap } from 'lucide-react'; // Added icons
import Badge from '../../components/ui/Badge';

export default function ExamsPage() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const data = await studentService.getAllExams();
                // console.log("sleem check data _______________________",data)
                setExams(data);
            } catch (error) {
                console.error('Failed to fetch exams', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

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
                        {exams.length > 0 ? exams.map((exam) => (
                            <Card key={exam.id} className="border-none shadow-md bg-white hover:shadow-lg transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${exam.examType=="Free" ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}>
                                            <GraduationCap size={24} />
                                        </div>
                                         {exam.examType=="Free" ? 
                                            <Badge className="bg-green-100 text-green-700">مجاني</Badge> : 
                                            <Badge className="bg-blue-100 text-blue-700">منصة</Badge>
                                         }
                                    </div>

                                    <h3 className="text-xl font-bold text-dark mb-2">{exam.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">وقت الاختبار: {new Date(exam.examDate).toLocaleDateString('ar-EG',{hour: '2-digit', minute: '2-digit'})}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} />
                                            <span>{exam.durationMinutes } دقيقة</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            <span>{exam.totalMarks || '?'} {exam.totalMarks > 1 ? 'درجات' : 'درجة'}</span>
                                        </div>
                                    </div>

                                    <Link to={`/student/exam/${exam.id}`} className="block">
                                        <Button className="w-full gap-2" variant={exam.isFree ? 'success' : 'primary'}>
                                            <PlayCircle size={18} />
                                            ابدأ الامتحان
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                لا توجد امتحانات متاحة حالياً
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
