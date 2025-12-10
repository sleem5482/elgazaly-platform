import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { PlayCircle, FileText, CheckCircle, Clock, Lock, ChevronLeft } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function WeekPage() {
    const { weekId } = useParams();
    const { weeks, lessons, months, courses } = useData();

    const week = weeks.find(w => w.id === weekId);
    const weekLessons = lessons.filter(l => l.weekId === weekId);
    const month = months.find(m => m.id === week?.monthId);
    const course = courses.find(c => c.id === month?.courseId);

    if (!week) return <div className="p-8">Week not found</div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Link to="/dashboard" className="hover:text-primary">الرئيسية</Link>
                        <span className="text-gray-300">/</span>
                        <Link to={`/grade/${course?.gradeId}`} className="hover:text-primary">المحتوى</Link>
                        <span className="text-gray-300">/</span>
                        <Link to={`/month/${month?.id}`} className="hover:text-primary">{month?.title}</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-primary font-bold">{week.title}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">{week.title}</h1>
                    <p className="text-gray-500">{week.description}</p>
                </header>

                <div className="space-y-4">
                    {weekLessons.map((lesson, idx) => (
                        <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
                            <Card className="hover:shadow-md transition-all group border-l-4 border-l-transparent hover:border-l-primary relative overflow-hidden">
                                <div className="absolute top-4 left-4 text-gray-200 font-bold text-6xl opacity-20 pointer-events-none">
                                    {String(idx + 1).padStart(2, '0')}
                                </div>
                                <div className="p-6 flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                                        {lesson.type === 'video' ? (
                                            <PlayCircle size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
                                        ) : (
                                            <CheckCircle size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{lesson.title}</h3>
                                            {lesson.type === 'exam' && <Badge variant="warning">اختبار</Badge>}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                <span>{lesson.duration}</span>
                                            </div>
                                            {/* Dummy progress */}
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                                <span>لم يبدأ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                                        <span className="text-sm font-bold">ابدأ الدرس</span>
                                        <ChevronLeft size={20} />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
