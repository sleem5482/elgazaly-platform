import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Copy, RefreshCw } from 'lucide-react';

export default function AdminSubscriptions() {
    const [codes, setCodes] = useState([
        { id: 1, code: 'ABC12345', status: 'active', createdAt: '2023-10-01' },
        { id: 2, code: 'XYZ98765', status: 'used', createdAt: '2023-09-15', usedBy: 'أحمد علي' },
    ]);
    const [generatedCode, setGeneratedCode] = useState('');

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGeneratedCode(result);
        setCodes([{ id: Date.now(), code: result, status: 'active', createdAt: new Date().toISOString().split('T')[0] }, ...codes]);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // In a real app, show a toast notification
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الاشتراكات</h1>
                        <p className="text-gray-500">توليد وإدارة أكواد تفعيل الاشتراكات</p>
                    </div>
                    <Button onClick={generateCode} className="gap-2 shadow-lg">
                        <RefreshCw size={20} />
                        توليد كود جديد
                    </Button>
                </header>

                {/* Generated Code Display */}
                {generatedCode && (
                    <Card className="mb-8 bg-green-50 border-green-200 animate-in fade-in slide-in-from-top-4">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-green-800 mb-1">تم توليد كود جديد بنجاح</h3>
                                <p className="text-green-600">يمكنك نسخ الكود وإرساله للطالب</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                                <span className="font-mono text-xl font-bold tracking-wider text-secondary">{generatedCode}</span>
                                <button onClick={() => copyToClipboard(generatedCode)} className="text-gray-400 hover:text-primary transition-colors" title="نسخ الكود">
                                    <Copy size={20} />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Codes List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600">الكود</th>
                                <th className="p-4 font-bold text-gray-600">الحالة</th>
                                <th className="p-4 font-bold text-gray-600">تاريخ الإنشاء</th>
                                <th className="p-4 font-bold text-gray-600">استخدم بواسطة</th>
                                <th className="p-4 font-bold text-gray-600">نسخ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {codes.map(code => (
                                <tr key={code.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono font-bold text-secondary">{code.code}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${code.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {code.status === 'active' ? 'نشط' : 'مستخدم'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{code.createdAt}</td>
                                    <td className="p-4 text-gray-500">{code.usedBy || '-'}</td>
                                    <td className="p-4">
                                        <button onClick={() => copyToClipboard(code.code)} className="text-gray-400 hover:text-primary transition-colors">
                                            <Copy size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
