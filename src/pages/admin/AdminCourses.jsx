import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminCourses() {
    const { grades } = useData();
    const toast = useToast();
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // API uses 'name' but UI uses 'title' concept. Mapping: API name -> UI title (state use 'name' to match API or map it). 
    // Let's use 'name' in state to match API.
    const [newCourse, setNewCourse] = useState({ name: '', description: '', price: '', gradeId: 1, sectionId: 1, isActive: true });

    useEffect(() => {
        fetchCourses();
        fetchSections();
    }, []);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
            toast.error('فشل تحميل الكورسات');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSections = async () => {
        try {
            const data = await adminService.getSections();
            setSections(data);
            if (data.length > 0 && !newCourse.sectionId) {
                setNewCourse(prev => ({ ...prev, sectionId: data[0].id }));
            }
        } catch (err) {
            console.error('Failed to fetch sections', err);
        }
    };

    const filteredCourses = courses.filter(c => c.name?.includes(searchTerm) || c.title?.includes(searchTerm));

    const handleAddCourse = async () => {
        if (!newCourse.name) {
            toast.warning('الرجاء إدخال اسم الكورس');
            return;
        }

        try {
            setIsLoading(true);
            const courseData = {
                name: newCourse.name,
                price: newCourse.price,
                description: newCourse.description,
                gradeId: Number(newCourse.gradeId),
                sectionId: Number(newCourse.sectionId),
                isActive: newCourse.isActive
            };
console.log(courseData);
            if (isEditing) {
                // Some backends require ID in the body as well
                await adminService.updateCourse(newCourse.id, { ...courseData, id: newCourse.id });
                toast.success('تم تعديل الكورس بنجاح');
            } else {
                await adminService.createCourse(courseData);
                toast.success('تم إضافة الكورس بنجاح');
            }
            
            setIsAdding(false);
            setNewCourse({ name: '', description: '', price: '', gradeId: 1, sectionId: sections[0]?.id || 1, isActive: true });
            fetchCourses(); // Refresh list
        } catch (err) {
            console.error(err);
            toast.error('حدث خطأ أثناء الحفظ');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (course) => {
        setNewCourse({
            id: course.id,
            name: course.name || course.title, // Handle both just in case
            description: course.description,
            price: course.price,
            gradeId: course.gradeId,
            sectionId: course.sectionId || (sections[0]?.id || 1),
            isActive: course.isActive
        });
        setIsEditing(true);
        setIsAdding(true);
    };

    const handleDelete = async (id) => {
        if (await toast.confirm('هل أنت متأكد من حذف هذا الكورس؟')) {
            try {
                setIsLoading(true);
                await adminService.deleteCourse(id);
                setCourses(courses.filter(c => c.id !== id));
                toast.success('تم حذف الكورس بنجاح');
            } catch (err) {
                console.error(err);
                toast.error('فشل حذف الكورس');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await adminService.toggleCourseActive(id);
            // Optimistic update or refresh? Refresh is safer.
            fetchCourses();
            toast.success(`تم تغيير حالة الكورس بنجاح`);
        } catch (err) {
            console.error(err);
            toast.error('فشل تغيير حالة الكورس');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">إدارة الكورسات</h1>
                        <p className="text-gray-500 text-sm md:text-base">إضافة وتعديل وحذف الكورسات الدراسية</p>
                    </div>
                    <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg w-full md:w-auto justify-center">
                        <Plus size={20} />
                        إضافة كورس جديد
                    </Button>
                </header>

                {/* Search */}
                <div className="mb-6 relative w-full md:max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        placeholder="بحث عن كورس..."
                        className="pr-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Add Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
                        <CardContent className="p-4 md:p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">{isEditing ? 'تعديل الكورس' : 'بيانات الكورس الجديد'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    placeholder="اسم الكورس"
                                    value={newCourse.name}
                                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                />
                                <Input
                                    placeholder="السعر"
                                    type="number"
                                    value={newCourse.price}
                                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                />
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-500">الصف الدراسي</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                        value={newCourse.gradeId}
                                        onChange={(e) => setNewCourse({ ...newCourse, gradeId: e.target.value })}
                                    >
                                        {grades.map(g => (
                                            <option key={g.id} value={g.id}>{g.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-500">القسم</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                                        value={newCourse.sectionId}
                                        onChange={(e) => setNewCourse({ ...newCourse, sectionId: e.target.value })}
                                    >
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>{s.name || s.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    placeholder="وصف الكورس"
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => { setIsAdding(false); setIsEditing(false); setNewCourse({ name: '', price: '', gradeId: 1, sectionId: sections[0]?.id || 1, description: '', isActive: true }); }}>إلغاء</Button>
                                <Button onClick={handleAddCourse} disabled={isLoading}>{isLoading ? 'جاري الحفظ...' : (isEditing ? 'حفظ التعديلات' : 'حفظ الكورس')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* List */}
                <div className="space-y-4">
                    {isLoading && !isAdding && <p className="text-center text-gray-500">جاري التحميل...</p>}
                    {!isLoading && filteredCourses.map(course => (
                        <Card key={course.id} className="hover:shadow-md transition-shadow group">
                            <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="w-full md:w-auto">
                                    <h3 className="text-lg md:text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors break-words">{course.name || course.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <p className="text-gray-500 text-xs md:text-sm font-medium bg-gray-100 inline-block px-2 py-1 rounded">{grades.find(g => g.id === course.gradeId)?.title}</p>
                                        {course.sectionId && (
                                             <p className="text-blue-500 text-xs md:text-sm font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                                                {sections.find(s => s.id === course.sectionId)?.name}
                                             </p>
                                        )}
                                        {/* <p className="text-primary text-sm font-bold bg-primary/10 inline-block px-2 py-1 rounded">{course.price || 'مجاني'}</p> */}
                                         <p className="text-primary text-sm font-bold bg-primary/10 inline-block px-2 py-1 rounded">{course.price ? `${course.price} ج.م` : 'مجاني'}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm break-words">{course.description}</p>
                                </div>
                                <div className="flex gap-2 self-end md:self-center w-full md:w-auto justify-end">
                                     <Button variant="ghost" size="sm" 
                                        className={course.isActive ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-50"}
                                        onClick={() => handleToggleActive(course.id)}
                                     >
                                        {course.isActive ? 'نشط' : 'غير نشط'}
                                     </Button>
                                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleEditClick(course)}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(course.id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {!isLoading && filteredCourses.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            لا توجد كورسات مطابقة للبحث
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
