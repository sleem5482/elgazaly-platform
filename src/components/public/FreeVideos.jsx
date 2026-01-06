import { useState } from 'react';
import { PlayCircle, FileQuestion, ExternalLink } from 'lucide-react';
// import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function FreeVideos() {
    const { freeVideos} = useData();
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Free Videos Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">فيديوهات مجانية</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        شاهد دروس مجانية قبل الاشتراك في المنصة
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    {freeVideos.map((video) => (
                        <div
                            key={video.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <PlayCircle size={32} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {video.duration}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {video.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    {freeVideos.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                            لا توجد فيديوهات مجانية حالياً
                        </div>
                    )}
                </div>

                {/* Free Exams Section
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">امتحانات مجانية</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        اختبر مستواك مع مجموعة من الامتحانات المجانية
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {freeExams.map((exam) => (
                        <Link
                            key={exam.id}
                            to={`/free-exam/${exam.id}`}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group block"
                        >
                            <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ExternalLink className="text-primary w-12 h-12" />
                                </div>
                                <FileQuestion className="w-24 h-24 text-primary/20 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {exam.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {exam.description}
                                </p>
                                <div className="mt-4 flex items-center text-primary font-bold text-sm">
                                    <span>ابدأ الامتحان</span>
                                    <ExternalLink size={16} className="mr-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                    {freeExams.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                            لا توجد امتحانات مجانية حالياً
                        </div>
                    )}
                </div> */}

                {/* Video Modal */}
                {selectedVideo && (
                    <div
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <div
                            className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="aspect-video">
                                <iframe
                                    src={selectedVideo.youtubeUrl}
                                    title={selectedVideo.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedVideo.title}
                                </h3>
                                <p className="text-gray-600">{selectedVideo.description}</p>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}