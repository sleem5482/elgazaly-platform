import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, BookOpen, FileText, Settings, LogOut, CreditCard, ClipboardList, GraduationCap, Layers, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    const links = [
        { name: 'لوحة التحكم', path: '/admin', icon: LayoutDashboard },
        { name: 'الطلاب', path: '/admin/users', icon: Users },
        { name: 'الكورسات', path: '/admin/courses', icon: BookOpen },
        { name: 'الاشتراكات', path: '/admin/subscriptions', icon: CreditCard },
        { name: 'المحتوى', path: '/admin/content', icon: FileText },
        { name: 'الاختبارات', path: '/admin/exams', icon: ClipboardList },
        { name: 'الصفوف', path: '/admin/grades', icon: GraduationCap },
        { name: 'الشعب', path: '/admin/sections', icon: Layers },
        // { name: 'الإعدادات', path: '/admin/settings', icon: Settings },
    ];

    const [isOpen, setIsOpen] = useState(false);

    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-24 right-4 z-[100] p-3 bg-secondary text-white rounded-full shadow-xl border border-white/20 hover:bg-secondary/90 transition-all"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={15} /> : <Menu size={15} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={closeSidebar}
                />
            )}

            <aside className={cn(
                "bg-secondary text-white shadow-xl h-screen flex flex-col transition-transform duration-300 ease-in-out z-50",
                // Mobile Styles
                "fixed top-0 right-0 w-64",
                isOpen ? "translate-x-0" : "translate-x-full",
                // Desktop Styles
                "md:translate-x-0 md:sticky md:top-0 md:static"
            )}>
                <div className="p-6 border-b border-white/10 flex items-center justify-center">
                    <h2 className="text-2xl font-bold">لوحة الأدمن</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeSidebar}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-white font-bold shadow-sm"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 bg-secondary-dark font-medium">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-white/5 rounded-lg transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
