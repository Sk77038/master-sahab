
import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCcw, Check, X, ArrowLeft, AlertCircle } from 'lucide-react';
import { solveWithImage } from './services/geminiService';
import { Language } from '../types';

export const CameraView: React.FC<{ language: Language; onBack: () => void }> = ({ language, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setPermissionError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission dismissed')) {
        setPermissionError("Camera access was denied or dismissed. Please enable permissions in your browser settings to use the scanner.");
      } else {
        setPermissionError("Could not access camera. Please ensure no other app is using it and try again.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(data);
      stopCamera();
    }
  };

  const processImage = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    try {
      const base64 = capturedImage.split(',')[1];
      const result = await solveWithImage(base64, language);
      setSolution(result || "Could not extract or solve the question.");
    } catch (err) {
      console.error(err);
      setSolution("Error connecting to AI. Please check your internet connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (permissionError) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Camera Permission Needed</h2>
        <p className="text-gray-400 mb-8 max-w-xs">
          {permissionError}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={startCamera}
            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold active:scale-95 transition-all"
          >
            Try Again
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-white/10 text-white p-4 rounded-xl font-bold active:scale-95 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <button onClick={onBack} className="p-2 bg-black/40 rounded-full text-white backdrop-blur-md">
          <ArrowLeft size={24} />
        </button>
      </div>

      {!capturedImage ? (
        <>
          <div className="flex-1 relative overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Scanner Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-lg" />
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
              </div>
              <p className="text-white text-sm font-medium mt-6 bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm">
                Align question inside the frame
              </p>
            </div>
          </div>
          <div className="p-8 pb-12 flex justify-center bg-black">
            <button 
              onClick={capture}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-600 active:scale-90 transition-all"
            >
              <div className="w-16 h-16 bg-white rounded-full border-2 border-black" />
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </>
      ) : (
        <div className="flex-1 flex flex-col bg-gray-900 text-white p-6 overflow-y-auto">
          {solution ? (
            <div className="animate-slide-in pb-10">
              <div className="flex items-center gap-3 mb-6 bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
                <div className="p-2 bg-blue-500 rounded-lg"><Check size={20} /></div>
                <div>
                  <h3 className="font-bold">Master Sahab Solution</h3>
                  <p className="text-xs text-blue-300">Generated by AI</p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-200 bg-white/5 p-6 rounded-2xl border border-white/10 text-base leading-relaxed">
                {solution}
              </div>
              <button 
                onClick={() => { setCapturedImage(null); setSolution(null); startCamera(); }}
                className="w-full mt-6 bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg shadow-blue-900/20"
              >
                Scan Another Question
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center mb-6">
                <img src={capturedImage} className="rounded-2xl max-h-full object-contain border border-white/10" />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => { setCapturedImage(null); startCamera(); }}
                  className="flex-1 p-4 bg-white/10 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <RefreshCcw size={20} /> Retake
                </button>
                <button 
                  onClick={processImage}
                  disabled={isProcessing}
                  className="flex-1 p-4 bg-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-900/40"
                >
                  {isProcessing ? <RefreshCcw className="animate-spin" size={20} /> : <><Check size={20} /> Solve It</>}
                </button>
              </div>
              {isProcessing && (
                <p className="text-center mt-4 text-sm text-blue-400 animate-pulse font-medium">
                  Master Sahab is analyzing your image...
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
