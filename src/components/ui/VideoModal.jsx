import React from 'react';
import { X } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, videoUrl, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/60 to-transparent">
                    <h3 className="text-white font-medium text-lg drop-shadow-md">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-black/40 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Video Player */}
                <div className="aspect-video w-full bg-black flex items-center justify-center">
                    {videoUrl ? (
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            className="w-full h-full"
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="text-white/60">No video URL provided</div>
                    )}
                </div>
            </div>
            
            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
