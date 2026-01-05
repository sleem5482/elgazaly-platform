import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus, Edit, Trash2, FileText, ChevronDown, ChevronUp, Save, X, Eye, PlayCircle, StopCircle, ArrowLeft } from 'lucide-react';

export default function AdminExams() {
    const { success, error: showError, confirm } = useToast();
    
    // Global State
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Exams State
    const [exams, setExams] = useState([]);
    const [view, setView] = useState('list'); // 'list', 'form', 'questions', 'results'
    const [editingExam, setEditingExam] = useState(null);
    const [examFormData, setExamFormData] = useState({
        title: '',
        examDate: '',
        accessType: 1, // 1: Free, 2: Platform
        duration: 30
    });

    // Questions State
    const [selectedExamForQuestions, setSelectedExamForQuestions] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [questionFormData, setQuestionFormData] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'optionA',
        marks: 1
    });

    // Results State
    const [selectedExamForResults, setSelectedExamForResults] = useState(null);
    const [examResults, setExamResults] = useState([]);

    // Fetch courses on mount
    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch exams when course changes
    useEffect(() => {
        if (selectedCourseId) {
            fetchExams();
        } else {
            setExams([]);
        }
    }, [selectedCourseId]);

    const fetchCourses = async () => {
        try {
            const data = await adminService.getAllCourses();
            setCourses(data);
            if (data.length > 0) setSelectedCourseId(data[0].id);
        } catch (err) {
            console.error(err);
            showError('فشل تحميل الكورسات');
        }
    };

    const fetchExams = async () => {
        if (!selectedCourseId) return;
        setLoading(true);
        try {
            const data = await adminService.getExams(selectedCourseId);
            setExams(data);
        } catch (err) {
            console.error(err);
            showError('فشل تحميل الاختبارات');
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestions = async (examId) => {
        setLoading(true);
        try {
            const data = await adminService.getQuestions(examId);
            setQuestions(data);
        } catch (err) {
            console.error(err);
            showError('فشل تحميل الأسئلة');
        } finally {
            setLoading(false);
        }
    };

    // --- Exam Handlers ---

    const handleSaveExam = async () => {
        if (!examFormData.title || !selectedCourseId) {
            showError('الرجاء ملء اسم الاختبار واختيار الكورس');
            return;
        }

        setLoading(true);
        try {
            // Payload with only allowed fields
            console.log("before examFormData",examFormData);
            const payload = {
                title: examFormData.title,
                examDate: examFormData.examDate ? new Date(examFormData.examDate).toISOString() : new Date().toISOString(),
                accessType: examFormData.accessType =="Free"|| examFormData.accessType == 1 ? 1 : 2,
                durationMinutes: parseInt(examFormData.duration)
            };

            if (editingExam) {
                console.log(payload);
                console.log(editingExam);
                await adminService.updateExam(selectedCourseId, editingExam.id, payload);
                success('تم تحديث الاختبار بنجاح');
            } else {
                console.log(payload);
                await adminService.createExam(selectedCourseId, payload);
                success('تم إنشاء الاختبار بنجاح');
            }
            
            setView('list');
            setEditingExam(null);
            setExamFormData({ title: '', examDate: '', accessType: 2, duration: 30 });
            fetchExams();
        } catch (err) {
            console.error(err);
            showError('فشل حفظ الاختبار');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (examId) => {
        if (!await confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;
        
        try {
            console.log("sleem hashem")
            console.log("selectedCourseId",selectedCourseId);
            console.log("examId",examId);
            await adminService.deleteExam(selectedCourseId, examId);
            success('تم حذف الاختبار بنجاح');
            fetchExams();
        } catch (err) {
            console.error(err);
            showError('فشل حذف الاختبار');
        }
    };

    const handleOpenExam = async (exam) => {
        try {
            await adminService.openExam(exam.id);
            success('تم فتح الاختبار للطلاب');
            fetchExams(); // Refresh to update status if backend changes it
        } catch (err) { showError('فشل فتح الاختبار'); }
    };

    const handleCloseExam = async (exam) => {
        try {
            await adminService.closeExam(exam.id);
            success('تم إغلاق الاختبار');
            fetchExams();
        } catch (err) { showError('فشل إغلاق الاختبار'); }
    };

    // --- Question Handlers ---

    const handleManageQuestions = (exam) => {
        setSelectedExamForQuestions(exam);
        fetchQuestions(exam.id);
        setView('questions');
    };

    const handleSaveQuestion = async () => {
        if (!questionFormData.questionText) {
            showError('الرجاء كتابة نص السؤال');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                questionText: questionFormData.questionText,
                optionA: questionFormData.optionA,
                optionB: questionFormData.optionB,
                optionC: questionFormData.optionC,
                optionD: questionFormData.optionD,
                correctOption: questionFormData.correctOption,
                marks: parseInt(questionFormData.marks)
            };

            if (editingQuestion) {
                await adminService.updateQuestion(selectedExamForQuestions.id, editingQuestion.id, payload);
                success('تم تعديل السؤال بنجاح');
            } else {
                await adminService.createQuestion(selectedExamForQuestions.id, payload);
                success('تم إضافة السؤال بنجاح');
            }

            setEditingQuestion(null);
            setQuestionFormData({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'optionA', marks: 1 });
            fetchQuestions(selectedExamForQuestions.id);
        } catch (err) {
            console.error(err);
            showError('فشل حفظ السؤال');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!await confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
        
        try {
            await adminService.deleteQuestion(selectedExamForQuestions.id, questionId);
            success('تم حذف السؤال بنجاح');
            fetchQuestions(selectedExamForQuestions.id);
        } catch (err) {
            console.error(err);
            showError('فشل حذف السؤال');
        }
    };


    const handleShowResults = async (exam) => {
        setSelectedExamForResults(exam);
        setLoading(true);
        try {
            const data = await adminService.getExamResults(exam.id);
            setExamResults(data);
            setView('results');
            console.log(data)
        } catch (err) {
            console.error(err);
            showError('فشل تحميل نتائج الطلاب');
        } finally {
            setLoading(false);
        }
    };

    // --- Renders ---

    const renderExamList = () => (
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                    <select 
                        className="px-4 py-2 border rounded-lg bg-white"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        <option value="">اختر الكورس...</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name || c.title}</option>
                        ))}
                    </select>
                </div>
                <Button onClick={() => {
                    setEditingExam(null);
                    setExamFormData({ title: '', examDate: '', accessType: 1, duration: 30 });
                    setView('form');
                }} className="gap-2">
                    <Plus size={20} /> إضافة اختبار
                </Button>
            </div>

            {exams.length === 0 && <p className="text-center text-gray-500 py-8">لا يوجد اختبارات لهذا الكورس</p>}
            
            {exams.map(exam => (
                <Card key={exam.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${exam.accessType === 1 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-secondary">{exam.title}</h3>
                                <div className="flex gap-2 text-sm text-gray-500 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${exam.accessType === 1 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {exam.accessType === "Free" ? 'مجاني' : 'مدفوع (منصة)'}
                                    </span>
                                    <span>• {exam.totalMarks} درجة</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleManageQuestions(exam)} className="text-purple-600 bg-purple-50">
                                الأسئلة
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenExam(exam)} title="فتح الاختبار">
                                <PlayCircle size={18} className="text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCloseExam(exam)} title="إغلاق الاختبار">
                                <StopCircle size={18} className="text-orange-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleShowResults(exam)} title="عرض النتائج">
                                <Eye size={18} className="text-indigo-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                                setEditingExam(exam);
                                setExamFormData({
                                    title: exam.title,
                                    examDate: exam.examDate,
                                    accessType: exam.accessType=="Free"|| exam.accessType == 1 ? 1 : 2,
                                    duration: exam.durationMinutes
                                });
                                setView('form');
                            }} className="text-blue-600">
                                <Edit size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteExam(exam.id)} className="text-red-600">
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderExamForm = () => (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                    <Button variant="ghost" onClick={() => setView('list')}><ArrowLeft /></Button>
                    <h3 className="text-xl font-bold">{editingExam ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">اسم الاختبار</label>
                        <Input value={examFormData.title} onChange={e => setExamFormData({...examFormData, title: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">نوع الوصول</label>
                        <select 
                            className="w-full p-2 border rounded-lg"
                            value={examFormData.accessType}
                            onChange={e => setExamFormData({...examFormData, accessType: e.target.value})}
                        >
                            <option value={1}>مجاني (Free)</option>
                            <option value={2}>منصة (Platform)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">تاريخ البدء</label>
                        <Input type="datetime-local" value={examFormData.examDate ? examFormData.examDate.substring(0, 16) : ''} onChange={e => setExamFormData({...examFormData, examDate: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">المدة (دقيقة)</label>
                         <Input type="number" value={examFormData.duration} onChange={e => setExamFormData({...examFormData, duration: e.target.value})} />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setView('list')}>إلغاء</Button>
                    <Button onClick={handleSaveExam}>{layout === 'loading' ? 'جاري الحفظ...' : 'حفظ'}</Button>
                </div>
            </CardContent>
        </Card>
    );

    const renderQuestionsView = () => (
         <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => setView('list')}><ArrowLeft /></Button>
                    <div>
                        <h3 className="text-xl font-bold">{selectedExamForQuestions?.title}</h3>
                        <p className="text-gray-500 text-sm">إدارة الأسئلة</p>
                    </div>
                </div>
            </div>

            {/* Add Question Form */}
            <Card>
                <CardContent className="p-6">
                    <h4 className="font-bold mb-4">{editingQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h4>
                    <div className="space-y-4">
                        <Input 
                            placeholder="نص السؤال" 
                            value={questionFormData.questionText} 
                            onChange={e => setQuestionFormData({...questionFormData, questionText: e.target.value})} 
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input placeholder="الخيار A" value={questionFormData.optionA} onChange={e => setQuestionFormData({...questionFormData, optionA: e.target.value})} />
                            <Input placeholder="الخيار B" value={questionFormData.optionB} onChange={e => setQuestionFormData({...questionFormData, optionB: e.target.value})} />
                            <Input placeholder="الخيار C" value={questionFormData.optionC} onChange={e => setQuestionFormData({...questionFormData, optionC: e.target.value})} />
                            <Input placeholder="الخيار D" value={questionFormData.optionD} onChange={e => setQuestionFormData({...questionFormData, optionD: e.target.value})} />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">الإجابة الصحيحة</label>
                                <select 
                                    className="w-full p-2 border rounded-lg"
                                    value={questionFormData.correctOption}
                                    onChange={e => setQuestionFormData({...questionFormData, correctOption: e.target.value})}
                                >
                                    <option value="optionA">Option A</option>
                                    <option value="optionB">Option B</option>
                                    <option value="optionC">Option C</option>
                                    <option value="optionD">Option D</option>
                                </select>
                            </div>
                            <div className="w-32">
                                <label className="block text-sm font-medium mb-1">الدرجة</label>
                                <Input type="number" value={questionFormData.marks} onChange={e => setQuestionFormData({...questionFormData, marks: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            {editingQuestion && <Button variant="ghost" onClick={() => {
                                setEditingQuestion(null);
                                setQuestionFormData({ questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'optionA', marks: 1 });
                            }}>إلغاء التعديل</Button>}
                            <Button onClick={handleSaveQuestion}>حفظ السؤال</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <Card key={q.id}>
                        <CardContent className="p-4 flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg mb-2"><span className="text-primary">S{idx+1}:</span> {q.questionText}</p>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                    <span className={q.correctOption === 'optionA' ? 'text-green-600 font-bold' : ''}>A: {q.optionA}</span>
                                    <span className={q.correctOption === 'optionB' ? 'text-green-600 font-bold' : ''}>B: {q.optionB}</span>
                                    <span className={q.correctOption === 'optionC' ? 'text-green-600 font-bold' : ''}>C: {q.optionC}</span>
                                    <span className={q.correctOption === 'optionD' ? 'text-green-600 font-bold' : ''}>D: {q.optionD}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Marks: {q.marks}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setEditingQuestion(q);
                                    setQuestionFormData({
                                        questionText: q.questionText,
                                        optionA: q.optionA,
                                        optionB: q.optionB,
                                        optionC: q.optionC,
                                        optionD: q.optionD,
                                        correctOption: q.correctOption,
                                        marks: q.marks
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}>
                                    <Edit size={16} className="text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                                    <Trash2 size={16} className="text-red-600" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
         </div>
    );

    const renderResultsView = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => setView('list')}><ArrowLeft /></Button>
                    <div>
                        <h3 className="text-xl font-bold">{selectedExamForResults?.title}</h3>
                        <p className="text-gray-500 text-sm">نتائج الطلاب</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="p-4">اسم الطالب</th>
                                <th className="p-4">الدرجة</th>
                                <th className="p-4">وقت الأداء</th>
                                <th className="p-4">وقت الانتهاء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {examResults.length > 0 ? examResults.map((result, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold">{result.studentName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-sm font-bold ${result.score >= (selectedExamForResults?.totalMarks / 2) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {result.score} / {selectedExamForResults?.totalMarks}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600" dir="ltr">{new Date(result.takenAt).toLocaleString('ar-EG',{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}</td>
                                    <td className="p-4 text-gray-600 w-1/4" dir="ltr">
                                       {new Date(result.finishedAt).toLocaleString('ar-EG',{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">لا توجد نتائج حتى الآن</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );

    const layout = loading ? 'loading' : 'default'; 

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {view !== 'questions' && view !== 'results' && (
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary mb-2">إدارة الاختبارات</h1>
                            <p className="text-gray-500">إضافة وتعديل وحذف الاختبارات</p>
                        </div>
                    </header>
                )}

                {view === 'list' && renderExamList()}
                {view === 'form' && renderExamForm()}
                {view === 'questions' && renderQuestionsView()}
                {view === 'results' && renderResultsView()}
            </main>
        </div>
    );
}
