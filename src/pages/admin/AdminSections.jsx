import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/adminService';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Trash2, Search, Loader2, BookOpen } from 'lucide-react';

export default function AdminSections() {
    const toast = useToast();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newSection, setNewSection] = useState({ name: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch all sections from API
    const fetchSections = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await adminService.getSections();
            setSections(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching sections:', err);
            setError(err.message || 'حدث خطأ أثناء تحميل قائمة الشعب');
            toast.error('فشل تحميل قائمة الشعب');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const filteredSections = sections.filter(section =>
        (section.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateSection = async () => {
        if (!newSection.name || !newSection.name.trim()) {
            const errorMsg = 'الرجاء إدخال اسم الشعبة';
            setError(errorMsg);
            toast.showToast(errorMsg, 'error');
            return;
        }

        try {
            setSaving(true);
            setError('');
            
            await adminService.createSection({ name: newSection.name.trim() });

            // Refresh the list
            await fetchSections();
            setIsAdding(false);
            setNewSection({ name: '' });
            toast.success('تم إنشاء الشعبة بنجاح! 🎉');
        } catch (err) {
            console.error('Error creating section:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء إنشاء الشعبة';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!await toast.confirm('هل أنت متأكد من حذف هذه الشعبة؟')) {
            return;
        }

        try {
            setError('');
            await adminService.deleteSection(id);
            
            // Refresh the list
            await fetchSections();
            toast.success('تم حذف الشعبة بنجاح! 🗑️');
        } catch (err) {
            console.error('Error deleting section:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء حذف الشعبة';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setNewSection({ name: '' });
        setError('');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <AdminSidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-gray-500">جاري تحميل قائمة الشعب...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الشعب</h1>
                        <p className="text-gray-500">إضافة وحذف الشعب الدراسية</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                        <Plus size={20} />
                        إضافة شعبة جديدة
                    </Button>
                </header>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Search */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="بحث باسم الشعبة..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Add Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">بيانات الشعبة الجديدة</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    placeholder="اسم الشعبة"
                                    value={newSection.name}
                                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={handleCancel} disabled={saving}>إلغاء</Button>
                                <Button 
                                    onClick={handleCreateSection} 
                                    disabled={saving}
                                    className="gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    حفظ الشعبة
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600">الاسم</th>
                                <th className="p-4 font-bold text-gray-600">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSections.map(section => (
                                <tr key={section.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-secondary flex items-center gap-2">
                                        <BookOpen size={20} className="text-primary" />
                                        {section.name || 'غير محدد'}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(section.id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSections.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            {searchTerm ? 'لا يوجد شعب مطابقة للبحث' : 'لا يوجد شعب'}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
