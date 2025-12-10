import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { BookOpen, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-4 md:px-6 py-4 shadow-sm"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center gap-2 md:gap-3">
                    <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <BookOpen size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-2xl font-bold text-gray-900 leading-none">منصة الغزالي</span>
                            <span className="text-[10px] md:text-xs text-gray-500 group-hover:text-primary transition-colors hidden sm:block">مع الغزالي أنت في أمان</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                    <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm xl:text-base">الرئيسية</Link>
                    <Link to="/grade/1" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm xl:text-base">الأول الثانوي</Link>
                    <Link to="/grade/2" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm xl:text-base">الثاني الثانوي</Link>
                    <Link to="/grade/3" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm xl:text-base">الثالث الثانوي</Link>
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="flex items-center gap-2 text-gray-700">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary">
                                    <User size={16} />
                                </div>
                                <span className="hidden lg:inline font-medium text-sm">{user.name}</span>
                            </div>

                            <Link to="/dashboard">
                                <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-primary/5 text-sm">لوحة التحكم</Button>
                            </Link>

                            {user.role === 'admin' && (
                                <Link to="/admin">
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Admin</span>
                                </Link>
                            )}

                            <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-primary/5 flex items-center gap-2 text-sm">
                                    <LogOut size={16} className="rotate-180" />
                                    <span className="hidden lg:inline">تسجيل الدخول</span>
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-primary hover:bg-primary/90 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold flex items-center gap-2 text-sm">
                                    <User size={16} />
                                    <span className="hidden lg:inline">إنشاء حساب</span>
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-gray-700 hover:text-primary transition-colors p-2"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 mt-4 pt-4 overflow-hidden"
                    >
                        <div className="flex flex-col gap-3">
                            {/* Mobile Navigation Links */}
                            <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>الرئيسية</Link>
                            <Link to="/grade/1" className="text-gray-600 hover:text-primary font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>الصف الأول الثانوي</Link>
                            <Link to="/grade/2" className="text-gray-600 hover:text-primary font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>الصف الثاني الثانوي</Link>
                            <Link to="/grade/3" className="text-gray-600 hover:text-primary font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>الصف الثالث الثانوي</Link>

                            <div className="border-t border-gray-100 my-2"></div>

                            {/* Mobile Auth Buttons */}
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 text-gray-700 py-2 px-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary">
                                            <User size={16} />
                                        </div>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full text-gray-600 hover:text-primary hover:bg-primary/5 justify-start">لوحة التحكم</Button>
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full text-red-600 hover:bg-red-50 justify-start">لوحة الإدارة</Button>
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 hover:bg-red-50 py-2 px-3 rounded-lg text-right font-medium transition-colors">
                                        تسجيل الخروج
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full text-gray-600 hover:text-primary hover:bg-primary/5 justify-start">تسجيل الدخول</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20 font-bold">إنشاء حساب</Button>
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
