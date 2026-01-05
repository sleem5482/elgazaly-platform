import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import { Card } from '../../components/ui/Card';
import { PlayCircle, FileText, CheckCircle, Clock, Lock, ChevronLeft } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function WeekPage() {
    const { weekId } = useParams();
    const location = useLocation(); // Add useLocation import
    const { weeks, months, courses, checkSubscription } = useData(); // Keep access to structure data
    const { user } = useAuth();
    
    // Local state for videos
    const [weekLessons, setWeekLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Context lookups
    // Use state passed from MonthPage if available, otherwise find in context (type-safe)
    const week = location.state?.week || weeks.find(w => w.id == weekId) || { title: 'تفاصيل الأسبوع', description: '' };
    const month = months.find(m => m.id == week?.monthId);
    const course = courses.find(c => c.id == month?.courseId);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Fetch videos for this week
                const data = await studentService.getVideos(weekId);
                if (Array.isArray(data)) {
                    setWeekLessons(data);
                } else {
                    console.error("Videos API did not return an array:", data);
                    setWeekLessons([]);
                }
            } catch (err) {
                console.error("Failed to fetch videos", err);
                setWeekLessons([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [weekId]);

    /* 
       Response Format:
       {
            "id": 6,
            "title": "anything",
            "videoUrl": "https://youtu.be/tg-zHlKNGF0?si=xqdOWCVIeCjzc1cA",
            "duration": 30,
            "orderNumber": 1,
            "videoType": 1, 
            "visibility": 1
       }
    */

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
                        <Link to={`/month/${month?.id}`} className="hover:text-primary">{month?.title || month?.monthName}</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-primary font-bold">{week.title}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-secondary mb-2">{week.title}</h1>
                    <p className="text-gray-500">{week.description}</p>
                </header>

                <div className="space-y-4">
                    {loading ? (
                         <div className="text-center py-10">جاري التحميل...</div>
                    ) : weekLessons.length > 0 ? (
                        weekLessons
                            .filter(l => l.visibility === 1)
                            .sort((a,b) => a.orderNumber - b.orderNumber)
                            .map((lesson, idx) => {
                                // Determine access
                                // videoType: 1 = Free, 2 = Paid
                                const isFree = lesson.videoType === 1;
                                // We need to check if user is subscribed to this week/month
                                // Assuming checkSubscription is available and works with weekId
                                const isSubscribed = user && week ? checkSubscription(user.id, weekId, 'week') : false;
                                const isLocked = !isFree && !isSubscribed;

                                // Inject weekId for context in LessonPage
                                const lessonWithContext = { ...lesson, weekId: weekId };

                                return (
                                    <Link key={lesson.id} to={`/lesson/${lesson.orderNumber}`} state={{ lessonData: lessonWithContext }}>
                                        <Card className={`hover:shadow-md transition-all group border-l-4 relative overflow-hidden ${isLocked ? 'border-l-gray-300 opacity-90' : 'border-l-primary'}`}>
                                            <div className="absolute top-4 left-4 text-gray-200 font-bold text-6xl opacity-20 pointer-events-none">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div className="p-6 flex items-center gap-6 relative z-10">
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors shrink-0 ${isLocked ? 'bg-gray-100' : 'bg-primary/10 group-hover:bg-primary/20'}`}>
                                                    {isLocked ? (
                                                        <Lock size={32} className="text-gray-400" />
                                                    ) : (
                                                        <PlayCircle size={32} className="text-primary" />
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors">{lesson.title}</h3>
                                                        {isFree && <Badge variant="success">مجاني</Badge>}
                                                        {isLocked && <Badge variant="secondary">مدفوع</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            <span>{lesson.duration} دقيقة</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex items-center gap-2 text-gray-400 group-hover:text-primary transition-colors">
                                                    <span className="text-sm font-bold">{isLocked ? 'اشترك للمشاهدة' : 'شاهد الفيديو'}</span>
                                                    <ChevronLeft size={20} />
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                );
                            })
                    ) : (
                        <div className="text-center py-10 text-gray-500">لا يوجد محتوى في هذا الأسبوع</div>
                    )}
                </div>
            </main>
        </div>
    );
}
