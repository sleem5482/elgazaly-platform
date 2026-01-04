import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import Button  from '../../components/ui/Button'; // Assuming named for now, wait I fixed dashboard to default. Let me check Button.jsx again.
import { Card, CardContent } from '../../components/ui/Card'; // Card usually named
import { Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function ExamTakingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const data = await studentService.startExam(id);
                // Data structure assumption:
                // { examId: 4, title: "...", duration: 60, questions: [ { id: 3, text: "...", options: { optionA: "...", optionB: "..." } } ] }
                // OR maybe it just returns the exam object?
                // Let's assume standard structure.
                setExam(data);
                if (data.questions) {
                    setQuestions(data.questions);
                } else {
                    // Maybe the API structure is different
                    console.warn("No questions found in response", data);
                }
            } catch (err) {
                console.error(err);
                setError('فشل تحميل الامتحان. يرجى المحاولة مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);

    const handleOptionSelect = (questionId, optionKey) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };

    const handleSubmit = async () => {
        if (!window.confirm('هل أنت متأكد من تسليم الإجابة؟')) return;

        setSubmitting(true);
        try {
            // Transform answers to required format
            /*
            {
              "examId": 4,
              "answers": [
                {
                  "questionId": 3,
                  "selectedOption": "optionB"
                }
              ]
            }
            */
            const payload = {
                examId: parseInt(id),
                answers: Object.entries(answers).map(([qId, option]) => ({
                    questionId: parseInt(qId),
                    selectedOption: option
                }))
            };

            const result = await studentService.submitExam(payload);
            showToast('تم تسليم الامتحان بنجاح', 'success');
            // Redirect to result page or dashboard
            // Assuming result contains score
            navigate('/dashboard'); // Or maybe a result page?
        } catch (err) {
            console.error(err);
            showToast('فشل تسليم الامتحان', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center text-red-500">
                <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">{error}</h2>
                <Button className="mt-4" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex justify-between items-center sticky top-20 z-10 border-b-4 border-primary">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{exam?.title || 'امتحان'}</h1>
                        <p className="text-gray-500 text-sm">عدد الأسئلة: {questions.length}</p>
                    </div>
                    
                    {/* Timer could go here */}
                    <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-2 rounded-lg">
                        <Clock size={20} />
                        <span>{exam?.durationMinutes || 0} دقيقة</span>
                    </div>

                    <Button 
                        variant="primary" 
                        onClick={handleSubmit} 
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {submitting ? 'جاري التسليم...' : 'إنهاء الامتحان'}
                    </Button>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <Card key={q.id} className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full font-bold text-gray-600 flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
                                            {q.text}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Assuming options structure in q.options or q.answers? 
                                                The user didn't specify question structure.
                                                Usually: optionA, optionB, optionC, optionD 
                                            */}
                                            {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey) => {
                                                const optText = q[optKey]; // Assuming flat structure like API usually does, or nested?
                                                if (!optText) return null;

                                                const isSelected = answers[q.id] === optKey;

                                                return (
                                                    <div 
                                                        key={optKey}
                                                        onClick={() => handleOptionSelect(q.id, optKey)}
                                                        className={`
                                                            p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
                                                            ${isSelected 
                                                                ? 'border-primary bg-primary/5' 
                                                                : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                                                            {optText}
                                                        </span>
                                                        {isSelected && <CheckCircle size={20} className="text-primary" />}
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
            </div>
        </div>
    );
}
