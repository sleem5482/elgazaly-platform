import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar, ChevronLeft, Lock, PlayCircle, BookOpen } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

export default function GradePage() {
    const { gradeId } = useParams();
    const { courses, months, checkSubscription } = useData();
    const { user } = useAuth();

    // Find courses for this grade
    const gradeCourses = courses.filter(c => c.gradeId === Number(gradeId));
    // Find months for these courses
    const gradeMonths = months.filter(m => gradeCourses.some(c => c.id === m.courseId));

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
                        اختر الكورس أو الشهر لبدء رحلة التفوق
                    </motion.p>
                </header>

                {/* Explanation Section */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark">شرح المنهج</h2>
                    </div>

                    {gradeMonths.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gradeMonths.map((month, idx) => (
                                <motion.div
                                    key={month.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="group hover:shadow-xl transition-all duration-300 border-none shadow-md overflow-hidden bg-white flex flex-col h-full hover:-translate-y-2">
                                        {/* Thumbnail */}
                                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                                            {month.imageUrl ? (
                                                <img src={month.imageUrl} alt={month.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                                    {/* Placeholder Image Pattern */}
                                                    <div className="absolute inset-0 bg-primary/20 group-hover:scale-110 transition-transform duration-500"></div>
                                                </>
                                            )}
                                            <div className="absolute bottom-4 right-4 z-20 text-white">
                                                <p className="text-xs font-bold opacity-80 mb-1">شهر {month.order}</p>
                                                <h3 className="text-xl font-bold">{month.title}</h3>
                                            </div>
                                            <div className="absolute top-4 left-4 z-20">
                                                {(() => {
                                                    const course = gradeCourses.find(c => c.id === month.courseId);
                                                    return (
                                                        <Badge className="bg-accent text-dark font-bold shadow-lg">
                                                            {course?.price || 500} ج.م
                                                        </Badge>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <CardContent className="p-6 flex-1 flex flex-col">
                                            <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                {month.description || 'شرح تفصيلي لمنهج هذا الشهر مع تدريبات مكثفة وامتحانات دورية.'}
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} />
                                                        <span>1/10 - 31/10</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <PlayCircle size={16} />
                                                        <span>8 محاضرات</span>
                                                    </div>
                                                </div>

                                                {(() => {
                                                    const course = gradeCourses.find(c => c.id === month.courseId);
                                                    const isSubscribed = checkSubscription(user?.id, course?.id, 'course');

                                                    return isSubscribed ? (
                                                        <Link to={`/month/${month.id}`} className="block">
                                                            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                                                                <span>ابدأ المذاكرة</span>
                                                                <ChevronLeft size={18} />
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <Link to="/payment" state={{ itemType: 'course', itemTitle: course?.title, price: course?.price || 500, itemId: course?.id }} className="block">
                                                            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl shadow-lg shadow-secondary/20 group-hover:shadow-secondary/40 transition-all flex items-center justify-center gap-2">
                                                                <span>اشترك في الكورس - {course?.price || 500} ج.م</span>
                                                                <Lock size={18} />
                                                            </Button>
                                                        </Link>
                                                    );
                                                })()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-lg">لا يوجد محتوى متاح حالياً لهذا الصف.</p>
                        </div>
                    )}
                </section>

                {/* Final Revision Section (Placeholder) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
                            <PlayCircle size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark">المراجعة النهائية</h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200"
                    >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mb-2">المحتوى غير متاح حالياً</h3>
                        <p className="text-gray-500">سيتم فتح باب الاشتراك في المراجعة النهائية قريباً</p>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
