import { useState } from 'react';
import { useData } from '../../context/DataContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, FileText, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

export default function AdminExams() {
    const { exams, setExams, weeks, freeExams, setFreeExams } = useData();
    const [view, setView] = useState('course'); // 'course' or 'free'
    const [isAdding, setIsAdding] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [expandedExam, setExpandedExam] = useState(null);
    const [newExam, setNewExam] = useState({
        title: '',
        weekId: '',
        duration: 30,
        questions: []
    });
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0
    });

    // Free Exam State
    // Free Exam State
    const [newFreeExam, setNewFreeExam] = useState({
        title: '',
        description: '',
        duration: 30,
        questions: []
    });

    const handleAddExam = () => {
        if (view === 'free') {
            if (!newFreeExam.title) {
                alert('الرجاء إدخال اسم الاختبار');
                return;
            }
            if (newFreeExam.questions.length === 0) {
                alert('الرجاء إضافة سؤال واحد على الأقل');
                return;
            }

            if (editingExam) {
                // Update existing exam
                const updatedExam = { ...editingExam, ...newFreeExam };
                setFreeExams(freeExams.map(e => e.id === editingExam.id ? updatedExam : e));
                setEditingExam(null);
                alert('تم تعديل الاختبار المجاني بنجاح');
            } else {
                // Add new exam
                const exam = {
                    id: `fe${Date.now()}`,
                    ...newFreeExam
                };
                setFreeExams(prev => [...prev, exam]);
                alert('تم إضافة الاختبار المجاني بنجاح');
            }

            setIsAdding(false);
            setNewFreeExam({ title: '', description: '', duration: 30, questions: [] });
            return;
        }

        if (!newExam.title || !newExam.weekId) {
            alert('الرجاء إدخال اسم الاختبار واختيار الأسبوع');
            return;
        }
        if (newExam.questions.length === 0) {
            alert('الرجاء إضافة سؤال واحد على الأقل');
            return;
        }

        if (editingExam) {
            const updatedExam = { ...editingExam, ...newExam };
            setExams(exams.map(e => e.id === editingExam.id ? updatedExam : e));
            setEditingExam(null);
            alert('تم تعديل الاختبار بنجاح');
        } else {
            const exam = {
                id: `e${Date.now()}`,
                ...newExam
            };
            setExams(prev => [...prev, exam]);
            alert('تم إضافة الاختبار بنجاح');
        }

        setIsAdding(false);
        setNewExam({ title: '', weekId: '', duration: 30, questions: [] });
    };

    const handleAddQuestion = () => {
        if (!newQuestion.text || newQuestion.options.some(opt => !opt.trim())) {
            alert('الرجاء ملء جميع حقول السؤال');
            return;
        }
        const question = {
            id: `q${Date.now()}`,
            ...newQuestion
        };
        if (view === 'free') {
            setNewFreeExam({
                ...newFreeExam,
                questions: [...newFreeExam.questions, question]
            });
        } else {
            setNewExam({
                ...newExam,
                questions: [...newExam.questions, question]
            });
        }
        setNewQuestion({
            text: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        });
    };

    const handleDeleteQuestion = (questionId) => {
        if (view === 'free') {
            setNewFreeExam({
                ...newFreeExam,
                questions: newFreeExam.questions.filter(q => q.id !== questionId)
            });
        } else {
            setNewExam({
                ...newExam,
                questions: newExam.questions.filter(q => q.id !== questionId)
            });
        }
    };

    const handleDeleteExam = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
            if (view === 'free') {
                setFreeExams(freeExams.filter(e => e.id !== id));
            } else {
                setExams(exams.filter(e => e.id !== id));
            }
        }
    };

    const handleEditExam = (exam) => {
        setEditingExam(exam);
        setIsAdding(true);
        if (view === 'free') {
            setNewFreeExam({
                title: exam.title,
                description: exam.description || '',
                duration: exam.duration || 30,
                questions: exam.questions || []
            });
        } else {
            setNewExam({
                title: exam.title,
                weekId: exam.weekId,
                duration: exam.duration,
                questions: exam.questions || []
            });
        }
    };

    // handleSaveEdit is merged into handleAddExam now
    // const handleSaveEdit = () => { ... }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الاختبارات</h1>
                        <p className="text-gray-500">إضافة وتعديل وحذف الاختبارات</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                            <button
                                onClick={() => { setView('course'); setIsAdding(false); }}
                                className={`px-4 py-2 rounded-md transition-all ${view === 'course' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                            >
                                اختبارات الكورسات
                            </button>
                            <button
                                onClick={() => { setView('free'); setIsAdding(false); }}
                                className={`px-4 py-2 rounded-md transition-all ${view === 'free' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                            >
                                اختبارات مجانية
                            </button>
                        </div>
                        <Button onClick={() => setIsAdding(true)} className="gap-2 shadow-lg">
                            <Plus size={20} />
                            إضافة اختبار جديد
                        </Button>
                    </div>
                </header>

                {/* Add Form */}
                {isAdding && (
                    <Card className="mb-8 border-primary/20 bg-primary/5">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold mb-4 text-primary">
                                {view === 'free' ? 'بيانات الاختبار المجاني الجديد' : 'بيانات الاختبار الجديد'}
                            </h3>

                            {view === 'free' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <Input
                                        placeholder="اسم الاختبار"
                                        value={newFreeExam.title}
                                        onChange={(e) => setNewFreeExam({ ...newFreeExam, title: e.target.value })}
                                    />
                                    <Input
                                        placeholder="وصف الاختبار"
                                        value={newFreeExam.description}
                                        onChange={(e) => setNewFreeExam({ ...newFreeExam, description: e.target.value })}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="المدة (بالدقائق)"
                                        value={newFreeExam.duration}
                                        onChange={(e) => setNewFreeExam({ ...newFreeExam, duration: parseInt(e.target.value) })}
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Input
                                        placeholder="اسم الاختبار"
                                        value={newExam.title}
                                        onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                                    />
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        value={newExam.weekId}
                                        onChange={(e) => setNewExam({ ...newExam, weekId: e.target.value })}
                                    >
                                        <option value="">اختر الأسبوع</option>
                                        {weeks.map(w => (
                                            <option key={w.id} value={w.id}>{w.title} - {w.description}</option>
                                        ))}
                                    </select>
                                    <Input
                                        type="number"
                                        placeholder="المدة (بالدقائق)"
                                        value={newExam.duration}
                                        onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                                    />
                                </div>
                            )}



                            {/* Questions Builder (For Both Types) */}
                            <div className="mb-6">
                                <h4 className="font-bold mb-3">الأسئلة ({(view === 'free' ? newFreeExam.questions : newExam.questions).length})</h4>
                                {(view === 'free' ? newFreeExam.questions : newExam.questions).map((q, idx) => (
                                    <div key={q.id} className="bg-white p-4 rounded-lg mb-2 flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-medium">{idx + 1}. {q.text}</p>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {q.options.map((opt, i) => (
                                                    <span key={i} className={i === q.correctAnswer ? 'text-green-600 font-bold' : ''}>
                                                        {String.fromCharCode(65 + i)}) {opt}{' '}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteQuestion(q.id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Question Form */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <h4 className="font-bold mb-3">إضافة سؤال جديد</h4>
                                <Input
                                    placeholder="نص السؤال"
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                    className="mb-3"
                                />
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {newQuestion.options.map((opt, idx) => (
                                        <Input
                                            key={idx}
                                            placeholder={`الخيار ${String.fromCharCode(65 + idx)}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...newQuestion.options];
                                                newOpts[idx] = e.target.value;
                                                setNewQuestion({ ...newQuestion, options: newOpts });
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-4 items-center">
                                    <label className="text-sm font-medium">الإجابة الصحيحة:</label>
                                    <select
                                        className="px-4 py-2 border border-gray-300 rounded-lg"
                                        value={newQuestion.correctAnswer}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}
                                    >
                                        {newQuestion.options.map((_, idx) => (
                                            <option key={idx} value={idx}>{String.fromCharCode(65 + idx)}</option>
                                        ))}
                                    </select>
                                    <Button onClick={handleAddQuestion} size="sm" className="mr-auto">
                                        <Plus size={16} className="ml-1" />
                                        إضافة السؤال
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingExam(null); }}>إلغاء</Button>
                                <Button onClick={handleAddExam}>{editingExam ? 'حفظ التعديلات' : 'حفظ الاختبار'}</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Exams List */}
                <div className="space-y-4">
                    {(view === 'free' ? freeExams : exams).map(exam => (
                        <Card key={exam.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-secondary">{exam.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {view === 'free' ? (
                                                    <>
                                                        {exam.duration} دقيقة •
                                                        {exam.questions?.length || 0} سؤال
                                                    </>
                                                ) : (
                                                    <>
                                                        {weeks.find(w => w.id === exam.weekId)?.title || 'غير محدد'} •
                                                        {exam.duration} دقيقة •
                                                        {exam.questions?.length || 0} سؤال
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}>
                                            {expandedExam === exam.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleEditExam(exam)}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteExam(exam.id)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Expanded Questions */}
                                {expandedExam === exam.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                        {exam.questions?.map((q, idx) => (
                                            <div key={q.id} className="bg-gray-50 p-3 rounded-lg">
                                                <p className="font-medium mb-2">{idx + 1}. {q.text}</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    {q.options?.map((opt, i) => (
                                                        <div key={i} className={`p-2 rounded ${i === q.correctAnswer ? 'bg-green-100 text-green-700 font-bold' : 'bg-white'}`}>
                                                            {String.fromCharCode(65 + i)}) {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {(view === 'free' ? freeExams : exams).length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            لا توجد اختبارات حتى الآن
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
