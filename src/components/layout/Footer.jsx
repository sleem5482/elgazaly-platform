import { Facebook, Youtube, Instagram, Phone, Mail, MapPin, Heart, Code, Sparkles, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-3xl font-black mb-6 block flex items-center gap-3">
                            <img src="/ghazali.png" alt="منصة الغزالي" className="w-12 h-12 object-contain" />
                            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                منصة الغزالي
                            </span>
                        </Link>
                        <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                            منصة تعليمية رائدة تهدف إلى تيسير تعلم اللغة العربية للمرحلة الثانوية بأساليب حديثة ومبتكرة.
                            نحن هنا لنضمن تفوقك ووصولك إلى الدرجة النهائية.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                    <Users size={20} />
                                    <span className="text-2xl font-black text-white">+10K</span>
                                </div>
                                <p className="text-xs text-gray-400">طالب ناجح</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2 text-secondary mb-1">
                                    <Award size={20} />
                                    <span className="text-2xl font-black text-white">15+</span>
                                </div>
                                <p className="text-xs text-gray-400">عام خبرة</p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, color: 'from-blue-500 to-blue-600', href: 'https://www.facebook.com/profile.php?id=100076095877895' },
                                { icon: Youtube, color: 'from-red-500 to-red-600', href: 'https://www.youtube.com/@eelghazaly' },
                                {
                                    icon: () => (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                        </svg>
                                    ), color: 'from-black to-gray-800', href: 'https://www.tiktok.com/@mohamedalghazaly'
                                },
                                { icon: Phone, color: 'from-green-500 to-green-600', href: 'tel:+201050940343' }
                            ].map((social, idx) => (
                                <motion.a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow`}
                                >
                                    <social.icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-black text-lg mb-6 text-white flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                            روابط سريعة
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: 'الرئيسية' },
                                { to: '/login', label: 'تسجيل الدخول' },
                                { to: '/register', label: 'إنشاء حساب' },
                                { to: '/grade/1', label: 'الصف الأول الثانوي' },
                                { to: '/grade/2', label: 'الصف الثاني الثانوي' },
                                { to: '/grade/3', label: 'الصف الثالث الثانوي' }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all rounded-full" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-black text-lg mb-6 text-white flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                            تواصل معنا
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-300">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Phone size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">اتصل بنا</p>
                                    <span dir="ltr" className="font-bold text-white">01050940343</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Mail size={18} className="text-secondary" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">البريد الإلكتروني</p>
                                    <span className="font-bold text-white break-all">info@alghazali.com</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin size={18} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">الموقع</p>
                                    <span className="font-bold text-white">مصر، القاهرة</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} منصة الغزالي</span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1">
                            </span>
                        </p>

                        {/* Developer Info */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 text-sm bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-2.5 rounded-full border border-primary/20"
                        >
                            <Code size={16} className="text-secondary" />
                            <span className="text-gray-300">تم التطوير بواسطة</span>
                            <span className="font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Switch Code</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
