import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Footer from '../../components/layout/Footer';
import { PlayCircle, UserPlus, ArrowLeft, Star, Shield, Clock, CheckCircle, Users, BookOpen, Award } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden relative">
            {/* Background Shapes */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

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
                            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-orange-100">
                                <Star size={16} className="fill-orange-600" />
                                <span>المنصة رقم 1 في اللغة العربية</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900">
                                <span className="text-primary block mb-2">مع الغزالي</span>
                                <span>أنت في أمان</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                                منصة تعليمية متخصصة في تدريس اللغة العربية للمرحلة الثانوية
                                <br />
                                <span className="text-secondary font-bold mt-2 block">أولى ثانوي - ثانية ثانوي - ثالثة ثانوي</span>
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/register" className="w-full sm:w-auto">
                                    <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all w-full font-bold">
                                        ابدأ رحلتك الآن
                                    </Button>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <Button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-100 text-lg px-8 py-4 rounded-xl hover:border-primary/30 hover:text-primary transition-all w-full font-bold">
                                        دخول المنصة
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1 relative"
                        >
                            <div className="relative w-full max-w-lg mx-auto aspect-square">
                                {/* Animated Background Blob */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>

                                {/* Image Container */}
                                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-gray-200 bg-white flex items-center justify-center group">
                                    {/* Placeholder for User Image */}
                                    <div className="text-center p-8">
                                        <Shield size={120} className="text-primary mx-auto mb-4 drop-shadow-md" />
                                        <p className="text-gray-400 text-sm font-bold">صورة الأستاذ / الغلاف</p>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                        <Award size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold">خبرة أكثر من</p>
                                        <p className="text-lg font-black text-gray-900">15 عاماً</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold">طلابنا</p>
                                        <p className="text-lg font-black text-gray-900">+10,000</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gray-50 py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: Users, label: "طالب وطالبة", value: "+10,000", color: "text-blue-600", bg: "bg-blue-100" },
                                { icon: BookOpen, label: "درس تعليمي", value: "+500", color: "text-orange-600", bg: "bg-orange-100" },
                                { icon: CheckCircle, label: "امتحان وتدريب", value: "+1,200", color: "text-green-600", bg: "bg-green-100" },
                                { icon: Award, label: "طالب متفوق", value: "+3,000", color: "text-purple-600", bg: "bg-purple-100" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-1">{stat.value}</h3>
                                    <p className="text-gray-500 font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="py-20 container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار منصة الغزالي؟</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">نقدم لك تجربة تعليمية متكاملة تضمن لك التفوق في اللغة العربية</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: Star, title: "شرح مبسط وشامل", desc: "نعتمد أحدث طرق التدريس لتبسيط القواعد والنصوص وجعلها ممتعة وسهلة الفهم." },
                            { icon: Shield, title: "متابعة دورية", desc: "امتحانات أسبوعية وشهرية مع تقارير مفصلة لمستوى الطالب ونقاط الضعف والقوة." },
                            { icon: Clock, title: "وفر وقتك ومجهودك", desc: "ذاكر في أي وقت ومن أي مكان بجودة عالية، مع إمكانية إعادة الدروس بلا حدود." }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-primary/20 transition-all group hover:-translate-y-1">
                                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="py-20 bg-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">جاهز لتبدأ رحلة التفوق؟</h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">انضم الآن إلى آلاف الطلاب الذين حققوا أحلامهم مع منصة الغزالي</p>
                        <Link to="/register">
                            <Button className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-5 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all font-bold">
                                اشترك الآن مجاناً
                            </Button>
                        </Link>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
