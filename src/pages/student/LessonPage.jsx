import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import { PlayCircle, FileText, CheckCircle, ChevronRight, Lock, AlertCircle, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

import { studentService } from '../../services/studentService';

export default function LessonPage() {
    const { lessonId } = useParams();
    const location = useLocation();
    const { state } = location;
    
    // Priority: State passed from WeekPage -> Context lookup by orderNumber (if possible)
    const { lessons, weeks, checkSubscription } = useData();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('video');

    // Retrieve lesson from state (primary) or attempt to find by orderNumber in fetched lessons (if we had access to week's lessons here)
    // Since we don't have the week's lessons in global context easily without weekId, we rely heavily on state.
    let lesson = state?.lessonData;
    
    // Fallback: If we have lessons in context, we could try to find by ID if the param WAS an ID. 
    // But now param is orderNumber. Looking up "1" in global lessons (IDs usually 100+) won't work.
    // We strictly rely on state for now, or if we had a "getLessonByOrder(weekId, order)" API.
    
    // Attempt to reconstruct context if missing
    // If we have state.lessonData, it has weekId injected.
    const weekMock = weeks.find(w => w.id == lesson?.weekId); 

    // Helper to get embed URL with security params
    const getEmbedUrl = (url) => {
        if (!url) return '';
        
        let videoId = '';
        try {
            if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('watch?v=')) {
                videoId = url.split('watch?v=')[1]?.split('&')[0];
            } else if (url.includes('embed/')) {
                videoId = url.split('embed/')[1]?.split('?')[0];
            }
        } catch (e) {
            console.error("Error parsing video URL", e);
        }

        // Return enhanced embed URL
        if (videoId) {
            return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=1&iv_load_policy=3`;
        }
        
        return url; 
    };

    if (!lesson) return (
        <div className="flex flex-col min-h-screen bg-light items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الدرس</h2>
            <p className="text-gray-600 mb-6">حدث خطأ في تحميل بيانات الدرس. الرجاء العودة للصفحة السابقة والمحاولة مرة أخرى.</p>
            <Link to="/dashboard">
                <Button variant="secondary">العودة للرئيسية</Button>
            </Link>
        </div>
    );

    // We might need to check subscription status. 
    // If relying on API, the API might filter visibility or we might check a "isSubscribed" field if provided.
    // user provided data doesn't have isSubscribed. 
    // However, logic says if week is active/subscribed. 
    // For now, if we came from WeekPage, we assume access is granted or controlled there. 
    // But let's keep the mock check for safety or default to true if using API data (since visibility filter    // Real subscription check logic
    const isSubscribedToContext = user && weekMock ? checkSubscription(user.id, weekMock.id, 'week') : false;
    const isFree = lesson.videoType === 1;
    // Access is granted if it's free OR if the user is subscribed
    const hasAccess = isFree || isSubscribedToContext;

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link to={`/week/${lesson.weekId || weekMock?.id || ''}`} onClick={(e) => !lesson.weekId && !weekMock && e.preventDefault()}>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50 text-gray-500">
                                <ChevronRight size={24} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-dark">{lesson.title}</h1>
                            <p className="text-xs text-gray-500">{weekMock?.title || 'تفاصيل الدرس'}</p>
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
                                <div 
                                    className="bg-black rounded-2xl overflow-hidden shadow-2xl relative aspect-video group"
                                    onContextMenu={(e) => e.preventDefault()} // Disable right click
                                >
                                    {!hasAccess ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark/90 text-white z-20 backdrop-blur-sm p-8 text-center">
                                            <Lock size={48} className="text-accent mb-4" />
                                            <h2 className="text-2xl font-bold mb-2">هذا المحتوى مغلق</h2>
                                            <p className="text-gray-300 mb-6">يجب عليك الاشتراك في الكورس لتتمكن من مشاهدة هذا الدرس</p>
                                            <Link to="/payment">
                                                <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg shadow-secondary/20">
                                                    اشترك الآن
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : null}
                                    
                                    {/* Security Watermark */}
                                    {hasAccess && activeTab === 'video' && user && (
                                        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none opacity-20">
                                            <div className="w-full h-full flex flex-wrap items-center justify-center gap-24 transform -rotate-12">
                                                {Array.from({ length: 12 }).map((_, i) => (
                                                    <div key={i} className="text-white text-sm font-bold whitespace-nowrap">
                                                        {user.name} - {user.phone || user.email}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'video' ? (
                                        <iframe
                                            src={getEmbedUrl(lesson.videoUrl || studentService.getVideoStreamUrl(lesson.id))}
                                            title={lesson.title}
                                            className="w-full h-full"
                                            allowFullScreen
                                            // sandbox="allow-scripts allow-same-origin allow-presentation" // Optional strict sandbox if needed
                                            style={{ pointerEvents: 'auto' }} // Ensure interaction works but controlled
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                    ) : activeTab === 'exam' ? (
                                        <div className="w-full h-full bg-white overflow-y-auto">
                                            {lesson.examId ? (
                                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                                    <FileText size={64} className="text-primary mb-4" />
                                                    <h3 className="text-xl font-bold mb-2">اختبار الدرس</h3>
                                                    <p className="text-gray-500 mb-6">قم باجتياز الاختبار للتأكد من فهمك للدرس</p>
                                                    <Link to={`/exam/${lesson.examId}`}>
                                                        <Button size="lg" className="px-8 shadow-lg shadow-primary/20">
                                                            بدء الاختبار
                                                        </Button>
                                                    </Link>
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
                                        شرح تفصيلي لدرس {lesson.title}.
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

                                {/* Playlist Mock - Could pass playlist via state or fetch */}
                                {/* Omitted dynamic playlist update for brevity, keeps existing mock or empty if not matched */}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
