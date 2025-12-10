import { useData } from '../../context/DataContext';
import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Badge from '../../components/ui/Badge';

export default function ExamsPage() {
    const { exams } = useData();

    // Dummy status logic
    const getStatus = (examId) => {
        const statuses = ['completed', 'pending', 'locked'];
        return statuses[examId % 3];
    };

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-dark mb-2">الامتحانات</h1>
                    <p className="text-gray-600">اختبر مستواك باستمرار لضمان التفوق</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => {
                        const status = getStatus(exam.id);
                        return (
                            <Card key={exam.id} className="border-none shadow-md bg-white hover:shadow-lg transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <FileText size={24} />
                                        </div>
                                        {status === 'completed' && <Badge className="bg-green-100 text-green-700">مكتمل</Badge>}
                                        {status === 'pending' && <Badge className="bg-yellow-100 text-yellow-700">متاح الآن</Badge>}
                                        {status === 'locked' && <Badge className="bg-gray-100 text-gray-500">مغلق</Badge>}
                                    </div>

                                    <h3 className="text-xl font-bold text-dark mb-2">{exam.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            <span>30 دقيقة</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <AlertCircle size={14} />
                                            <span>20 سؤال</span>
                                        </div>
                                    </div>

                                    {status === 'completed' ? (
                                        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-600">الدرجة:</span>
                                            <span className="text-lg font-bold text-green-600">18/20</span>
                                        </div>
                                    ) : status === 'pending' ? (
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20">
                                            ابدأ الامتحان
                                        </Button>
                                    ) : (
                                        <Button disabled className="w-full bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
                                            غير متاح
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
