import { useState } from 'react';
import { useData } from '../../context/DataContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Search, UserPlus, CheckCircle, XCircle } from 'lucide-react';

export default function AdminUsers() {
    const { users, setUsers, grades } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', phone: '', password: '', grade: 1 });

    const filteredUsers = users.filter(u =>
        u.role === 'student' && (u.name.includes(searchTerm) || u.phone.includes(searchTerm))
    );

    const handleAddUser = () => {
        if (!newUser.name || !newUser.phone) return;
        const user = {
            id: `u${Date.now()}`,
            ...newUser,
            role: 'student',
            isSubscribed: false,
            subscribedCourses: []
        };
        setUsers([...users, user]);
        setIsAdding(false);
        setNewUser({ name: '', phone: '', password: '', grade: 1 });
    };

    const toggleSubscription = (userId) => {
        setUsers(users.map(u => {
            if (u.id === userId) {
                return { ...u, isSubscribed: !u.isSubscribed };
            }
            return u;
        }));
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الطلاب</h1>
                        <p className="text-gray-500">إضافة وتعديل وحذف الطلاب وإدارة اشتراكاتهم</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                        <UserPlus size={20} />
                        إضافة طالب جديد
                    </Button>
                </header>

                {/* Search */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="بحث بالاسم أو رقم الهاتف..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Add Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">بيانات الطالب الجديد</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    placeholder="الاسم ثلاثي"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                />
                                <Input
                                    placeholder="رقم الهاتف"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                />
                                <Input
                                    placeholder="كلمة المرور"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newUser.grade}
                                    onChange={(e) => setNewUser({ ...newUser, grade: Number(e.target.value) })}
                                >
                                    {grades.map(g => (
                                        <option key={g.id} value={g.id}>{g.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => setIsAdding(false)}>إلغاء</Button>
                                <Button onClick={handleAddUser}>حفظ الطالب</Button>
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
                                <th className="p-4 font-bold text-gray-600">رقم الهاتف</th>
                                <th className="p-4 font-bold text-gray-600">الصف</th>
                                <th className="p-4 font-bold text-gray-600">الحالة</th>
                                <th className="p-4 font-bold text-gray-600">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-secondary">{user.name}</td>
                                    <td className="p-4 text-gray-500">{user.phone}</td>
                                    <td className="p-4 text-gray-500">{grades.find(g => g.id === user.grade)?.title}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => toggleSubscription(user.id)}
                                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors ${user.isSubscribed ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        >
                                            {user.isSubscribed ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    مشترك
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} />
                                                    غير مشترك
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(user.id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            لا يوجد طلاب مطابقين للبحث
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
