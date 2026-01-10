import { useState, useEffect, useRef } from 'react';
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
  Expand,
  Shrink
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { studentService } from '../../services/studentService';

export default function LessonPage() {
  const { lessonId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&loading=lazy&iv_load_policy=3&showinfo=0&disablekb=1&fs=0`
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // const videoSrc = getEmbedUrl(videoData?.videoUrl); // Logic moved to render

  return (
    <div className="flex min-h-screen bg-light">
      {/* <Sidebar />  Removed based on user request */}

      <main className="flex-1 flex flex-col overflow-hidden">
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

        <div className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-5xl">

            {/* VIDEO */}
            <div className="col-span-full">
              <div
                ref={containerRef}
                className={cn(
                  "relative bg-black overflow-hidden group",
                  isFullscreen ? "w-full h-full flex items-center justify-center" : "aspect-video rounded-xl"
                )}
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
                      <>
                        <iframe
                          src={`${getEmbedUrl(videoData.videoUrl)}&mute=0`}
                          title="Video Player"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                        {/* Block 'Watch on YouTube' Button (Bottom-Left) */}
                        <div className="absolute bottom-0 left-0 w-40 h-16 z-20 bg-transparent" />
                      </>
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


                {/* FullScreen Button */}
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      containerRef.current?.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                  className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-lg z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isFullscreen ? <Shrink size={20} /> : <Expand size={20} />}
                </button>
              </div>

            
            </div>

            <div className="space-y-6 mt-6">
                <div className="bg-gradient-to-br from-secondary to-orange-600 p-6 rounded-2xl text-white">
                  <Star />
                  <p className="mt-2">
                    المذاكرة أولًا بأول هي سر التفوق ✨
                  </p>
                </div>
              </div>

          </div>
        </div>
      </main>
    </div>
  );
}
