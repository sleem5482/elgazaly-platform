import { useState } from 'react';
import { useData } from '../../context/DataContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminCourses() {
    const { courses, setCourses, grades } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', gradeId: 1, description: '', price: 0 });

    const filteredCourses = courses.filter(c => c.title.includes(searchTerm));

    const handleAddCourse = () => {
        if (!newCourse.title) {
            alert('الرجاء إدخال اسم الكورس');
            return;
        }

        if (isEditing) {
            setCourses(courses.map(c => c.id === newCourse.id ? { ...c, ...newCourse, gradeId: Number(newCourse.gradeId) } : c));
            setIsEditing(false);
            alert('تم تعديل الكورس بنجاح');
        } else {
            const course = {
                id: `c${Date.now()}`,
                ...newCourse,
                gradeId: Number(newCourse.gradeId)
            };
            setCourses(prev => [...prev, course]);
            alert('تم إضافة الكورس بنجاح');
        }

        setIsAdding(false);
        setNewCourse({ title: '', gradeId: 1, description: '', price: 0 });
    };

    const handleEditClick = (course) => {
        setNewCourse(course);
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الكورسات</h1>
                        <p className="text-gray-500">إضافة وتعديل وحذف الكورسات الدراسية</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                        <Plus size={20} />
                        إضافة كورس جديد
                    </Button>
                </header>

                {/* Search */}
                <div className="mb-6 relative max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="بحث عن كورس..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Add Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">{isEditing ? 'تعديل الكورس' : 'بيانات الكورس الجديد'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    placeholder="اسم الكورس"
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                />
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    value={newCourse.gradeId}
                                    onChange={(e) => setNewCourse({ ...newCourse, gradeId: e.target.value })}
                                >
                                    {grades.map(g => (
                                        <option key={g.id} value={g.id}>{g.title}</option>
                                    ))}
                                </select>
                                <Input
                                    type="number"
                                    placeholder="سعر الكورس (جنيه)"
                                    value={newCourse.price || ''}
                                    onChange={(e) => setNewCourse({ ...newCourse, price: parseInt(e.target.value) || 0 })}
                                />
                                <Input
                                    placeholder="وصف الكورس"
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => { setIsAdding(false); setIsEditing(false); setNewCourse({ title: '', gradeId: 1, description: '', price: 0 }); }}>إلغاء</Button>
                                <Button onClick={handleAddCourse}>{isEditing ? 'حفظ التعديلات' : 'حفظ الكورس'}</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* List */}
                <div className="space-y-4">
                    {filteredCourses.map(course => (
                        <Card key={course.id} className="hover:shadow-md transition-shadow group">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <p className="text-gray-500 text-sm font-medium bg-gray-100 inline-block px-2 py-1 rounded">{grades.find(g => g.id === course.gradeId)?.title}</p>
                                        {course.price && <p className="text-primary text-sm font-bold bg-primary/10 inline-block px-2 py-1 rounded">{course.price} جنيه</p>}
                                    </div>
                                    <p className="text-gray-400 text-sm">{course.description}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleEditClick(course)}>
                                        <Edit size={18} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(course.id)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            لا توجد كورسات مطابقة للبحث
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
