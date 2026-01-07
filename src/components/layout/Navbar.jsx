import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { BookOpen, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-200 px-4 md:px-6 py-3 shadow-lg shadow-gray-200/50"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center gap-2 md:gap-3">
                    <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary via-orange-500 to-secondary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/30 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                            <img src="/ghazali.png" alt="elgazaly icon" className="w-full h-full object-cover" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-black text-gray-900 leading-none bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">منصة الغزالي</span>
                            <span className="text-[10px] md:text-xs text-gray-500 group-hover:text-primary transition-colors hidden sm:flex items-center gap-1">
                                <Sparkles size={10} className="text-primary" />
                                مع الغزالي أنت في أمان
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-1">
                    {[
                        { to: '/', label: 'الرئيسية' },
                        { to: '/grade/1', label: 'الأول الثانوي' },
                        { to: '/grade/2', label: 'الثاني الثانوي' },
                        { to: '/grade/3', label: 'الثالث الثانوي' }
                    ].map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.to}
                            className="relative px-4 py-2 text-gray-700 hover:text-primary font-semibold transition-all text-sm group"
                        >
                            <span className="relative z-10">{link.label}</span>
                            <motion.div
                                className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.05 }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-md">
                                    <User size={16} strokeWidth={2.5} />
                                </div>
                                <span className="hidden lg:inline font-bold text-sm">{user.fullName || user.name || 'طالب'}</span>
                            </div>

                            <Link to="/dashboard">
                                <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-primary/10 text-sm font-bold">لوحة التحكم</Button>
                            </Link>

                            {user.role === 'admin' && (
                                <Link to="/admin">
                                    <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-black shadow-lg shadow-red-500/30"
                                    >
                                        Admin
                                    </motion.span>
                                </Link>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={logout}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-primary/10 flex items-center gap-2 text-sm font-bold px-4">
                                    <LogOut size={16} className="rotate-180" />
                                    <span className="hidden lg:inline">تسجيل الدخول</span>
                                </Button>
                            </Link>
                            <Link to="/register">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2.5 rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all font-black flex items-center gap-2 text-sm">
                                        <User size={16} />
                                        <span className="hidden lg:inline">إنشاء حساب</span>
                                    </Button>
                                </motion.div>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-gray-700 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 mt-3 pt-4 overflow-hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {/* Mobile Navigation Links */}
                            {[
                                { to: '/', label: 'الرئيسية' },
                                { to: '/grade/1', label: 'الصف الأول الثانوي' },
                                { to: '/grade/2', label: 'الصف الثاني الثانوي' },
                                { to: '/grade/3', label: 'الصف الثالث الثانوي' }
                            ].map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.to}
                                    className="text-gray-700 hover:text-primary font-semibold transition-colors py-2.5 px-4 hover:bg-primary/5 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="border-t border-gray-200 my-2"></div>

                            {/* Mobile Auth Buttons */}
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 text-gray-700 py-2 px-4 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                                            <User size={16} />
                                        </div>
                                        <span className="font-bold">{user.fullName || user.name || 'طالب'}</span>
                                    </div>
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full text-gray-600 hover:text-primary hover:bg-primary/10 justify-start font-bold">لوحة التحكم</Button>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50 justify-start font-bold">لوحة الإدارة</Button>
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 hover:bg-red-50 py-2.5 px-4 rounded-lg text-right font-bold transition-colors">
                                        تسجيل الخروج
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full text-gray-600 hover:text-primary hover:bg-primary/10 justify-start font-bold">تسجيل الدخول</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-lg shadow-primary/30 font-black">إنشاء حساب</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
