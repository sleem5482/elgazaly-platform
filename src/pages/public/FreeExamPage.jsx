import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function FreeExamPage() {
    const { examId } = useParams();
    const { freeExams } = useData();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (freeExams.length > 0) {
            const foundExam = freeExams.find(e => e.id === examId);
            if (foundExam) {
                setExam(foundExam);
                setTimeLeft((foundExam.duration || 30) * 60);
            }
        }
    }, [examId, freeExams]);

    useEffect(() => {
        if (timeLeft > 0 && !submitted && exam) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, submitted, exam]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSelect = (questionId, optionIndex) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = () => {
        if (!exam) return;
        let correctCount = 0;
        exam.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setSubmitted(true);
    };

    if (!exam) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">جاري تحميل الاختبار...</h2>
                    <p className="text-gray-500">أو قد يكون الرابط غير صحيح</p>
                    <Link to="/" className="text-primary hover:underline mt-4 block">العودة للرئيسية</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                    <div>
                        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-2 transition-colors">
                            <ArrowRight size={16} className="ml-1" />
                            العودة للرئيسية
                        </Link>
                        <h1 className="text-2xl font-bold text-secondary">{exam.title}</h1>
                        <p className="text-gray-500 mt-1">{exam.description}</p>
                    </div>

                    {!submitted && (
                        <div className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-primary/10 text-primary'}`}>
                            <Clock size={24} />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                {/* Results Card */}
                {submitted && (
                    <Card className="mb-8 border-green-200 bg-green-50 animate-in fade-in slide-in-from-top-4 duration-500">
                        <CardContent className="flex flex-col items-center p-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-green-800 mb-2">تم الانتهاء من الاختبار</h3>
                            <p className="text-lg text-green-700 mb-4">
                                نتيجتك: <span className="font-bold text-2xl">{score} / {exam.questions.length}</span>
                            </p>
                            <Button variant="outline" onClick={() => window.location.reload()}>إعادة الاختبار</Button>
                        </CardContent>
                    </Card>
                )}

                {/* Questions */}
                <div className="space-y-6">
                    {exam.questions.map((q, idx) => {
                        const isCorrect = submitted && answers[q.id] === q.correctAnswer;
                        const isWrong = submitted && answers[q.id] !== q.correctAnswer && answers[q.id] !== undefined;

                        return (
                            <Card key={q.id} className={`border-2 transition-colors duration-300 ${submitted ? (isCorrect ? 'border-green-200 bg-green-50/30' : isWrong ? 'border-red-200 bg-red-50/30' : 'border-gray-100') : 'border-transparent'}`}>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold mb-4 flex gap-3 text-secondary">
                                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0">{idx + 1}</span>
                                        {q.text}
                                    </h3>
                                    <div className="space-y-3 mr-11">
                                        {q.options.map((opt, optIdx) => (
                                            <div
                                                key={optIdx}
                                                onClick={() => handleSelect(q.id, optIdx)}
                                                className={`
                                                    p-4 rounded-lg border cursor-pointer transition-all flex justify-between items-center
                                                    ${answers[q.id] === optIdx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:bg-gray-50'}
                                                    ${submitted && q.correctAnswer === optIdx ? '!bg-green-100 !border-green-500 !text-green-800' : ''}
                                                    ${submitted && answers[q.id] === optIdx && answers[q.id] !== q.correctAnswer ? '!bg-red-100 !border-red-500 !text-red-800' : ''}
                                                `}
                                            >
                                                <span className="font-medium">{opt}</span>
                                                {submitted && q.correctAnswer === optIdx && <CheckCircle size={20} className="text-green-600" />}
                                                {submitted && answers[q.id] === optIdx && answers[q.id] !== q.correctAnswer && <XCircle size={20} className="text-red-600" />}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Submit Button */}
                {!submitted && (
                    <div className="mt-8 text-center sticky bottom-4 z-10">
                        <Button
                            size="lg"
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length < exam.questions.length}
                            className="shadow-xl w-full md:w-auto px-12 py-4 text-lg"
                        >
                            تسليم الإجابة
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
