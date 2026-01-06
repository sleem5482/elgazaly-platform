import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';

export default function CoursesList({ courses = [] }) {
    if (!courses || courses.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                لا توجد كورسات متاحة حالياً.
            </div>
        );
    }

    // Map gradeId to text for display
    const getGradeName = (gid) => {
        if (gid === 1) return 'الأول الثانوي';
        if (gid === 2) return 'الثاني الثانوي';
        if (gid === 3) return 'الثالث الثانوي';
        return '';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => {
                const cName = course.courseName || course.title || course.name;
                const cId = course.courseId || course.id;
                const isEnrolled = course.isEnrolled;
                const isSubscriptionActive = course.isSubscriptionActive;
                const isActive = course.isCourseActive !== undefined ? course.isCourseActive : true; // Default to true if not specified (e.g. public view)
                const gradeId = course.gradeId || course.GradeId;

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
                                            {/* <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">غير مشترك</span> */}
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
            })}
        </div>
    );
}
