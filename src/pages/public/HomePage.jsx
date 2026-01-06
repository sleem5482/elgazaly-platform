import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Footer from '../../components/layout/Footer';
import CoursesList from '../../components/student/CoursesList';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../context/AuthContext';
import { PlayCircle, UserPlus, ArrowLeft, Star, Shield, Clock, CheckCircle, Users, BookOpen, Award, Sparkles, TrendingUp, Lock } from 'lucide-react';
import FreeVideos from '../../components/public/FreeVideos';

export default function HomePage() {
    const navigate = useNavigate();
    // const { user } = useAuth();
    // const [courses, setCourses] = useState([]);
    // const [loadingCourses, setLoadingCourses] = useState(true);

    // useEffect(() => {
    //     const fetchCourses = async () => {
    //         if (!user) {
    //             setLoadingCourses(false);
    //             return;
    //         }
    //         try {
    //             const data = await studentService.getMyCourses();
    //             if (Array.isArray(data)) {
    //                 setCourses(data);
    //             }
    //         } catch (err) {
    //             console.error("Failed to fetch courses", err);
    //         } finally {
    //             setLoadingCourses(false);
    //         }
    //     };
    //     fetchCourses();
    // }, [user]);
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden relative">
            {/* Animated Background Shapes */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
                            x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            <main className="relative z-10">

                {/* Hero Section */}
                <div className="container mx-auto px-4 pt-12 pb-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-10">

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 text-center lg:text-right"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-orange-200 shadow-sm"
                            >
                                <Sparkles size={16} className="animate-pulse" />
                                <span>المنصة رقم 1 في اللغة العربية</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900"
                            >
                                <span className="text-primary block mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">مع الغزالي</span>
                                <span className="relative">
                                    أنت في أمان
                                    <motion.div
                                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8, duration: 0.6 }}
                                    />
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
                            >
                                منصة تعليمية متخصصة في تدريس اللغة العربية للمرحلة الثانوية
                                <br />
                                <span className="text-secondary font-bold mt-2 block">أولى ثانوي - ثانية ثانوي - ثالثة ثانوي</span>
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <Link to="/register" className="w-full sm:w-auto">
                                    <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all w-full font-bold group">
                                        <span>ابدأ رحلتك الآن</span>
                                        <TrendingUp size={20} className="mr-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <Button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-primary/50 text-lg px-8 py-4 rounded-xl hover:text-primary transition-all w-full font-bold shadow-md hover:shadow-lg">
                                        دخول المنصة
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Hero Image - Teacher Photo */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1 relative"
                        >
                            <div className="relative w-full max-w-lg mx-auto">
                                {/* Soft Background Glow */}
                                <motion.div
                                    className="absolute -inset-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-3xl blur-3xl"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 0.8, 0.5]
                                    }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* Main Image Card */}
                                <motion.div
                                    className="relative z-10 bg-white rounded-3xl overflow-hidden shadow-2xl group"
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        {/* Teacher Image */}
                                        <img
                                            src="/teacher.jpg"
                                            alt="الأستاذ الغزالي"
                                            className="w-full h-full object-cover object-center"
                                        />

                                        {/* Subtle Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

                                        {/* Success Badge */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 1, type: "spring", stiffness: 200 }}
                                            className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                                <CheckCircle size={18} className="text-white" strokeWidth={3} />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-gray-900">نتائج مضمونة</p>
                                                <p className="text-xs text-gray-600 font-medium">جودة عالية 100%</p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Floating Achievement Cards */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
                                    transition={{
                                        opacity: { delay: 0.5 },
                                        x: { delay: 0.5 },
                                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    className="absolute -top-6 -right-6 bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-20"
                                >
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Award size={24} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="text-white">
                                        <p className="text-xs font-bold opacity-90">خبرة تدريسية</p>
                                        <p className="text-xl font-black">+15 عاماً</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0, y: [0, 12, 0] }}
                                    transition={{
                                        opacity: { delay: 0.7 },
                                        x: { delay: 0.7 },
                                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
                                    }}
                                    className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl flex items-center gap-3 z-20"
                                >
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Users size={24} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="text-white">
                                        <p className="text-xs font-bold opacity-90">طلاب ناجحون</p>
                                        <p className="text-xl font-black">+10,000</p>
                                    </div>
                                </motion.div>

                                {/* Decorative Elements */}
                                <div className="absolute top-1/4 -right-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-1/4 -left-8 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Stats Section with Animations */}
                <div className="bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: Users, label: "طالب وطالبة", value: "+10,000", color: "blue", gradient: "from-blue-400 to-blue-600" },
                                { icon: BookOpen, label: "درس تعليمي", value: "+500", color: "orange", gradient: "from-orange-400 to-orange-600" },
                                { icon: CheckCircle, label: "امتحان وتدريب", value: "+1,200", color: "green", gradient: "from-green-400 to-green-600" },
                                { icon: Award, label: "طالب متفوق", value: "+3,000", color: "purple", gradient: "from-purple-400 to-purple-600" },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center group cursor-pointer relative overflow-hidden"
                                >
                                    {/* Hover Background Effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                    <motion.div
                                        className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <stat.icon size={28} />
                                    </motion.div>
                                    <motion.h3
                                        className="text-3xl font-black text-gray-900 mb-1"
                                        initial={{ scale: 1 }}
                                        whileInView={{ scale: [1, 1.2, 1] }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                                    >
                                        {stat.value}
                                    </motion.h3>
                                    <p className="text-gray-500 font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid with Enhanced Animations */}
                <div className="py-20 container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار منصة الغزالي؟</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">نقدم لك تجربة تعليمية متكاملة تضمن لك التفوق في اللغة العربية</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: Star, title: "شرح مبسط وشامل", desc: "نعتمد أحدث طرق التدريس لتبسيط القواعد والنصوص وجعلها ممتعة وسهلة الفهم.", gradient: "from-yellow-400 to-orange-500" },
                            { icon: Shield, title: "متابعة دورية", desc: "امتحانات أسبوعية وشهرية مع تقارير مفصلة لمستوى الطالب ونقاط الضعف والقوة.", gradient: "from-blue-400 to-purple-500" },
                            { icon: Clock, title: "وفر وقتك ومجهودك", desc: "ذاكر في أي وقت ومن أي مكان بجودة عالية، مع إمكانية إعادة الدروس بلا حدود.", gradient: "from-green-400 to-teal-500" }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-primary/20 transition-all group relative overflow-hidden"
                            >
                                {/* Animated Background Gradient */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                />

                                <motion.div
                                    className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg`}
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <feature.icon size={32} />
                                </motion.div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Courses Section */}
                {/* <div className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">الكورسات المتاحة</h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto">اختر الكورس المناسب لصفك الدراسي وابدأ رحلة التفوق</p>
                        </motion.div> */}

                        {/* Conditional Rendering for Courses */}
                        {/* {!user ? (
                            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-8">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول مطلوب</h3>
                                <p className="text-gray-500 mb-8">يجب عليك تسجيل الدخول أولاً لعرض الكورسات المتاحة والاشتراك فيها.</p>
                                <Button 
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl shadow-lg transition-all font-bold text-lg"
                                >
                                    تسجيل الدخول لعرض الكورسات
                                </Button>
                            </div>
                        ) : loadingCourses ? (
                            <div className="text-center py-12">جاري تحميل الكورسات...</div>
                        ) : (
                            <CoursesList courses={courses} />
                        )} */}
                    {/* </div>
                </div> */}
 <div className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">الكورسات المتاحة</h2>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto">اختر الكورس المناسب لصفك الدراسي وابدأ رحلة التفوق</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                {
                                    grade: "الصف الأول الثانوي",
                                    price: 500,
                                    color: "from-blue-500 to-cyan-500",
                                    features: ["شرح كامل للمنهج", "امتحانات دورية", "متابعة مستمرة"]
                                },
                                {
                                    grade: "الصف الثاني الثانوي",
                                    price: 600,
                                    color: "from-purple-500 to-pink-500",
                                    features: ["شرح تفصيلي", "تدريبات مكثفة", "مراجعات شاملة"]
                                },
                                {
                                    grade: "الصف الثالث الثانوي",
                                    price: 800,
                                    color: "from-orange-500 to-red-500",
                                    features: ["تحضير للثانوية", "امتحانات نموذجية", "دعم مباشر"]
                                }
                            ].map((course, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group"
                                >
                                    {/* Header with Gradient */}
                                    <div className={`bg-gradient-to-r ${course.color} p-6 text-white relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
                                        <div className="relative z-10">
                                            <BookOpen size={32} className="mb-3" strokeWidth={2} />
                                            <h3 className="text-2xl font-black mb-2">{course.grade}</h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black">{course.price}</span>
                                                <span className="text-lg opacity-90">جنيه</span>
                                            </div>
                                            <p className="text-sm opacity-90 mt-1">دفعة واحدة فقط</p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="p-6">
                                        <ul className="space-y-3 mb-6">
                                            {course.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                                    <div className={`w-6 h-6 bg-gradient-to-br ${course.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                        <CheckCircle size={14} className="text-white" strokeWidth={3} />
                                                    </div>
                                                    <span className="font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link to="/register">
                                            <Button className={`w-full bg-gradient-to-r ${course.color} hover:opacity-90 text-white py-3 rounded-xl shadow-lg transition-all font-bold group-hover:shadow-xl`}>
                                                اشترك الآن
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>


              <FreeVideos/>
            

                {/* CTA Section with Enhanced Design */}
                <div className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <motion.div
                        className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -50, 0],
                            scale: [1.2, 1, 1.2]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 7.5 }}
                    />

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">جاهز لتبدأ رحلة التفوق؟</h2>
                            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">انضم الآن إلى آلاف الطلاب الذين حققوا أحلامهم مع منصة الغزالي</p>
                           
                             
                                    <Button onClick={()=>navigate("/register")} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-xl px-12 py-5 rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all font-bold cursor-pointer">
                                       اشترك الآن مجاناً 
                                    </Button>
                                </motion.div>
                            

                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
