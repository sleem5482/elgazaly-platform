import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { studentService } from '../../services/studentService';

export default function CoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [selectedGrade, setSelectedGrade] = useState('all'); // 'all', 1, 2, 3

    const filteredCourses = courses.filter(course => {
        if (selectedGrade === 'all') return true;
        const gradeId = course.gradeId || course.GradeId;
        return gradeId === selectedGrade;
    });

    useEffect(() => {
        const fetchCourses = async () => {
             try {
                 const data = await studentService.getAllCourses();
                 setCourses(data);
             } catch (error) {
                 console.error('Failed to fetch courses', error);
             } finally {
                 setLoadingCourses(false);
             }
        };
        fetchCourses();
    }, []);

    return (
        <div className="flex min-h-screen bg-light font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Main Actions: My Courses */}
                <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                    <BookOpen className="text-primary" />
                    المحتوى الدراسي (كل الكورسات)
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
                            const cName = course.courseName || course.title || course.name;
                            const cId = course.courseId || course.id;
                            const isEnrolled = course.isEnrolled;
                            const isSubscriptionActive = course.isSubscriptionActive;
                            const isActive = course.isCourseActive !== undefined ? course.isCourseActive : course.isActive !== undefined ? course.isActive : true;
                            const gradeId = course.gradeId || course.grade;
                            
                            // Map gradeId to text for display
                            const getGradeName = (gid) => {
                                if (gid === 1) return 'الأول الثانوي';
                                if (gid === 2) return 'الثاني الثانوي';
                                if (gid === 3) return 'الثالث الثانوي';
                                return '';
                            };

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
                                                 <div className="flex flex-col gap-1 items-center">
                                                    {course.price && <span className="text-primary font-bold text-lg">{course.price} ج.م</span>}
                                                </div>
                                            )}
                                            {isActive ? (
                                                 <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold h-fit">نشط</span>
                                            ) : (
                                                 <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold h-fit">غير نشط</span>
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
