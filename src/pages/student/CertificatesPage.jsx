import Sidebar from '../../components/layout/Sidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Award, Download, Share2 } from 'lucide-react';

export default function CertificatesPage() {
    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-dark mb-2">شهادات التقدير</h1>
                    <p className="text-gray-600">جوائزك وشهاداتك طوال رحلتك التعليمية</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2].map((cert) => (
                        <Card key={cert} className="border-none shadow-md bg-white overflow-hidden group">
                            <div className="h-48 bg-gray-100 relative flex items-center justify-center p-4 border-b border-gray-100">
                                {/* Certificate Preview Placeholder */}
                                <div className="w-full h-full bg-white border-4 border-double border-accent p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                    <Award size={32} className="text-accent mb-2" />
                                    <h3 className="font-serif font-bold text-dark text-lg">شهادة تقدير</h3>
                                    <p className="text-[10px] text-gray-500 mt-1">تمنح للطالب المتفوق</p>
                                    <p className="font-bold text-primary text-sm mt-1">محمد طارق</p>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-dark mb-2">شهادة تفوق - شهر أكتوبر</h3>
                                <p className="text-gray-500 text-sm mb-6">تم الحصول عليها بتاريخ 1/11/2025</p>

                                <div className="flex gap-3">
                                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center gap-2">
                                        <Download size={18} />
                                        تحميل
                                    </Button>
                                    <Button variant="outline" className="px-4 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-600">
                                        <Share2 size={18} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Empty State Placeholder */}
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Award size={32} />
                        </div>
                        <h3 className="font-bold text-gray-400 mb-2">لا توجد شهادات أخرى</h3>
                        <p className="text-sm text-gray-400">اجتهد في الامتحانات القادمة للحصول على المزيد من الشهادات</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
