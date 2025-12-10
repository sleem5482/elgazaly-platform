import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, BookOpen, GraduationCap, Award, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const links = [
        { name: 'الرئيسية', path: '/dashboard', icon: LayoutDashboard },
        { name: 'الكورسات', path: `/grade/${user?.grade}`, icon: BookOpen },
        { name: 'الامتحانات', path: '/exams', icon: GraduationCap },
        { name: 'الشهادات', path: '/certificates', icon: Award },
        { name: 'الإعدادات', path: '/settings', icon: Settings },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 md:p-8 border-b border-gray-100/50 flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold text-primary drop-shadow-sm">الغزالي</h2>
                <button
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 p-4 md:p-6 space-y-2 md:space-y-3 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block relative"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors relative z-10",
                                isActive
                                    ? "text-primary font-bold"
                                    : "text-gray-600 hover:text-primary"
                            )}>
                                <Icon size={20} className="md:w-[22px] md:h-[22px]" />
                                <span className="text-base md:text-lg">{link.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 md:p-6 border-t border-gray-100/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium group"
                >
                    <LogOut size={20} className="md:w-[22px] md:h-[22px] group-hover:-translate-x-1 transition-transform" />
                    <span className="text-base md:text-lg">تسجيل الخروج</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-72 glass h-screen sticky top-0 hidden md:flex flex-col z-50"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar Toggle Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
            >
                <LayoutDashboard size={24} />
            </button>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.aside
                            initial={{ x: 100 }}
                            animate={{ x: 0 }}
                            exit={{ x: 100 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="md:hidden fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] glass flex flex-col z-50"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
