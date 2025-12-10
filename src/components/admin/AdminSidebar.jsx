import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, BookOpen, FileText, Settings, LogOut, CreditCard } from 'lucide-react';
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
        { name: 'الإعدادات', path: '/admin/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-secondary text-white shadow-lg h-screen sticky top-0 hidden md:flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-center">
                <h2 className="text-2xl font-bold">لوحة الأدمن</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
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

            <div className="p-4 border-t border-white/10 bg-secondary-dark">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-white/5 rounded-lg transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
}
