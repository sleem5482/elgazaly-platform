import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'يناير', students: 400 },
    { name: 'فبراير', students: 300 },
    { name: 'مارس', students: 600 },
    { name: 'أبريل', students: 800 },
    { name: 'مايو', students: 500 },
    { name: 'يونيو', students: 900 },
];

export default function AdminDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-secondary mb-2">لوحة التحكم</h1>
                    <p className="text-gray-500">نظرة عامة على أداء المنصة</p>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'إجمالي الطلاب', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                        { label: 'الكورسات النشطة', value: '12', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
                        { label: 'الإيرادات', value: '50,000 ج.م', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
                        { label: 'نسبة النمو', value: '+15%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-sm">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-6 text-secondary">نمو الطلاب</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="students" fill="#e63946" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-6 text-secondary">آخر النشاطات</h3>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                        S
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-secondary">تم تسجيل طالب جديد</p>
                                        <p className="text-xs text-gray-500">منذ {i} ساعة</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
