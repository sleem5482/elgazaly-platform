import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ExamRunner({ examId, onComplete }) {
    const { exams } = useData();
    const exam = exams.find(e => e.id === examId);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    if (!exam) return <div className="p-8 text-center text-gray-500">الاختبار غير متاح حالياً</div>;

    const handleSelect = (questionId, optionIndex) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        exam.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
        setSubmitted(true);
        if (onComplete) onComplete(correctCount);
    };

    return (
        <div className="max-w-3xl mx-auto py-4">
            <div className="text-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-secondary mb-2">{exam.title}</h2>
                <p className="text-gray-500">عدد الأسئلة: {exam.questions.length} | الدرجة النهائية: {exam.questions.length}</p>
            </div>

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
                        <Button variant="outline" onClick={() => {
                            setSubmitted(false);
                            setAnswers({});
                            setScore(0);
                        }}>إعادة الاختبار</Button>
                    </CardContent>
                </Card>
            )}

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

            {!submitted && (
                <div className="mt-8 text-center sticky bottom-4 z-10">
                    <Button size="lg" onClick={handleSubmit} disabled={Object.keys(answers).length < exam.questions.length} className="shadow-xl w-full md:w-auto px-12 py-4 text-lg">
                        تسليم الإجابة
                    </Button>
                </div>
            )}
        </div>
    );
}
