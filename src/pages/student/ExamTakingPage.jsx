import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ExamTakingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast, confirm } = useToast();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    const hasFetched = useRef(false);
    const timerRef = useRef(null);
    const autoSubmitted = useRef(false);

    /* ================= FETCH EXAM (ONCE) ================= */
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchExam = async () => {
            try {
                const data = await studentService.startExam(id);
                setExam(data);
                setQuestions(data.questions || []);

                if (data.durationMinutes) {
                    setTimeLeft(data.durationMinutes * 60);
                }
            } catch (err) {
                setError('فشل تحميل الامتحان.');
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    /* ================= TIMER ================= */
    useEffect(() => {
        if (timeLeft === null) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);

                    if (!autoSubmitted.current) {
                        autoSubmitted.current = true;
                        handleAutoSubmit();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft !== null]);

    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    };

    const handleOptionSelect = (questionId, optionKey) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

   
    const handleAutoSubmit = async () => {
        if (submitting) return;
        showToast('انتهى وقت الامتحان، يتم التسليم تلقائيًا', 'warning');
        setSubmitting(true);
        await submitExamPayload();
        navigate('/dashboard');
    };

    const handleSubmit = async () => {
        const ok = await confirm('هل أنت متأكد من تسليم الإجابة؟');
        if (!ok) return;

        setSubmitting(true);
        await submitExamPayload();
    };

    const submitExamPayload = async () => {
        try {
            const payload = {
                examId: parseInt(id),
                answers: Object.entries(answers).map(([qId, option]) => ({
                    questionId: parseInt(qId),
                    selectedOption: option
                }))
            };

            await studentService.submitExam(payload);
            showToast('تم تسليم الامتحان بنجاح', 'success');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            showToast('فشل تسليم الامتحان', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= STATES ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary w-12 h-12" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-red-500">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">{error}</h2>
                    <h1>لقد بدات الاختبار او قمت بتسليم الإجابة مسبقا.</h1>
                </div>
            </div>
        );
    }

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-24 md:top-20 z-10 border-b-4 border-primary">
                    <div className="w-full md:w-auto">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
                            {exam?.title || 'امتحان'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            عدد الأسئلة: {questions.length}
                        </p>
                    </div>

                    {/* TIMER */}
                    <div className="w-full md:w-auto flex justify-center items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-2 rounded-lg">
                        <Clock size={20} />
                        <span dir="ltr" className="text-lg md:text-xl font-mono">
                            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                        </span>
                    </div>
                </div>

                {/* QUESTIONS */}
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <Card key={q.id} className="border-none shadow-sm">
                            <CardContent className="p-4 md:p-6">
                                <div className="flex gap-4">
                                    <div className="bg-gray-100 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full font-bold text-gray-600 shrink-0">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-medium text-gray-900 mb-6 leading-relaxed break-words">
                                            {q.questionText}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-4">
                                            {['optionA', 'optionB', 'optionC', 'optionD'].map(optKey => {
                                                const optText = q[optKey];
                                                if (!optText) return null;

                                                const isSelected = answers[q.id] === optKey;

                                                return (
                                                    <div
                                                        key={optKey}
                                                        onClick={() => handleOptionSelect(q.id, optKey)}
                                                        className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all active:scale-[0.99]
                                                            ${isSelected
                                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                                : 'border-gray-200 hover:border-primary/50'
                                                            }`}
                                                    >
                                                        <span className={`text-base md:text-lg break-words ${isSelected ? 'text-primary font-medium' : 'text-gray-700'}`}>
                                                            {optText}
                                                        </span>
                                                        {isSelected && (
                                                            <CheckCircle size={20} className="text-primary shrink-0 ml-2" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* SUBMIT BUTTON */}
                <div className="mt-10 sticky bottom-4 z-10 flex justify-center">
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || timeLeft === 0}
                        className="w-full md:w-auto px-12 py-4 text-lg font-bold rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-xl"
                    >
                        {submitting ? 'جاري التسليم...' : 'إنهاء الامتحان وتسليم الإجابة'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
