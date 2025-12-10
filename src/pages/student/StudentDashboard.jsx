import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { BookOpen, GraduationCap, Clock, PlayCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export default function StudentDashboard() {
    const { user } = useAuth();
    const { grades } = useData();
    const userGrade = grades.find(g => g.id === user.grade);

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-dark mb-2">مرحباً، {user.name} 👋</h1>
                        <p className="text-gray-600">أنت الآن في: <span className="font-bold text-primary">{userGrade?.title}</span></p>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'نسبة التقدم', value: '0%', icon: BookOpen, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'الامتحانات', value: '0', icon: GraduationCap, color: 'text-secondary', bg: 'bg-secondary/10' },
                        { label: 'ساعات المشاهدة', value: '0', icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
                        { label: 'الدروس المكتملة', value: '0', icon: PlayCircle, color: 'text-green-600', bg: 'bg-green-100' },
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={28} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-dark">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Actions */}
                <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                    <BookOpen className="text-primary" />
                    المحتوى الدراسي
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link to={`/grade/${user.grade}`} className="group">
                        <Card className="h-full hover:shadow-xl transition-all border-none shadow-md bg-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                            <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-lg">
                                    <BookOpen size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-dark mb-3">شرح المنهج</h3>
                                <p className="text-gray-500 mb-8 max-w-sm">شرح تفصيلي لجميع دروس المنهج مع تدريبات واختبارات دورية لضمان التفوق.</p>
                                <span className="text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                    ابدأ المذاكرة <ArrowLeft size={20} />
                                </span>
                            </CardContent>
                        </Card>
                    </Link>

                    <div className="group cursor-not-allowed opacity-80">
                        <Card className="h-full border-2 border-dashed border-gray-200 bg-gray-50/50 shadow-none">
                            <CardContent className="p-8 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-6">
                                    <GraduationCap size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-400 mb-3">المراجعة النهائية</h3>
                                <p className="text-gray-400">ستكون متاحة قريباً</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
