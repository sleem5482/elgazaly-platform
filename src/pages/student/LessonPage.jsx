import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import { PlayCircle, FileText, CheckCircle, ChevronLeft, ChevronRight, Lock, AlertCircle, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import ExamRunner from '../../components/student/ExamRunner';
import { studentService } from '../../services/studentService';

export default function LessonPage() {
    const { lessonId } = useParams();
    const { lessons, weeks, checkSubscription } = useData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('video');

    const lesson = lessons.find(l => l.id === lessonId);
    const week = weeks.find(w => w.id === lesson?.weekId);
    const weekLessons = lessons.filter(l => l.weekId === lesson?.weekId);

    // Real subscription check
    const isSubscribed = user && week ? checkSubscription(user.id, week.id, 'week') : false;

    if (!lesson) return <div className="p-8">Lesson not found</div>;

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link to={`/week/${week?.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50 text-gray-500">
                                <ChevronRight size={24} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-dark">{lesson.title}</h1>
                            <p className="text-xs text-gray-500">{week?.title}</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
                        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Right Column: Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Video Player / Exam Area */}
                                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl relative aspect-video group">
                                    {!isSubscribed ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark/90 text-white z-20 backdrop-blur-sm p-8 text-center">
                                            <Lock size={48} className="text-accent mb-4" />
                                            <h2 className="text-2xl font-bold mb-2">هذا المحتوى مغلق</h2>
                                            <p className="text-gray-300 mb-6">يجب عليك الاشتراك في الكورس لتتمكن من مشاهدة هذا الدرس</p>
                                            <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg shadow-secondary/20">
                                                اشترك الآن
                                            </Button>
                                        </div>
                                    ) : null}

                                    {activeTab === 'video' ? (
                                        <iframe
                                            src={studentService.getVideoStreamUrl(lesson.id)}
                                            title={lesson.title}
                                            className="w-full h-full"
                                            allowFullScreen
                                        ></iframe>
                                    ) : activeTab === 'exam' ? (
                                        <div className="w-full h-full bg-white overflow-y-auto">
                                            {lesson.examId ? (
                                                <div className="p-4">
                                                    <ExamRunner examId={lesson.examId} />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full p-8">
                                                    <AlertCircle size={64} className="text-gray-300 mb-4" />
                                                    <h2 className="text-xl font-bold text-gray-400">لا يوجد اختبار لهذا الدرس</h2>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white">
                                            <p>فيديو الحل غير متاح حالياً</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
                                    {[
                                        { id: 'video', label: 'فيديو الشرح', icon: PlayCircle },
                                        { id: 'exam', label: 'الاختبار', icon: FileText },
                                        { id: 'solution', label: 'فيديو الحل', icon: CheckCircle },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all whitespace-nowrap",
                                                activeTab === tab.id
                                                    ? "bg-primary text-white shadow-md"
                                                    : "text-gray-500 hover:bg-gray-50"
                                            )}
                                        >
                                            <tab.icon size={18} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold mb-4 text-dark border-b border-gray-100 pb-2">عن الدرس</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        شرح تفصيلي لدرس {lesson.title}. يرجى التركيز في الفيديو وحل الاختبار بعد الانتهاء لضمان استيعاب النقاط الهامة.
                                    </p>
                                </div>
                            </div>

                            {/* Left Column: Advice Poster & Playlist */}
                            <div className="space-y-6">
                                {/* Advice Poster */}
                                <div className="bg-gradient-to-br from-secondary to-orange-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Star className="text-accent fill-accent" />
                                            <h3 className="font-bold text-lg">نصيحة الغزالي</h3>
                                        </div>
                                        <p className="text-white/90 leading-relaxed font-medium mb-4">
                                            "لا تؤجل عمل اليوم إلى الغد. المذاكرة أولاً بأول هي سر التفوق. ابدأ الآن ولا تتردد!"
                                        </p>
                                        <div className="w-full h-1 bg-white/20 rounded-full">
                                            <div className="w-2/3 h-full bg-accent rounded-full"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Playlist */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[500px]">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                        <h3 className="font-bold text-dark">محتويات الأسبوع</h3>
                                        <p className="text-xs text-gray-500 mt-1">{weekLessons.length} دروس</p>
                                    </div>
                                    <div className="p-2 space-y-1 overflow-y-auto flex-1">
                                        {weekLessons.map((l, idx) => (
                                            <Link key={l.id} to={`/lesson/${l.id}`}>
                                                <div className={cn(
                                                    "p-3 rounded-xl flex gap-3 cursor-pointer transition-all group",
                                                    l.id === lessonId ? "bg-primary text-white shadow-md" : "hover:bg-gray-50 text-gray-700"
                                                )}>
                                                    <div className="mt-1 shrink-0">
                                                        {l.type === 'video' ? (
                                                            <PlayCircle size={16} className={l.id === lessonId ? "text-white" : "text-gray-400 group-hover:text-primary"} />
                                                        ) : (
                                                            <CheckCircle size={16} className={l.id === lessonId ? "text-white" : "text-green-500"} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold line-clamp-2">
                                                            {idx + 1}. {l.title}
                                                        </p>
                                                        <p className={cn("text-xs mt-1", l.id === lessonId ? "text-white/80" : "text-gray-400")}>{l.duration}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
