import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DraggableVideoProps {
    transcript: string;
    selectedLanguage: string;
    isCameraOff: boolean;
}

const DraggableVideo: React.FC<DraggableVideoProps> = ({ transcript, selectedLanguage, isCameraOff }) => {
    const pipRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const offsetRef = useRef({ x: 0, y: 0 });
    const [cameraState, setCameraState] = useState<'loading' | 'streaming' | 'error' | 'off'>('loading');

    useEffect(() => {
        const videoEl = videoRef.current;

        // This function cleanly stops and releases the camera stream
        const stopCamera = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoEl) {
                videoEl.srcObject = null;
            }
        };

        const startCamera = async () => {
            if (!videoEl) return;
            
            // Ensure any previous stream is stopped before starting a new one
            stopCamera(); 
            setCameraState('loading');
            
            try {
                // Request camera permission and get the stream
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                
                // Assign the stream to the video element.
                // The `autoPlay` attribute on the <video> tag will handle playback.
                videoEl.srcObject = stream;
                
                // We can directly set the state to streaming once we have successfully acquired the stream.
                setCameraState('streaming');

            } catch (error) {
                console.error("Camera access error:", error);
                setCameraState('error');
            }
        };

        if (isCameraOff) {
            stopCamera();
            setCameraState('off');
        } else {
            startCamera();
        }

        // The cleanup function for the effect ensures the camera is always released on unmount
        return () => {
            stopCamera();
        };
    }, [isCameraOff]);


    useEffect(() => {
        const isSmallScreen = window.innerWidth < 640;
        const initialWidth = isSmallScreen ? 200 : 280;
        const initialHeight = isSmallScreen ? 150 : 210;
        const padding = 16;
        
        setPosition({
            x: window.innerWidth - initialWidth - padding,
            y: window.innerHeight - initialHeight - padding
        });
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!pipRef.current) return;
        setIsDragging(true);
        const rect = pipRef.current.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        e.preventDefault();
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !pipRef.current) return;
        
        let newX = e.clientX - offsetRef.current.x;
        let newY = e.clientY - offsetRef.current.y;
        
        const rect = pipRef.current.getBoundingClientRect();
        newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));

        setPosition({ x: newX, y: newY });
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const showPlaceholder = cameraState !== 'streaming';

    return (
        <div
            ref={pipRef}
            className="fixed z-20 w-[200px] h-[150px] sm:w-[280px] sm:h-[210px] cursor-grab active:cursor-grabbing transition-transform duration-75"
            style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
            onMouseDown={handleMouseDown}
        >
            <div className="absolute inset-0 w-full h-full glass-card shadow-glass-glow rounded-2xl overflow-hidden">
                <video 
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-500 ${!showPlaceholder ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="User camera feed" 
                />
                {transcript && (
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm backdrop-blur-sm z-10">
                        <p>{transcript}</p>
                        {selectedLanguage !== 'English' && <p className="text-xs text-sky-300 italic pt-1">Translating to English...</p>}
                    </div>
                )}
            </div>

             {/* --- Placeholder Overlay --- */}
            <div className={`
                absolute inset-0 w-full h-full rounded-2xl 
                bg-slate-200 dark:bg-slate-800 
                border border-slate-300 dark:border-slate-700
                flex flex-col items-center justify-center text-center p-2
                text-slate-700 dark:text-slate-200
                transition-opacity duration-300
                ${showPlaceholder ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
                {cameraState === 'loading' && (
                    <>
                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-500 dark:border-amber-400"></div>
                        <p className="text-sm font-semibold mt-3">Starting camera...</p>
                    </>
                )}
                {cameraState === 'error' && (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mb-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        <p className="font-semibold text-red-500">Camera Error</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Check permissions & connection.</p>
                    </>
                )}
                 {cameraState === 'off' && (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500 mb-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        <p className="font-semibold text-slate-500">Camera Off</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default DraggableVideo;