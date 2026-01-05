import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, ChevronLeft, Folder, FileVideo, FileText, Calendar, List, Upload, Save, X, PlayCircle, FileQuestion } from 'lucide-react';
import VideoModal from '../../components/ui/VideoModal';

export default function AdminContent() {
    // Remove detailed useData destructuring, only keep what's needed or nothing if fully standard api
    const { freeVideos, setFreeVideos, freeExams, setFreeExams } = useData(); // Keep free content on useData/local for now as per plan
    const toast = useToast();
    const [view, setView] = useState('courses'); // courses, months, weeks, videos, free
    
    // Selection state
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState(null);

    // Data state
    const [courses, setCourses] = useState([]);
    const [months, setMonths] = useState([]);
    const [weeks, setWeeks] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [newItemName, setNewItemName] = useState('');
    const [newItemOrder, setNewItemOrder] = useState(1);
    const [newItemStartDate, setNewItemStartDate] = useState('');
    const [newItemEndDate, setNewItemEndDate] = useState('');
    const [newItemImage, setNewItemImage] = useState(null); // File object
    const [newItemImageUrl, setNewItemImageUrl] = useState(''); // Preview URL
    const [newItemVideoUrl, setNewItemVideoUrl] = useState(''); 
    const [newItemVisibility, setNewItemVisibility] = useState(1);
    
    // Video specific
    const [newItemDuration, setNewItemDuration] = useState('');
    const [newItemVideoType, setNewItemVideoType] = useState(1); // Default type

    // Editing
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Video Player
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Free Content State (Existing)
    const [freeContentView, setFreeContentView] = useState('videos');
    const [newFreeItem, setNewFreeItem] = useState({ title: '', description: '', url: '', thumbnail: '', duration: '' });

    useEffect(() => {
        if (view === 'courses') fetchCourses();
        if (view === 'months' && selectedCourse) fetchMonths();
        if (view === 'weeks' && selectedMonth) fetchWeeks();
        if (view === 'videos' && selectedWeek) fetchVideos();
    }, [view, selectedCourse, selectedMonth, selectedWeek]);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllCourses();
            setCourses(data);
        } catch (err) { console.error(err); toast.error('Failed to fetch courses'); }
        finally { setIsLoading(false); }
    };

    const fetchMonths = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getMonths(selectedCourse.id);
            setMonths(data);
        } catch (err) { console.error(err); toast.error('Failed to fetch months'); }
        finally { setIsLoading(false); }
    };

    const fetchWeeks = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getWeeks(selectedMonth.id);
            setWeeks(data);
        } catch (err) { console.error(err); toast.error('Failed to fetch weeks'); }
        finally { setIsLoading(false); }
    };

    const fetchVideos = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getVideos(selectedWeek.id);
            setVideos(data);
        } catch (err) { console.error(err); toast.error('Failed to fetch videos'); }
        finally { setIsLoading(false); }
    };

    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            toast.warning('الرجاء إدخال العنوان');
            return;
        }

        setIsLoading(true);
        try {
            if (view === 'months') {
                const data = {
                    monthName: newItemName,
                    orderNumber: newItemOrder,
                    startDate: newItemStartDate ? new Date(newItemStartDate).toISOString() : new Date().toISOString(),
                    endDate: newItemEndDate ? new Date(newItemEndDate).toISOString() : new Date().toISOString()
                };
                await adminService.createMonth(selectedCourse.id, data);
                toast.success('تم إضافة الشهر بنجاح');
                fetchMonths();
            } else if (view === 'weeks') {
                const data = {
                    title: newItemName,
                    orderNumber: newItemOrder
                };
                await adminService.createWeek(selectedMonth.id, data);
                toast.success('تم إضافة الأسبوع بنجاح');
                fetchWeeks();
            } else if (view === 'videos') {
                 if (!newItemVideoUrl) {
                    toast.warning('الرجاء إدخال رابط الفيديو');
                    setIsLoading(false);
                    return;
                }
                
                const data = {
                    title: newItemName,
                    videoUrl: newItemVideoUrl,
                    duration: newItemDuration ? parseFloat(newItemDuration) : 0, // Using number as requested
                    orderNumber: newItemOrder,
                    videoType: parseInt(newItemVideoType),
                    visibility: parseInt(newItemVisibility)
                };
                
                await adminService.createVideo(selectedWeek.id, data);
                toast.success('تم إضافة الفيديو بنجاح');
                fetchVideos();
                setNewItemVideoUrl('');
            }
            
            // Reset common fields
            setNewItemName('');
            setNewItemOrder(prev => prev + 1);
            setNewItemStartDate('');
            setNewItemEndDate('');
        } catch (err) {
            console.error(err);
            toast.error('حدث خطأ أثناء الإضافة');
        } finally {
            setIsLoading(false);
        }
    };

    // Keep Free Item Logic (Local only for now as requested/assumed)
    const handleAddFreeItem = () => {
        if (!newFreeItem.title) return;
        const id = `f${Date.now()}`;
        if (freeContentView === 'videos') {
            setFreeVideos([...freeVideos, { ...newFreeItem, id, youtubeUrl: newFreeItem.url }]);
        } else {
            setFreeExams([...freeExams, { ...newFreeItem, id }]);
        }
        setNewFreeItem({ title: '', description: '', url: '', thumbnail: '', duration: '' });
        toast.success('تم الإضافة بنجاح');
    };

    const handleEdit = (item, type) => {
        setEditingItem({ ...item, type });
        setEditFormData({ ...item }); // Clone
    };

    const handleSaveEdit = async () => {
        try {
            setIsLoading(true);
            const { type, id } = editingItem;
            
            if (type === 'month') {
                // Mapping back to API expectations
                const data = {
                    monthName: editFormData.monthName || editFormData.title || editFormData.name, 
                    orderNumber: editFormData.orderNumber || editFormData.order,
                    startDate: editFormData.startDate ? new Date(editFormData.startDate).toISOString() : new Date().toISOString(),
                    endDate: editFormData.endDate ? new Date(editFormData.endDate).toISOString() : new Date().toISOString()
                };
                await adminService.updateMonth(selectedCourse.id, id, data);
                fetchMonths();
            } else if (type === 'week') {
                const data = {
                    title: editFormData.title,
                    orderNumber: editFormData.orderNumber || editFormData.order
                };
                await adminService.updateWeek(selectedMonth.id, id, data);
                fetchWeeks();
            } else if (type === 'video') {
                 const data = {
                    title: editFormData.title,
                    videoUrl: editFormData.videoUrl, // Expecting this to be edited
                    duration: editFormData.duration ? parseFloat(editFormData.duration) : 0,
                    orderNumber: editFormData.orderNumber,
                    videoType: parseInt(editFormData.videoType),
                    visibility: parseInt(editFormData.visibility || 1)
                };

                await adminService.updateVideo(selectedWeek.id, id, data);
                fetchVideos();
            } else if (type === 'freeVideo') {
                 setFreeVideos(freeVideos.map(v => v.id === id ? editFormData : v));
            } else if (type === 'freeExam') {
                setFreeExams(freeExams.map(e => e.id === id ? editFormData : e));
            }

            setEditingItem(null);
            setEditFormData({});
            toast.success('تم التعديل بنجاح');
        } catch (err) {
            console.error(err);
            toast.error('فشل حفظ التعديلات');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!await toast.confirm('هل أنت متأكد؟')) return;
        try {
            setIsLoading(true);
            if (type === 'month') {
                await adminService.deleteMonth(selectedCourse.id, id);
                setMonths(months.filter(m => m.id !== id));
            }
            if (type === 'week') {
                await adminService.deleteWeek(selectedMonth.id, id);
                setWeeks(weeks.filter(w => w.id !== id));
            }
            if (type === 'video') {
                await adminService.deleteVideo(selectedWeek.id, id);
                setVideos(videos.filter(v => v.id !== id));
            }
            if (type === 'freeVideo') setFreeVideos(freeVideos.filter(v => v.id !== id));
            if (type === 'freeExam') setFreeExams(freeExams.filter(e => e.id !== id));
            toast.success('تم الحذف بنجاح');
        } catch (err) {
            console.error(err);
            toast.error('فشل الحذف');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCourses = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">اختر الكورس لإدارة محتواه</h2>
            {isLoading && <p>جاري التحميل...</p>}
            {!isLoading && courses.map(c => (
                <Card key={c.id} className="cursor-pointer hover:border-primary transition-colors group" onClick={() => { setSelectedCourse(c); setView('months'); }}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Folder size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">{c.name || c.title}</h3>
                                {/* <p className="text-gray-500 text-sm">{months.filter(m => m.courseId === c.id).length} شهور</p> */ /* Cannot count efficiently without fetching all, removing count */}
                            </div>
                        </div>
                        <ChevronLeft className="text-gray-400 group-hover:text-primary transition-colors" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    // Reuse Free Content Render (Assumed unchanged for now, just hook up edit/delete wraps)
    const renderFreeContent = () => (
        <div className="space-y-6">
            <div className="flex gap-4 mb-6">
                <Button variant={freeContentView === 'videos' ? 'primary' : 'outline'} onClick={() => setFreeContentView('videos')} className="flex-1">
                    <PlayCircle size={20} className="ml-2" /> فيديوهات مجانية
                </Button>
                <Button variant={freeContentView === 'exams' ? 'primary' : 'outline'} onClick={() => setFreeContentView('exams')} className="flex-1">
                    <FileQuestion size={20} className="ml-2" /> امتحانات مجانية
                </Button>
            </div>
            {/* Add/Edit/List for Free Content - omitted for brevity in replacement, assuming pasted back or similar structure. 
                Wait, replacing full file, I need to include it. */}
             <Card className="bg-white border-none shadow-sm">
                <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">إضافة {freeContentView === 'videos' ? 'فيديو' : 'امتحان'} جديد</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input placeholder="العنوان" value={newFreeItem.title} onChange={(e) => setNewFreeItem({ ...newFreeItem, title: e.target.value })} />
                        <Input placeholder="الوصف" value={newFreeItem.description} onChange={(e) => setNewFreeItem({ ...newFreeItem, description: e.target.value })} />
                        <Input placeholder={freeContentView === 'videos' ? 'رابط يوتيوب' : 'رابط الامتحان'} value={newFreeItem.url} onChange={(e) => setNewFreeItem({ ...newFreeItem, url: e.target.value })} />
                        {freeContentView === 'videos' && (
                            <>
                                <Input placeholder="رابط الصورة المصغرة" value={newFreeItem.thumbnail} onChange={(e) => setNewFreeItem({ ...newFreeItem, thumbnail: e.target.value })} />
                                <Input placeholder="المدة (مثال: 15:00)" value={newFreeItem.duration} onChange={(e) => setNewFreeItem({ ...newFreeItem, duration: e.target.value })} />
                            </>
                        )}
                    </div>
                    <Button onClick={handleAddFreeItem} className="w-full"><Plus size={20} className="ml-2" /> إضافة</Button>
                </CardContent>
            </Card>
            {/* List Free Items */}
            <div className="space-y-4">
                {(freeContentView === 'videos' ? freeVideos : freeExams).map(item => (
                    <Card key={item.id} className="bg-white border-none shadow-sm">
                        <CardContent className="p-6">
                            {editingItem?.id === item.id ? (
                                <div className="space-y-4">
                                     <Input value={editFormData.title || ''} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} />
                                     <div className="flex gap-2"><Button onClick={handleSaveEdit}>حفظ</Button><Button variant="ghost" onClick={() => setEditingItem(null)}>إلغاء</Button></div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h3>{item.title}</h3>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-blue-500" onClick={() => handleEdit(item, freeContentView === 'videos' ? 'freeVideo' : 'freeExam')}><Edit size={18} /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(item.id, freeContentView === 'videos' ? 'freeVideo' : 'freeExam')}><Trash2 size={18} /></Button>
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
                <h3 className="font-bold text-lg">إضافة {type === 'month' ? 'شهر' : type === 'week' ? 'أسبوع' : 'فيديو'} جديد</h3>
                <div className="flex flex-col gap-4">
                    <Input
                        placeholder={`اسم ${type === 'month' ? 'الشهر' : type === 'week' ? 'الأسبوع' : 'الفيديو'} الجديد`}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                     <Input
                        type="number"
                        placeholder="الترتيب"
                        value={newItemOrder}
                        onChange={(e) => setNewItemOrder(parseInt(e.target.value) || 1)}
                    />

                    {type === 'month' && (
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ البداية</label>
                                <Input
                                    type="datetime-local"
                                    value={newItemStartDate}
                                    onChange={(e) => setNewItemStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ النهاية</label>
                                <Input
                                    type="datetime-local"
                                    value={newItemEndDate}
                                    onChange={(e) => setNewItemEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    
                    {type === 'video' && (
                        <div className="space-y-4">
                            <Input placeholder="المدة (مثال 10:00)" value={newItemDuration} onChange={(e) => setNewItemDuration(e.target.value)} />
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">رابط الفيديو</label>
                                <Input 
                                    placeholder="https://..." 
                                    value={newItemVideoUrl} 
                                    onChange={(e) => setNewItemVideoUrl(e.target.value)} 
                                />
                            </div>

                             <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">النوع</label>
                                    <select className="w-full p-2 border rounded" value={newItemVideoType} onChange={(e) => setNewItemVideoType(e.target.value)}>
                                        <option value={1}>شرح</option>
                                        <option value={2}>حل</option>
                                        <option value={3}>مراجعة</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">الظهور</label>
                                    <select className="w-full p-2 border rounded" value={newItemVisibility} onChange={(e) => setNewItemVisibility(e.target.value)}>
                                        <option value={1}>ظاهر</option>
                                        <option value={2}>مخفي</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <Button onClick={handleAddItem} className="gap-2" disabled={isLoading}>
                        <Plus size={20} />
                        {isLoading ? 'جاري الإضافة...' : 'إضافة'}
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading && !items.length && <p>جاري التحميل...</p>}
                {items.map(item => (
                    <Card key={item.id} className="transition-colors group border-none shadow-md bg-white">
                        <CardContent className="p-6">
                            {editingItem?.id === item.id ? (
                                <div className="space-y-4">
                                    <Input
                                        value={editFormData.monthName || editFormData.title || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, [type === 'month' ? 'monthName' : 'title']: e.target.value })}
                                        placeholder="العنوان"
                                    />
                                    <Input
                                        type="number"
                                        value={editFormData.orderNumber || editFormData.order || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, orderNumber: e.target.value })}
                                        placeholder="الترتيب"
                                    />
                                    {type === 'month' && (
                                        <div className="flex gap-4">
                                           <div className="flex-1">
                                               <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ البداية</label>
                                               <Input
                                                   type="datetime-local"
                                                   value={editFormData.startDate ? new Date(editFormData.startDate).toISOString().slice(0, 16) : ''}
                                                   onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                                               />
                                           </div>
                                           <div className="flex-1">
                                               <label className="block text-sm font-medium mb-1 text-gray-700">تاريخ النهاية</label>
                                               <Input
                                                   type="datetime-local"
                                                   value={editFormData.endDate ? new Date(editFormData.endDate).toISOString().slice(0, 16) : ''}
                                                   onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                                               />
                                           </div>
                                       </div>
                                    )}
                                     {type === 'video' && (
                                         <div className="space-y-4 pt-2 border-t mt-2">
                                             <Input 
                                                placeholder="المدة (مثال 10:00)" 
                                                value={editFormData.duration || ''} 
                                                onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })} 
                                             />
                                             <div>
                                                <label className="block text-sm font-medium mb-1 text-gray-500">رابط الفيديو</label>
                                                <Input 
                                                    placeholder="https://..." 
                                                    value={editFormData.videoUrl || ''} 
                                                    onChange={(e) => setEditFormData({ ...editFormData, videoUrl: e.target.value })} 
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-1 text-gray-700">النوع</label>
                                                    <select 
                                                        className="w-full p-2 border rounded" 
                                                        value={editFormData.videoType || 1} 
                                                        onChange={(e) => setEditFormData({ ...editFormData, videoType: e.target.value })}
                                                    >
                                                        <option value={1}>شرح</option>
                                                        <option value={2}>حل</option>
                                                        <option value={3}>مراجعة</option>
                                                    </select>
                                                </div>
                                                 <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-1 text-gray-700">الظهور</label>
                                                    <select 
                                                        className="w-full p-2 border rounded" 
                                                        value={editFormData.visibility || 1} 
                                                        onChange={(e) => setEditFormData({ ...editFormData, visibility: e.target.value })}
                                                    >
                                                        <option value={1}>ظاهر</option>
                                                        <option value={2}>مخفي</option>
                                                    </select>
                                                </div>
                                            </div>
                                         </div>
                                     )}
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveEdit} className="gap-2"><Save size={18} /> حفظ</Button>
                                        <Button variant="ghost" onClick={() => setEditingItem(null)} className="gap-2"><X size={18} /> إلغاء</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`flex items-center gap-4 flex-1 ${nextView || type === 'video' ? 'cursor-pointer' : ''}`}
                                        onClick={() => {
                                            if (nextView) onSelect(item);
                                            else if (type === 'video') setSelectedVideo(item);
                                        }}
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">{item.monthName || item.title || item.name}</h3>
                                            {item.orderNumber && <p className="text-xs text-gray-400">ترتيب: {item.orderNumber}</p>}
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
                {!isLoading && items.length === 0 && <p className="text-center text-gray-400 py-8">لا يوجد محتوى حتى الآن</p>}
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
                                    <span className={view === 'months' ? 'font-bold text-primary' : 'cursor-pointer hover:text-primary'} onClick={() => { setView('months'); setSelectedMonth(null); }}>{selectedCourse.name || selectedCourse.title}</span>
                                </>
                            )}
                            {selectedMonth && (
                                <>
                                    <span>/</span>
                                    <span className={view === 'weeks' ? 'font-bold text-primary' : 'cursor-pointer hover:text-primary'} onClick={() => { setView('weeks'); setSelectedWeek(null); }}>{selectedMonth.monthName || selectedMonth.title}</span>
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
                    {/* Free content toggle - simplifying */}
                    <Button variant={view === 'free' ? 'primary' : 'outline'} onClick={() => setView(view === 'free' ? 'courses' : 'free')}>
                        {view === 'free' ? 'إدارة الكورسات' : 'المحتوى المجاني'}
                    </Button>
                </header>

                {view === 'free' && renderFreeContent()}
                {view === 'courses' && renderCourses()}
                {view === 'months' && renderList(months, 'month', Calendar, 'weeks', (item) => { setSelectedMonth(item); setView('weeks'); })}
                {view === 'weeks' && renderList(weeks, 'week', List, 'videos', (item) => { setSelectedWeek(item); setView('videos'); })}
                {view === 'videos' && renderList(videos, 'video', FileVideo, null, () => { })}
            </main>
            
            {/* Video Modal */}
            <VideoModal 
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrl={selectedVideo?.url || selectedVideo?.videoUrl || selectedVideo?.filePath}
                title={selectedVideo?.title || selectedVideo?.name}
            />
        </div>
    );
}
