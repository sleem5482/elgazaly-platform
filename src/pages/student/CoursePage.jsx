import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar, ChevronLeft, PlayCircle, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export default function CoursePage() {
    const { courseId } = useParams();
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonths = async () => {
            try {
                // Use getAvailableMonths to show ALL months (subscribed and unsubscribed)
                const data = await studentService.getAvailableMonths(courseId);
                setMonths(data);
                console.log("sleem check",data)
            } catch (err) {
                console.error(err);
                setError('فشل تحميل محتوى الكورس');
            } finally {
                setLoading(false);
            }
        };
        fetchMonths();
    }, [courseId]);

    if (loading) return (
        <div className="flex min-h-screen bg-light items-center justify-center">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
        </div>
    );

    if (error) return (
        <div className="flex min-h-screen bg-light items-center justify-center">
            <div className="text-center text-red-500">
                <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">{error}</h2>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-dark mb-3"
                    >
                        محتوى المنهج
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-lg"
                    >
                        اختر الشهر لبدء رحلة التفوق
                    </motion.p>
                </header>

                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark">شهور المنهج</h2>
                    </div>

                    {months.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {months.map((month, idx) => (
                                <motion.div
                                    key={month.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="group hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden bg-white flex flex-col h-full hover:-translate-y-2">
                                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                                            {/* Gradient Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600 z-10"></div>
                                            
                                            {/* Month Info */}
                                            <div className="absolute inset-0 p-6 z-20 flex flex-col justify-between text-white">
                                                <div className="flex justify-between items-start">
                                                   <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">
                                                        {month.alreadySubscribed ? 'مشترك' : 'غير مشترك'}
                                                   </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm opacity-80 mb-1">شهر {idx + 1}</p>
                                                    <h3 className="text-2xl font-bold">{month.monthName}</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    <span>{new Date(month.startDate).toLocaleDateString('ar-EG')}</span>
                                                </div>
                                                 {/* Placeholder for lecture count if not in API */}
                                                <div className="flex items-center gap-1">
                                                    <PlayCircle size={16} />
                                                    <span>محتوى تعليمي</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                {month.alreadySubscribed ? (
                                                    <Link to={`/month/${month.id}`} state={{ month, courseId }} className="block">
                                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                                                            <span>عرض المحتوى</span>
                                                            <ChevronLeft size={18} />
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Link to="/payment" className="block">
                                                        <Button 
                                                            className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl shadow-lg shadow-secondary/20 group-hover:shadow-secondary/40 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <span>اشترك في الشهر</span>
                                                            <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-sm">
                                                                <AlertCircle size={14} />
                                                            </div>
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-lg">لا يوجد شهور متاحة حالياً.</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
