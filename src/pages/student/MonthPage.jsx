import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { PlayCircle, FileText, CheckCircle, ChevronLeft, Clock, Lock } from 'lucide-react';

export default function MonthPage() {
    const { monthId } = useParams();
    const { months, courses } = useData(); // Keep utilizing context for parent data if available, or fetch
    const { user } = useAuth();
    
    // Local state for weeks
    const [monthWeeks, setMonthWeeks] = useState([]);
    const [loading, setLoading] = useState(true);

    const month = months.find(m => m.id === monthId) || { title: 'تفاصيل الشهر', description: '' };
    const course = courses.find(c => c.id === month?.courseId);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const data = await studentService.getAvailableWeeks(monthId);
                setMonthWeeks(data);
            } catch (err) {
                console.error("Failed to fetch weeks", err);
            } finally {
                setLoading(false);
            }
        };
        if (monthId) {
            fetchWeeks();
        }
    }, [monthId]);

    // if (!month) return <div className="p-8">Month not found</div>; // Context might be empty initially, handle gracefully

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link to="/dashboard" className="hover:text-primary transition-colors">الرئيسية</Link>
                        <span className="text-gray-300">/</span>
                        <Link to={`/grade/${course?.gradeId}`} className="hover:text-primary transition-colors">المحتوى</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-primary font-bold">{month.title || month.monthName}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-dark mb-2">{month.title || month.monthName}</h1>
                    <p className="text-gray-600">{month.description}</p>
                </header>

                <div className="space-y-6">
                    {loading ? (
                         <div className="text-center py-10">جاري التحميل...</div>
                    ) : monthWeeks.length > 0 ? (
                        monthWeeks.map((week) => (
                            <Card key={week.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-none shadow-md bg-white">
                                <div className="flex flex-col md:flex-row">
                                    <div className="bg-primary p-8 flex items-center justify-center md:w-48 group-hover:bg-primary/90 transition-colors relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="text-center relative z-10 text-white">
                                            <p className="font-bold text-2xl mb-1">{week.title}</p>
                                            <div className="flex items-center justify-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">
                                                <Clock size={12} />
                                                <span>4 حصص</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">{week.description || week.title}</h3>
                                                <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                                                    {week.description || 'اضغط لبدء المذاكرة'}
                                                </p>
                                            </div>
                                            <div className="hidden md:block">
                                                <Link to={`/week/${week.id}`} state={{ week }}>
                                                    <button className="bg-secondary text-white px-6 py-2 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20 hover:-translate-y-1">
                                                        <span>ابدأ المذاكرة</span>
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex gap-6">
                                                {/* Features badges - static for now as per design */}
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <PlayCircle size={18} className="text-primary" />
                                                    <span>فيديو الشرح</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <FileText size={18} className="text-secondary" />
                                                    <span>ملفات PDF</span>
                                                </div>
                                            </div>
                                            <Link to={`/week/${week.id}`} state={{ week }} className="md:hidden text-secondary font-bold text-sm flex items-center gap-1">
                                                <span>ابدأ</span>
                                                <ChevronLeft size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">لا توجد أسابيع متاحة في هذا الشهر.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
