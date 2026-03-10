import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  isLoading: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, isLoading }) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg');
        onCapture(base64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {!showCamera ? (
        <div className="flex gap-4 w-full">
          <button
            onClick={startCamera}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-garden-green text-white py-4 rounded-2xl hover:bg-garden-leaf transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
            <span className="font-medium">Take Photo</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-garden-green text-garden-green py-4 rounded-2xl hover:bg-white transition-colors disabled:opacity-50"
          >
            <Upload size={24} />
            <span className="font-medium">Upload</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full aspect-square bg-black rounded-3xl overflow-hidden shadow-2xl"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 items-center">
            <button
              onClick={stopCamera}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <X size={24} />
            </button>
            <button
              onClick={takePhoto}
              className="w-16 h-16 bg-white rounded-full border-4 border-garden-green shadow-lg active:scale-90 transition-transform"
            />
            <div className="w-12" /> {/* Spacer */}
          </div>
        </motion.div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
