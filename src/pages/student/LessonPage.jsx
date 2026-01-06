import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/ui/Button';
import {
  PlayCircle,
  FileText,
  CheckCircle,
  ChevronRight,
  Lock,
  Star,
  Maximize,
  Minimize
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { studentService } from '../../services/studentService';

export default function LessonPage() {
  const { lessonId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('video');
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const stateLesson = location.state?.lessonData;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';

    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    }

    return videoId
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&disablekb=1&fs=1`
      : '';
  };
  
  const isYoutubeUrl = (url) => {
    return url && (url.includes('youtu.be/') || url.includes('youtube.com/'));
  };

  useEffect(() => {
    const fetchVideoAccess = async () => {
      try {
        setLoading(true);
        const data = await studentService.accessVideo(lessonId);
        setVideoData(data);
        console.log("_____________",data)
      } catch {
        setError('لا يمكنك الوصول إلى هذا المحتوى');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoAccess();
  }, [lessonId]);

  // const videoSrc = getEmbedUrl(videoData?.videoUrl); // Logic moved to render

  return (
    <div className={cn(
      "flex min-h-screen bg-light",
      isFocusMode && "bg-black"
    )}>
      {!isFocusMode && <Sidebar />}

      <main className="flex-1 flex flex-col overflow-hidden">
        {!isFocusMode && (
          <header className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ChevronRight />
                </Button>
              </Link>
              <div>
                <h1 className="font-bold">{stateLesson?.title}</h1>
                <p className="text-xs text-gray-500">{stateLesson?.weekTitle}</p>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-auto p-4">
          <div className={cn(
            "mx-auto",
            isFocusMode ? "max-w-full" : "max-w-6xl grid lg:grid-cols-3 gap-6"
          )}>

            {/* VIDEO */}
            <div className={cn(
              isFocusMode ? "col-span-full" : "lg:col-span-2"
            )}>
              <div
                className="relative aspect-video bg-black rounded-xl overflow-hidden"
                onContextMenu={(e) => e.preventDefault()}
              >
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    Loading...
                  </div>
                )}

                {error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Lock size={40} />
                    <p>{error}</p>
                  </div>
                )}

                {videoData?.videoUrl && (
                  <>
                    {/* WATERMARK */}
                    <div className="absolute inset-0 pointer-events-none opacity-20 select-none z-10 hidden md:block">
                      <div className="w-full h-full flex flex-wrap items-center justify-center gap-24 rotate-[-15deg]">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <span key={i} className="text-white font-bold">
                            {user?.name} 
                          </span>
                        ))}
                      </div>
                    </div>

                    {isYoutubeUrl(videoData.videoUrl) ? (
                      <iframe
                        src={`${getEmbedUrl(videoData.videoUrl)}&mute=0`}
                        title="Video Player"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoData.videoUrl}
                        controls
                        controlsList="nodownload"
                        className="w-full h-full"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </>
                )}

                {/* Focus Button */}
                <button
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-lg z-20"
                >
                  {isFocusMode ? <Minimize /> : <Maximize />}
                </button>
              </div>

            
            </div>

            {!isFocusMode && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-secondary to-orange-600 p-6 rounded-2xl text-white">
                  <Star />
                  <p className="mt-2">
                    المذاكرة أولًا بأول هي سر التفوق ✨
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
