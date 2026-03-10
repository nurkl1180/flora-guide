import { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { PlantDetails } from './components/PlantDetails';
import { GardeningChat } from './components/GardeningChat';
import { identifyPlant } from './services/geminiService';
import { PlantInfo } from './types';
import { Leaf, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [plant, setPlant] = useState<PlantInfo | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setIsLoading(true);
    setError(null);
    setCapturedImage(base64);
    try {
      const result = await identifyPlant(base64);
      setPlant(result);
    } catch (err) {
      console.error(err);
      setError("I couldn't identify this plant. Please try again with a clearer photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPlant(null);
    setCapturedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 text-garden-green">
          <div className="bg-garden-green text-white p-2 rounded-xl">
            <Leaf size={24} />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight">FloraGuide</span>
        </div>
        {plant && (
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-garden-leaf hover:text-garden-green transition-colors font-medium"
          >
            <RefreshCw size={18} />
            <span>New Scan</span>
          </button>
        )}
      </header>

      <main className="flex-1 px-6 md:px-10">
        <AnimatePresence mode="wait">
          {!plant ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center space-y-12 py-12"
            >
              <div className="space-y-6">
                <h2 className="text-6xl md:text-7xl font-serif font-bold text-garden-green leading-[1.1]">
                  Discover the <span className="italic text-garden-leaf">soul</span> of your garden.
                </h2>
                <p className="text-xl text-garden-soil/70 max-w-lg mx-auto leading-relaxed">
                  Snap a photo to identify any plant and unlock expert care guides, watering schedules, and growth milestones.
                </p>
              </div>

              <div className="relative">
                <CameraCapture onCapture={handleCapture} isLoading={isLoading} />
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 flex flex-col items-center gap-4"
                  >
                    <div className="flex gap-2">
                      <Sparkles className="text-garden-leaf animate-pulse" />
                      <span className="text-garden-leaf font-medium italic">Analyzing your plant...</span>
                    </div>
                  </motion.div>
                )}
                {error && (
                  <p className="mt-4 text-red-600 font-medium">{error}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-12 opacity-40 grayscale">
                <img src="https://picsum.photos/seed/plant1/400/400" className="rounded-2xl aspect-square object-cover" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/plant2/400/400" className="rounded-2xl aspect-square object-cover" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/plant3/400/400" className="rounded-2xl aspect-square object-cover" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          ) : (
            <PlantDetails plant={plant} image={capturedImage || undefined} />
          )}
        </AnimatePresence>
      </main>

      <GardeningChat />

      {/* Footer */}
      <footer className="p-10 text-center border-t border-black/5 mt-20">
        <p className="text-sm opacity-40 font-serif italic">
          &copy; {new Date().getFullYear()} FloraGuide AI Assistant. Cultivating knowledge, one leaf at a time.
        </p>
      </footer>
    </div>
  );
}
