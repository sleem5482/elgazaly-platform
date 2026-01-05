import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { BookOpen, GraduationCap, Clock, PlayCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { studentService } from '../../services/studentService';

export default function StudentDashboard() {
    const { user } = useAuth();
    // const { grades } = useData(); // Removing useData dependency for courses
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [selectedGrade, setSelectedGrade] = useState('all'); // 'all', 1, 2, 3

    const [exams, setExams] = useState([]);
    const [loadingExams, setLoadingExams] = useState(true);

    const filteredCourses = courses.filter(course => {
        if (selectedGrade === 'all') return true;
        const gradeId = course.gradeId || course.GradeId;
        return gradeId === selectedGrade;
    });

    const userName = user?.fullName || user?.name || 'طالب';
    const userGradeId = user?.gradeId || user?.grade;

    useEffect(() => {
        const fetchData = async () => {
             try {
                 const [coursesData, examsData] = await Promise.all([
                     studentService.getMyCourses(),
                     studentService.getAllExams()
                 ]);
                 console.log(coursesData);
                 setCourses(coursesData);
                 setExams(examsData);
             } catch (error) {
                 console.error('Failed to fetch dashboard data', error);
                 // Fallback or empty
             } finally {
                 setLoadingCourses(false);
                 setLoadingExams(false);
             }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-dark mb-2">مرحباً، {userName} 👋</h1>
                        <p className="text-gray-600">نتمنى لك يوماً دراسياً مليئاً بالإنجاز</p> 
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                     <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
                                <BookOpen size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">كورساتي</p>
                                <p className="text-2xl font-bold text-dark">{courses.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Other stats placeholders kept or simplified */}
                     <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-secondary/10 text-secondary">
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">الامتحانات</p>
                                <p className="text-2xl font-bold text-dark">{exams.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Exams Section */}
                <ExamsSection exams={exams} loading={loadingExams} />

                {/* Main Actions: My Courses */}
                <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                    <BookOpen className="text-primary" />
                    المحتوى الدراسي (كورساتي)
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <Button 
                        variant={selectedGrade === 'all' ? 'primary' : 'outline'} 
                        onClick={() => setSelectedGrade('all')}
                        className="rounded-full px-6"
                    >
                        الكل
                    </Button>
                    <Button 
                        variant={selectedGrade === 1 ? 'primary' : 'outline'} 
                        onClick={() => setSelectedGrade(1)}
                        className="rounded-full px-6"
                    >
                        الأول الثانوي
                    </Button>
                    <Button 
                        variant={selectedGrade === 2 ? 'primary' : 'outline'} 
                        onClick={() => setSelectedGrade(2)}
                        className="rounded-full px-6"
                    >
                        الثاني الثانوي
                    </Button>
                    <Button 
                        variant={selectedGrade === 3 ? 'primary' : 'outline'} 
                        onClick={() => setSelectedGrade(3)}
                        className="rounded-full px-6"
                    >
                        الثالث الثانوي
                    </Button>
                </div>
                
                {loadingCourses ? (
                     <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.length > 0 ? filteredCourses.map(course => {
                            // Normalize data to handle potential PascalCase/camelCase mismatches
                            // Normalize data to handle potential PascalCase/camelCase mismatches
                            const cName = course.courseName;
                            const cId = course.courseId;
                            const isEnrolled = course.isEnrolled;
                            const isSubscriptionActive = course.isSubscriptionActive;
                            const isActive = course.isCourseActive;
                            const gradeId = course.gradeId;
                            
                            // Map gradeId to text for display
                            const getGradeName = (gid) => {
                                if (gid === 1) return 'الأول الثانوي';
                                if (gid === 2) return 'الثاني الثانوي';
                                if (gid === 3) return 'الثالث الثانوي';
                                return '';
                            };

                            // console.log(`Course ${cId}:`, { cName, isEnrolled, isActive, raw: course });

                            return (
                                <Link key={cId} to={isActive ? `/student/course/${cId}` : '#'} className={`group ${(!isActive) ? 'cursor-not-allowed opacity-80' : ''}`}>
                                    <Card className="h-full hover:shadow-xl transition-all border-none shadow-md bg-white overflow-hidden relative">
                                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500 ${isEnrolled ? 'bg-primary/5' : 'bg-gray-100'}`}></div>
                                        <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                                            {/* Grade Badge */}
                                            {gradeId && (
                                                <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold">
                                                    {getGradeName(gradeId)}
                                                </div>
                                            )}

                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-lg ${isEnrolled ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                <BookOpen size={48} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-dark mb-3">{cName}</h3>
                                            
                                            <div className="flex gap-2 mb-4 justify-center">
                                            {isEnrolled ? (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">مشترك</span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">غير مشترك</span>
                                            )}
                                            {isActive ? (
                                                 <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">نشط</span>
                                            ) : (
                                                 <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold">غير نشط</span>
                                            )}
                                        </div>
                                        
                                        {(course.enrolledAt || course.expireAt) && (
                                            <div className="text-xs text-gray-500 mb-6 space-y-1 bg-gray-50 p-3 rounded-lg w-full">
                                                {course.enrolledAt && (
                                                    <div className="flex justify-between">
                                                        <span>تاريخ الاشتراك:</span>
                                                        <span dir="ltr" className="font-medium">{new Date(course.enrolledAt).toLocaleDateString('ar-EG')}</span>
                                                    </div>
                                                )}
                                                {course.expireAt && (
                                                    <div className="flex justify-between text-red-500">
                                                        <span>ينتهي في:</span>
                                                        <span dir="ltr" className="font-bold">{new Date(course.expireAt).toLocaleDateString('ar-EG')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {isActive ? (
                                            <span className="text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                                {isEnrolled && isSubscriptionActive ? 'ابدأ المذاكرة' : 'عرض الكورس'} <ArrowLeft size={20} />
                                            </span>
                                        ) : (
                                            <Button variant="secondary" className="w-full opacity-50 cursor-not-allowed" disabled>
                                                غير متاح حالياً
                                            </Button>
                                        )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        }) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                لا توجد كورسات متاحة حالياً.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

function ExamsSection({ exams, loading }) {
    if (loading) return <div className="text-center py-4"><Loader2 className="animate-spin inline-block" /> جاري تحميل الامتحانات...</div>;
    
    if (!exams || exams.length === 0) return null;
console.log(exams)
    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                <GraduationCap className="text-secondary" />
                الامتحانات المتاحة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {exams.map(exam => (
                    <Card key={exam.id} className="border-none shadow-sm bg-white hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${exam.examType=="Free" ? 'bg-green-100 text-green-600' : 'bg-secondary/10 text-secondary'}`}>
                                    <GraduationCap size={24} />
                                </div>
 {exam.examType=="Free" ? 
                                            <Badge className="bg-green-100 text-green-700">مجاني</Badge> : 
                                            <Badge className="bg-blue-100 text-blue-700">منصة</Badge>
                                         }                            </div>
                                         <h3 className="text-xl font-bold text-dark mb-2">{exam.title}</h3>
                            <h5 className=" font-bold text-dark mb-2">وقت الاختبار: {new Date(exam.examDate).toLocaleDateString('ar-EG',{hour: '2-digit', minute: '2-digit'})}</h5>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    <span>{exam.durationMinutes } دقيقة</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen size={16} />
                                    <span>{exam.totalMarks || '?'} {exam.totalMarks > 1 ? 'درجات' : 'درجة'}</span>
                                </div>
                            </div>

                            <Link to={`/student/exam/${exam.id}`} className="block">
                                <Button className="w-full gap-2" variant={exam.isFree ? 'success' : 'secondary'}>
                                    <PlayCircle size={18} />
                                    ابدأ الامتحان
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
