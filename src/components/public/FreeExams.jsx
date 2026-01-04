import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import  Button  from '../ui/Button'; 
 
import { studentService } from '../../services/studentService';

export default function FreeExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                // We'll try to fetch all exams and filter for free ones?
                // Or maybe the API returns only allowable exams.
                // Since this is public page, we might expect failure if not auth.
                // But let's try. 
                // If this fails due to 401, we might treat it as "No free exams to show" or handle gracefully.
                // Ideally there should be a public endpoint.
                const allExams = await studentService.getAllExams();
                const freeExams = Array.isArray(allExams) ? allExams.filter(e => e.isFree) : [];
                setExams(freeExams);
            } catch (error) {
                console.error("Failed to fetch exams for home page", error);
                // Fallback or empty
                setExams([]);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (exams.length === 0 && !loading) return null;

    return (
         <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold">مجاناً للجميع</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">اختبر مستواك الآن</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">مجموعة من الامتحانات المجانية لقياس مستواك وتحديد نقاط القوة والضعف</p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {exams.map((exam, idx) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <GraduationCap size={24} />
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold">مجاني</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{exam.title}</h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{exam.description || 'قياس مستوى شامل في المنهج'}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-1">
                                            <Clock size={16} className="text-gray-400" />
                                            <span>{exam.durationMinutes || 60} دقيقة</span>
                                        </div>
                                        <div className="w-px h-4 bg-gray-300"></div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={16} className="text-gray-400" />
                                            <span>{exam.questionsCount || '?'} سؤال</span>
                                        </div>
                                    </div>

                                    <Link to={`/student/exam/${exam.id}`}>
                                        <Button className="w-full bg-white border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 rounded-xl transition-all font-bold flex items-center justify-center gap-2 group-hover:gap-3">
                                            <span>ابدأ الامتحان</span>
                                            <ArrowLeft size={18} />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
