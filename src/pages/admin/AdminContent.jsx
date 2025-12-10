import { useState } from 'react';
import { useData } from '../../context/DataContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, ChevronLeft, Folder, FileVideo, FileText, Calendar, List } from 'lucide-react';

export default function AdminContent() {
    const { courses, months, weeks, lessons, setMonths, setWeeks, setLessons } = useData();
    const [view, setView] = useState('courses'); // courses, months, weeks, lessons
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState('');

    const handleAddItem = () => {
        console.log('Adding item:', { newItemName, newItemImage, view, selectedCourse, selectedMonth, selectedWeek });

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
            console.log('New Month:', newMonth);
            setMonths(prev => {
                const updated = [...prev, newMonth];
                console.log('Updated Months:', updated);
                return updated;
            });
            alert('تم إضافة الشهر بنجاح');
        } else if (view === 'weeks') {
            if (!selectedMonth) {
                alert('الرجاء اختيار شهر أولاً');
                return;
            }
            const newWeek = { id: `w${id}`, monthId: selectedMonth.id, title: newItemName, description: 'وصف جديد', order: weeks.length + 1 };
            console.log('New Week:', newWeek);
            setWeeks(prev => [...prev, newWeek]);
            alert('تم إضافة الأسبوع بنجاح');
        } else if (view === 'lessons') {
            if (!selectedWeek) {
                alert('الرجاء اختيار أسبوع أولاً');
                return;
            }
            const newLesson = { id: `l${id}`, weekId: selectedWeek.id, title: newItemName, type: 'video', videoUrl: '', duration: '00:00', order: lessons.length + 1 };
            console.log('New Lesson:', newLesson);
            setLessons(prev => [...prev, newLesson]);
            alert('تم إضافة الدرس بنجاح');
        }
        setNewItemName('');
        setNewItemImage('');
    };

    const handleDelete = (id, type) => {
        if (!window.confirm('هل أنت متأكد؟')) return;
        if (type === 'month') setMonths(months.filter(m => m.id !== id));
        if (type === 'week') setWeeks(weeks.filter(w => w.id !== id));
        if (type === 'lesson') setLessons(lessons.filter(l => l.id !== id));
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

    const renderList = (items, type, Icon, nextView, onSelect) => (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg">إضافة {type === 'month' ? 'شهر' : type === 'week' ? 'أسبوع' : 'درس'} جديد</h3>
                <div className="flex gap-4">
                    <Input
                        placeholder={`اسم ${type === 'month' ? 'الشهر' : type === 'week' ? 'الأسبوع' : 'الدرس'} الجديد`}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="flex-1"
                    />
                    {type === 'month' && (
                        <Input
                            placeholder="رابط الصورة (اختياري)"
                            value={newItemImage}
                            onChange={(e) => setNewItemImage(e.target.value)}
                            className="flex-1"
                        />
                    )}
                    <Button onClick={handleAddItem} className="shrink-0 gap-2">
                        <Plus size={20} />
                        إضافة
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {items.map(item => (
                    <Card key={item.id} className={`transition-colors group ${nextView ? 'cursor-pointer hover:border-primary' : ''}`} onClick={() => nextView && onSelect(item)}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Icon size={20} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">{item.title}</h3>
                                    {type === 'lesson' && <p className="text-xs text-gray-400">{item.type}</p>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDelete(item.id, type); }}>
                                    <Trash2 size={18} />
                                </Button>
                                {nextView && <ChevronLeft className="text-gray-400 group-hover:text-primary transition-colors" />}
                            </div>
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
                <header className="mb-8">
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
                </header>

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
