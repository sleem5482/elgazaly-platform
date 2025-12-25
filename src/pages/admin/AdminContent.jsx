import { useState } from 'react';
import { useData } from '../../context/DataContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, ChevronLeft, Folder, FileVideo, FileText, Calendar, List, Upload, Save, X, PlayCircle, FileQuestion } from 'lucide-react';

export default function AdminContent() {
    const { courses, months, weeks, lessons, setMonths, setWeeks, setLessons, freeVideos, setFreeVideos, freeExams, setFreeExams } = useData();
    const [view, setView] = useState('courses'); // courses, free
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Free Content State
    const [freeContentView, setFreeContentView] = useState('videos'); // videos, exams
    const [newFreeItem, setNewFreeItem] = useState({ title: '', description: '', url: '', thumbnail: '', duration: '' });

    // Video upload states
    const [explanationVideo, setExplanationVideo] = useState(null);
    const [solutionVideo, setSolutionVideo] = useState(null);

    const handleVideoUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'explanation') {
                    setExplanationVideo(reader.result);
                } else {
                    setSolutionVideo(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddItem = () => {
        if (!newItemName.trim()) {
            alert('الرجاء إدخال اسم');
            return;
        }

        const id = Date.now().toString();

        if (view === 'months') {
            if (!selectedCourse) {
                alert('الرجاء اختيار كورس أولاً');
                return;
            }
            const newMonth = {
                id: `m${id}`,
                courseId: selectedCourse.id,
                title: newItemName,
                description: 'وصف جديد',
                order: months.length + 1,
                imageUrl: newItemImage
            };
            setMonths(prev => [...prev, newMonth]);
            alert('تم إضافة الشهر بنجاح');
        } else if (view === 'weeks') {
            if (!selectedMonth) {
                alert('الرجاء اختيار شهر أولاً');
                return;
            }
            const newWeek = {
                id: `w${id}`,
                monthId: selectedMonth.id,
                title: newItemName,
                description: 'وصف جديد',
                order: weeks.length + 1
            };
            setWeeks(prev => [...prev, newWeek]);
            alert('تم إضافة الأسبوع بنجاح');
        } else if (view === 'lessons') {
            if (!selectedWeek) {
                alert('الرجاء اختيار أسبوع أولاً');
                return;
            }
            const newLesson = {
                id: `l${id}`,
                weekId: selectedWeek.id,
                title: newItemName,
                type: 'video',
                explanationVideoUrl: explanationVideo || '',
                solutionVideoUrl: solutionVideo || '',
                duration: '00:00',
                order: lessons.length + 1
            };
            setLessons(prev => [...prev, newLesson]);
            alert('تم إضافة الدرس بنجاح');
            setExplanationVideo(null);
            setSolutionVideo(null);
        }
        setNewItemName('');
        setNewItemImage('');
    };

    const handleAddFreeItem = () => {
        if (!newFreeItem.title) return;
        const id = `f${Date.now()}`;
        if (freeContentView === 'videos') {
            setFreeVideos([...freeVideos, { ...newFreeItem, id, youtubeUrl: newFreeItem.url }]);
        } else {
            setFreeExams([...freeExams, { ...newFreeItem, id }]);
        }
        setNewFreeItem({ title: '', description: '', url: '', thumbnail: '', duration: '' });
        alert('تم الإضافة بنجاح');
    };

    const handleEdit = (item, type) => {
        setEditingItem({ ...item, type });
        setEditFormData(item);
    };

    const handleSaveEdit = () => {
        if (editingItem.type === 'month') {
            setMonths(months.map(m => m.id === editingItem.id ? editFormData : m));
        } else if (editingItem.type === 'week') {
            setWeeks(weeks.map(w => w.id === editingItem.id ? editFormData : w));
        } else if (editingItem.type === 'lesson') {
            setLessons(lessons.map(l => l.id === editingItem.id ? editFormData : l));
        } else if (editingItem.type === 'freeVideo') {
            setFreeVideos(freeVideos.map(v => v.id === editingItem.id ? editFormData : v));
        } else if (editingItem.type === 'freeExam') {
            setFreeExams(freeExams.map(e => e.id === editingItem.id ? editFormData : e));
        }
        setEditingItem(null);
        setEditFormData({});
        alert('تم التعديل بنجاح');
    };

    const handleDelete = (id, type) => {
        if (!window.confirm('هل أنت متأكد؟')) return;
        if (type === 'month') setMonths(months.filter(m => m.id !== id));
        if (type === 'week') setWeeks(weeks.filter(w => w.id !== id));
        if (type === 'lesson') setLessons(lessons.filter(l => l.id !== id));
        if (type === 'freeVideo') setFreeVideos(freeVideos.filter(v => v.id !== id));
        if (type === 'freeExam') setFreeExams(freeExams.filter(e => e.id !== id));
    };

    const renderCourses = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">اختر الكورس لإدارة محتواه</h2>
            {courses.map(c => (
                <Card key={c.id} className="cursor-pointer hover:border-primary transition-colors group" onClick={() => { setSelectedCourse(c); setView('months'); }}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Folder size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">{c.title}</h3>
                                <p className="text-gray-500 text-sm">{months.filter(m => m.courseId === c.id).length} شهور</p>
                            </div>
                        </div>
                        <ChevronLeft className="text-gray-400 group-hover:text-primary transition-colors" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderFreeContent = () => (
        <div className="space-y-6">
            <div className="flex gap-4 mb-6">
                <Button
                    variant={freeContentView === 'videos' ? 'primary' : 'outline'}
                    onClick={() => setFreeContentView('videos')}
                    className="flex-1"
                >
                    <PlayCircle size={20} className="ml-2" />
                    فيديوهات مجانية
                </Button>
                <Button
                    variant={freeContentView === 'exams' ? 'primary' : 'outline'}
                    onClick={() => setFreeContentView('exams')}
                    className="flex-1"
                >
                    <FileQuestion size={20} className="ml-2" />
                    امتحانات مجانية
                </Button>
            </div>

            <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">إضافة {freeContentView === 'videos' ? 'فيديو' : 'امتحان'} جديد</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input
                            placeholder="العنوان"
                            value={newFreeItem.title}
                            onChange={(e) => setNewFreeItem({ ...newFreeItem, title: e.target.value })}
                        />
                        <Input
                            placeholder="الوصف"
                            value={newFreeItem.description}
                            onChange={(e) => setNewFreeItem({ ...newFreeItem, description: e.target.value })}
                        />
                        <Input
                            placeholder={freeContentView === 'videos' ? 'رابط يوتيوب' : 'رابط الامتحان'}
                            value={newFreeItem.url}
                            onChange={(e) => setNewFreeItem({ ...newFreeItem, url: e.target.value })}
                        />
                        {freeContentView === 'videos' && (
                            <>
                                <Input
                                    placeholder="رابط الصورة المصغرة"
                                    value={newFreeItem.thumbnail}
                                    onChange={(e) => setNewFreeItem({ ...newFreeItem, thumbnail: e.target.value })}
                                />
                                <Input
                                    placeholder="المدة (مثال: 15:00)"
                                    value={newFreeItem.duration}
                                    onChange={(e) => setNewFreeItem({ ...newFreeItem, duration: e.target.value })}
                                />
                            </>
                        )}
                    </div>
                    <Button onClick={handleAddFreeItem} className="w-full">
                        <Plus size={20} className="ml-2" />
                        إضافة
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {(freeContentView === 'videos' ? freeVideos : freeExams).map(item => (
                    <Card key={item.id} className="bg-white border-none shadow-sm">
                        <CardContent className="p-6">
                            {editingItem?.id === item.id ? (
                                <div className="space-y-4">
                                    <Input
                                        value={editFormData.title || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        placeholder="العنوان"
                                    />
                                    <Input
                                        value={editFormData.description || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        placeholder="الوصف"
                                    />
                                    <Input
                                        value={freeContentView === 'videos' ? (editFormData.youtubeUrl || '') : (editFormData.url || '')}
                                        onChange={(e) => setEditFormData({ ...editFormData, [freeContentView === 'videos' ? 'youtubeUrl' : 'url']: e.target.value })}
                                        placeholder="الرابط"
                                    />
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveEdit}>حفظ</Button>
                                        <Button variant="ghost" onClick={() => setEditingItem(null)}>إلغاء</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {freeContentView === 'videos' ? (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                <FileQuestion size={24} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg text-secondary">{item.title}</h3>
                                            <p className="text-gray-500 text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-blue-500" onClick={() => handleEdit(item, freeContentView === 'videos' ? 'freeVideo' : 'freeExam')}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id, freeContentView === 'videos' ? 'freeVideo' : 'freeExam')}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderList = (items, type, Icon, nextView, onSelect) => (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg">إضافة {type === 'month' ? 'شهر' : type === 'week' ? 'أسبوع' : 'درس'} جديد</h3>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder={`اسم ${type === 'month' ? 'الشهر' : type === 'week' ? 'الأسبوع' : 'الدرس'} الجديد`}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                    {type === 'month' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">صورة الشهر</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setNewItemImage(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full text-sm border border-gray-300 rounded-lg p-2"
                            />
                            {newItemImage && (
                                <div className="mt-2">
                                    <img src={newItemImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-primary" />
                                    <p className="text-xs text-green-600 mt-1">✓ تم رفع الصورة</p>
                                </div>
                            )}
                        </div>
                    )}
                    {type === 'lesson' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">فيديو الشرح</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleVideoUpload(e, 'explanation')}
                                    className="w-full text-sm"
                                />
                                {explanationVideo && <p className="text-xs text-green-600 mt-1">✓ تم رفع الفيديو</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">فيديو الحل</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleVideoUpload(e, 'solution')}
                                    className="w-full text-sm"
                                />
                                {solutionVideo && <p className="text-xs text-green-600 mt-1">✓ تم رفع الفيديو</p>}
                            </div>
                        </div>
                    )}
                    <Button onClick={handleAddItem} className="gap-2">
                        <Plus size={20} />
                        إضافة
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {items.map(item => (
                    <Card key={item.id} className="transition-colors group border-none shadow-md bg-white">
                        <CardContent className="p-6">
                            {editingItem?.id === item.id ? (
                                <div className="space-y-4">
                                    <Input
                                        value={editFormData.title || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                        placeholder="العنوان"
                                    />
                                    <Input
                                        value={editFormData.description || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        placeholder="الوصف"
                                    />
                                    {type === 'month' && (
                                        <div>
                                            <label className="block text-sm font-medium mb-2">تغيير صورة الشهر</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setEditFormData({ ...editFormData, imageUrl: reader.result });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="w-full text-sm border border-gray-300 rounded-lg p-2"
                                            />
                                            {editFormData.imageUrl && (
                                                <div className="mt-2">
                                                    <img src={editFormData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-primary" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {type === 'lesson' && (
                                        <>
                                            <Input
                                                value={editFormData.explanationVideoUrl || ''}
                                                onChange={(e) => setEditFormData({ ...editFormData, explanationVideoUrl: e.target.value })}
                                                placeholder="رابط فيديو الشرح"
                                            />
                                            <Input
                                                value={editFormData.solutionVideoUrl || ''}
                                                onChange={(e) => setEditFormData({ ...editFormData, solutionVideoUrl: e.target.value })}
                                                placeholder="رابط فيديو الحل"
                                            />
                                        </>
                                    )}
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveEdit} className="gap-2">
                                            <Save size={18} />
                                            حفظ
                                        </Button>
                                        <Button variant="ghost" onClick={() => setEditingItem(null)} className="gap-2">
                                            <X size={18} />
                                            إلغاء
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`flex items-center gap-4 flex-1 ${nextView ? 'cursor-pointer' : ''}`}
                                        onClick={() => nextView && onSelect(item)}
                                    >
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                <Icon size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">{item.title}</h3>
                                            {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                                            {type === 'lesson' && item.type && <p className="text-xs text-gray-400">{item.type}</p>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50" onClick={(e) => { e.stopPropagation(); handleEdit(item, type); }}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDelete(item.id, type); }}>
                                            <Trash2 size={18} />
                                        </Button>
                                        {nextView && <ChevronLeft className="text-gray-400 group-hover:text-primary transition-colors" />}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
                {items.length === 0 && <p className="text-center text-gray-400 py-8">لا يوجد محتوى حتى الآن</p>}
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة المحتوى</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white p-3 rounded-lg shadow-sm w-fit">
                            <span className={view === 'courses' ? 'font-bold text-primary' : 'cursor-pointer hover:text-primary'} onClick={() => { setView('courses'); setSelectedCourse(null); }}>الكورسات</span>
                            {selectedCourse && (
                                <>
                                    <span>/</span>
                                    <span className={view === 'months' ? 'font-bold text-primary' : 'cursor-pointer hover:text-primary'} onClick={() => { setView('months'); setSelectedMonth(null); }}>{selectedCourse.title}</span>
                                </>
                            )}
                            {selectedMonth && (
                                <>
                                    <span>/</span>
                                    <span className={view === 'weeks' ? 'font-bold text-primary' : 'cursor-pointer hover:text-primary'} onClick={() => { setView('weeks'); setSelectedWeek(null); }}>{selectedMonth.title}</span>
                                </>
                            )}
                            {selectedWeek && (
                                <>
                                    <span>/</span>
                                    <span className="font-bold text-primary">{selectedWeek.title}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <Button
                        variant={view === 'free' ? 'primary' : 'outline'}
                        onClick={() => setView(view === 'free' ? 'courses' : 'free')}
                    >
                        {view === 'free' ? 'إدارة الكورسات' : 'المحتوى المجاني'}
                    </Button>
                </header>

                {view === 'free' && renderFreeContent()}

                {view === 'courses' && renderCourses()}

                {view === 'months' && renderList(
                    months.filter(m => m.courseId === selectedCourse.id),
                    'month',
                    Calendar,
                    'weeks',
                    (item) => { setSelectedMonth(item); setView('weeks'); }
                )}

                {view === 'weeks' && renderList(
                    weeks.filter(w => w.monthId === selectedMonth.id),
                    'week',
                    List,
                    'lessons',
                    (item) => { setSelectedWeek(item); setView('lessons'); }
                )}

                {view === 'lessons' && renderList(
                    lessons.filter(l => l.weekId === selectedWeek.id),
                    'lesson',
                    FileVideo,
                    null,
                    () => { }
                )}
            </main>
        </div>
    );
}
