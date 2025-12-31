import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { API_ENDPOINTS } from '../../config/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Search, Loader2, GraduationCap } from 'lucide-react';

export default function AdminGrades() {
    const { success, error: showError } = useToast();
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newGrade, setNewGrade] = useState({ name: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch all grades from API
    const fetchGrades = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(API_ENDPOINTS.ADMIN.GRADES, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('فشل تحميل قائمة الصفوف');
            }

            const data = await response.json();
            setGrades(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching grades:', err);
            setError(err.message || 'حدث خطأ أثناء تحميل قائمة الصفوف');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    const filteredGrades = grades.filter(grade =>
        (grade.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateGrade = async () => {
        if (!newGrade.name || !newGrade.name.trim()) {
            const errorMsg = 'الرجاء إدخال اسم الصف';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        try {
            setSaving(true);
            setError('');
            const payload = {
                name: newGrade.name.trim()
            };

            const response = await fetch(API_ENDPOINTS.ADMIN.GRADES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'فشل إنشاء الصف';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Refresh the list
            await fetchGrades();
            setIsAdding(false);
            setNewGrade({ name: '' });
            success('تم إنشاء الصف بنجاح! 🎉');
        } catch (err) {
            console.error('Error creating grade:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء إنشاء الصف';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateGrade = async () => {
        if (!newGrade.id || !newGrade.name || !newGrade.name.trim()) {
            const errorMsg = 'الرجاء إدخال اسم الصف';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        try {
            setSaving(true);
            setError('');
            const payload = {
                name: newGrade.name.trim()
            };

            const response = await fetch(API_ENDPOINTS.ADMIN.GRADE_BY_ID(newGrade.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'فشل تحديث بيانات الصف';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Refresh the list
            await fetchGrades();
            setIsAdding(false);
            setIsEditing(false);
            setNewGrade({ name: '' });
            success('تم تحديث بيانات الصف بنجاح! ✨');
        } catch (err) {
            console.error('Error updating grade:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء تحديث بيانات الصف';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الصف؟')) {
            return;
        }

        try {
            setError('');
            const url = API_ENDPOINTS.ADMIN.GRADE_BY_ID(id);
            console.log('Deleting grade:', { id, url });
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Delete response:', { status: response.status, statusText: response.statusText });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Delete error response:', errorText);
                let errorMessage = 'فشل حذف الصف';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Refresh the list
            await fetchGrades();
            success('تم حذف الصف بنجاح! 🗑️');
        } catch (err) {
            console.error('Error deleting grade:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء حذف الصف';
            setError(errorMsg);
            showError(errorMsg);
        }
    };

    const handleEditClick = (grade) => {
        setNewGrade({
            id: grade.id,
            name: grade.name || ''
        });
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setIsEditing(false);
        setNewGrade({ name: '' });
        setError('');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <AdminSidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-gray-500">جاري تحميل قائمة الصفوف...</p>
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
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الصفوف</h1>
                        <p className="text-gray-500">إضافة وتعديل وحذف الصفوف الدراسية</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                        <Plus size={20} />
                        إضافة صف جديد
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
                        placeholder="بحث باسم الصف..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Add/Edit Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">{isEditing ? 'تعديل بيانات الصف' : 'بيانات الصف الجديد'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    placeholder="اسم الصف"
                                    value={newGrade.name}
                                    onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={handleCancel} disabled={saving}>إلغاء</Button>
                                <Button 
                                    onClick={isEditing ? handleUpdateGrade : handleCreateGrade} 
                                    disabled={saving}
                                    className="gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditing ? 'حفظ التعديلات' : 'حفظ الصف'}
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
                            {filteredGrades.map(grade => (
                                <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-secondary flex items-center gap-2">
                                        <GraduationCap size={20} className="text-primary" />
                                        {grade.name || 'غير محدد'}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleEditClick(grade)}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(grade.id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredGrades.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            {searchTerm ? 'لا يوجد صفوف مطابقة للبحث' : 'لا يوجد صفوف'}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
