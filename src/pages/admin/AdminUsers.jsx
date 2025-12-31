import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { API_ENDPOINTS } from '../../config/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Search, UserPlus, CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

export default function AdminUsers() {
    const { grades } = useData();
    const { success, error: showError } = useToast();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);
    const [newUser, setNewUser] = useState({ 
        fullName: '', 
        email: '', 
        phoneNumber: '', 
        password: '', 
        gradeId: 1, 
        sectionId: 1, 
        studentType: 2 
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Fetch all students from API
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(API_ENDPOINTS.ADMIN.STUDENTS, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('فشل تحميل قائمة الطلاب');
            }

            const data = await response.json();
            // Filter out admin users (studentType === 0)
            const studentList = Array.isArray(data) ? data.filter(s => s.studentType !== 0) : [];
            setStudents(studentList);
        } catch (err) {
            console.error('Error fetching students:', err);
            setError(err.message || 'حدث خطأ أثناء تحميل قائمة الطلاب');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        (student.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phoneNumber || '').includes(searchTerm) ||
        (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateStudent = async () => {
        if (!newUser.fullName || !newUser.phoneNumber || !newUser.password || !newUser.email) {
            const errorMsg = 'الرجاء ملء جميع الحقول المطلوبة';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        try {
            setSaving(true);
            setError('');
            const payload = {
                fullName: newUser.fullName.trim(),
                email: newUser.email.trim(),
                phoneNumber: newUser.phoneNumber.trim(),
                password: newUser.password,
                gradeId: parseInt(newUser.gradeId),
                sectionId: parseInt(newUser.sectionId),
                studentType: parseInt(newUser.studentType)
            };

            const response = await fetch(API_ENDPOINTS.ADMIN.STUDENTS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'فشل إنشاء الطالب';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Refresh the list
            await fetchStudents();
            setIsAdding(false);
            setNewUser({ 
                fullName: '', 
                email: '', 
                phoneNumber: '', 
                password: '', 
                gradeId: 1, 
                sectionId: 1, 
                studentType: 2 
            });
            success('تم إنشاء الطالب بنجاح! 🎉');
        } catch (err) {
            console.error('Error creating student:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء إنشاء الطالب';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateStudent = async () => {
        if (!newUser.id || !newUser.fullName || !newUser.phoneNumber || !newUser.email) {
            const errorMsg = 'الرجاء ملء جميع الحقول المطلوبة';
            setError(errorMsg);
            showError(errorMsg);
            return;
        }

        try {
            setSaving(true);
            setError('');
            const payload = {
                fullName: newUser.fullName.trim(),
                email: newUser.email.trim(),
                phoneNumber: newUser.phoneNumber.trim(),
                gradeId: parseInt(newUser.gradeId),
                sectionId: parseInt(newUser.sectionId),
                studentType: parseInt(newUser.studentType),
                isActive: newUser.isActive !== undefined ? newUser.isActive : true
            };

            const response = await fetch(API_ENDPOINTS.ADMIN.STUDENT_BY_ID(newUser.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'فشل تحديث بيانات الطالب';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Refresh the list
            await fetchStudents();
            setIsAdding(false);
            setIsEditing(false);
            setNewUser({ 
                fullName: '', 
                email: '', 
                phoneNumber: '', 
                password: '', 
                gradeId: 1, 
                sectionId: 1, 
                studentType: 2 
            });
            success('تم تحديث بيانات الطالب بنجاح! ✨');
        } catch (err) {
            console.error('Error updating student:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء تحديث بيانات الطالب';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
            return;
        }

        try {
            setError('');
            const url = API_ENDPOINTS.ADMIN.STUDENT_BY_ID(id);
            console.log('Deleting student:', { id, url });
            
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
                let errorMessage = 'فشل حذف الطالب';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } catch (e) {
                    errorMessage = errorText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            // Refresh the list
            await fetchStudents();
            success('تم حذف الطالب بنجاح! 🗑️');
        } catch (err) {
            console.error('Error deleting student:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء حذف الطالب';
            setError(errorMsg);
            showError(errorMsg);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            setError('');
            const response = await fetch(API_ENDPOINTS.ADMIN.TOGGLE_ACTIVE(id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('فشل تغيير حالة الطالب');
            }

            // Refresh the list
            await fetchStudents();
            success(`تم ${currentStatus ? 'تعطيل' : 'تفعيل'} الطالب بنجاح! ${currentStatus ? '⏸️' : '▶️'}`);
        } catch (err) {
            console.error('Error toggling active status:', err);
            const errorMsg = err.message || 'حدث خطأ أثناء تغيير حالة الطالب';
            setError(errorMsg);
            showError(errorMsg);
        }
    };

    const handleEditClick = (student) => {
        setNewUser({
            id: student.id,
            fullName: student.fullName || '',
            email: student.email || '',
            phoneNumber: student.phoneNumber || '',
            password: '', // Don't show password when editing
            gradeId: student.gradeId || 1,
            sectionId: student.sectionId || 1,
            studentType: student.studentType || 2,
            isActive: student.isActive !== undefined ? student.isActive : true
        });
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setIsEditing(false);
        setNewUser({ 
            fullName: '', 
            email: '', 
            phoneNumber: '', 
            password: '', 
            gradeId: 1, 
            sectionId: 1, 
            studentType: 2 
        });
        setError('');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <AdminSidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-gray-500">جاري تحميل قائمة الطلاب...</p>
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
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الطلاب</h1>
                        <p className="text-gray-500">إضافة وتعديل وحذف الطلاب وإدارة حالاتهم</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                        <UserPlus size={20} />
                        إضافة طالب جديد
                    </Button>
                </header>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* View User Modal */}
                {viewingUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setViewingUser(null)}>
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-secondary">بيانات الطالب</h3>
                                    <Button variant="ghost" size="icon" onClick={() => setViewingUser(null)}>
                                        <XCircle size={24} />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-2">الصورة الشخصية</h4>
                                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                            <UserPlus size={48} className="text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-gray-500">الاسم</label>
                                            <p className="font-bold text-lg">{viewingUser.fullName || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">البريد الإلكتروني</label>
                                            <p className="font-bold text-lg">{viewingUser.email || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">رقم الهاتف</label>
                                            <p className="font-bold text-lg">{viewingUser.phoneNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">الصف الدراسي</label>
                                            <p className="font-bold text-lg">{viewingUser.gradeName || grades.find(g => g.id === viewingUser.gradeId)?.title || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">الشعبة</label>
                                            <p className="font-bold text-lg">{viewingUser.sectionName || (viewingUser.sectionId === 1 ? 'علمي' : viewingUser.sectionId === 2 ? 'ادبي' : '-')}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">نوع الطالب</label>
                                            <p className="font-bold text-lg">{viewingUser.studentType === 1 ? 'Center' : viewingUser.studentType === 2 ? 'Online' : '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">الحالة</label>
                                            <p className="font-bold text-lg">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewingUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {viewingUser.isActive ? 'نشط' : 'غير نشط'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Search */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="بحث بالاسم أو رقم الهاتف أو البريد..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Add/Edit Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">{isEditing ? 'تعديل بيانات الطالب' : 'بيانات الطالب الجديد'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    placeholder="الاسم ثلاثي"
                                    value={newUser.fullName}
                                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                />
                                <div className="relative">
                                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        type="email"
                                        placeholder="البريد الإلكتروني"
                                        className="pr-10"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <Input
                                    type="tel"
                                    placeholder="رقم الهاتف"
                                    value={newUser.phoneNumber}
                                    onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                                />
                                {!isEditing && (
                                    <Input
                                        type="password"
                                        placeholder="كلمة المرور"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                )}
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newUser.gradeId}
                                    onChange={(e) => setNewUser({ ...newUser, gradeId: parseInt(e.target.value) })}
                                >
                                    {grades.map(g => (
                                        <option key={g.id} value={g.id}>{g.title}</option>
                                    ))}
                                </select>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newUser.sectionId}
                                    onChange={(e) => setNewUser({ ...newUser, sectionId: parseInt(e.target.value) })}
                                >
                                    <option value={1}>علمي</option>
                                    <option value={2}>ادبي</option>
                                </select>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newUser.studentType}
                                    onChange={(e) => setNewUser({ ...newUser, studentType: parseInt(e.target.value) })}
                                >
                                    <option value={1}>Center</option>
                                    <option value={2}>Online</option>
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={handleCancel} disabled={saving}>إلغاء</Button>
                                <Button 
                                    onClick={isEditing ? handleUpdateStudent : handleCreateStudent} 
                                    disabled={saving}
                                    className="gap-2"
                                >
                                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isEditing ? 'حفظ التعديلات' : 'حفظ الطالب'}
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
                                <th className="p-4 font-bold text-gray-600">البريد الإلكتروني</th>
                                <th className="p-4 font-bold text-gray-600">رقم الهاتف</th>
                                <th className="p-4 font-bold text-gray-600">الصف</th>
                                <th className="p-4 font-bold text-gray-600">الحالة</th>
                                <th className="p-4 font-bold text-gray-600">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-secondary">{student.fullName || 'غير محدد'}</td>
                                    <td className="p-4 text-gray-500">{student.email || '-'}</td>
                                    <td className="p-4 text-gray-500">{student.phoneNumber || 'غير محدد'}</td>
                                    <td className="p-4 text-gray-500">{student.gradeName || grades.find(g => g.id === student.gradeId)?.title || 'غير محدد'}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleActive(student.id, student.isActive)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                                                student.isActive 
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {student.isActive ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    نشط
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} />
                                                    غير نشط
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-green-600 hover:bg-green-50" onClick={() => setViewingUser(student)} title="عرض التفاصيل">
                                            <Search size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleEditClick(student)}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(student.id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            {searchTerm ? 'لا يوجد طلاب مطابقين للبحث' : 'لا يوجد طلاب'}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
