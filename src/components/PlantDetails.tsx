import React from 'react';
import { PlantInfo } from '../types';
import { motion } from 'motion/react';
import { Droplets, Sprout, Bug, ShieldAlert, Leaf } from 'lucide-react';

interface PlantDetailsProps {
  plant: PlantInfo;
  image?: string;
}

export const PlantDetails: React.FC<PlantDetailsProps> = ({ plant, image }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 pb-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {image && (
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
            <img src={image} alt={plant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
        <div className="space-y-4">
          <div>
            <h1 className="text-5xl font-serif font-bold text-garden-green leading-tight">{plant.name}</h1>
            <p className="text-xl italic text-garden-leaf font-serif">{plant.scientificName}</p>
          </div>
          <p className="text-lg leading-relaxed opacity-80">{plant.description}</p>
          {plant.isEdible && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold uppercase tracking-wider">
              <Leaf size={16} />
              Edible Plant
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Care Instructions */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-4">
          <div className="flex items-center gap-3 text-garden-green">
            <Sprout size={24} />
            <h3 className="text-xl font-serif font-bold">Planting</h3>
          </div>
          <p className="text-sm opacity-80">{plant.careInstructions.planting || "Standard planting procedures apply."}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-4">
          <div className="flex items-center gap-3 text-garden-green">
            <Droplets size={24} />
            <h3 className="text-xl font-serif font-bold">Watering</h3>
          </div>
          <p className="text-sm opacity-80">{plant.careInstructions.wateringSchedule}</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 space-y-4">
          <div className="flex items-center gap-3 text-garden-green">
            <ShieldAlert size={24} />
            <h3 className="text-xl font-serif font-bold">Nutrients</h3>
          </div>
          <p className="text-sm opacity-80">{plant.careInstructions.nutrientSchedule}</p>
        </div>
      </div>

      {plant.careInstructions.growthMilestones && plant.careInstructions.growthMilestones.length > 0 && (
        <div className="bg-garden-green text-white p-10 rounded-3xl space-y-6">
          <h3 className="text-3xl font-serif font-bold">Growth Milestones</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plant.careInstructions.growthMilestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4 items-start border-l-2 border-white/20 pl-4 py-2">
                <span className="font-serif text-2xl opacity-50">0{idx + 1}</span>
                <p className="text-lg">{milestone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-black/5 space-y-6">
          <div className="flex items-center gap-3 text-red-800">
            <Bug size={32} />
            <h3 className="text-3xl font-serif font-bold">Pests & Diseases</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest opacity-50 mb-2">Common Issues</h4>
              <ul className="list-disc pl-5 space-y-1">
                {plant.pestsAndDiseases.commonIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest opacity-50 mb-2">Prevention</h4>
              <p>{plant.pestsAndDiseases.prevention}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest opacity-50 mb-2">Treatment</h4>
              <p>{plant.pestsAndDiseases.treatment}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center p-10 bg-garden-leaf/10 rounded-3xl border border-garden-leaf/20">
          <h3 className="text-2xl font-serif font-bold text-garden-green mb-4 italic">Gardener's Tip</h3>
          <p className="text-lg leading-relaxed italic opacity-80">
            "The best fertilizer is the gardener's shadow. Spend time with your plants every day to notice small changes before they become big problems."
          </p>
        </div>
      </div>
    </motion.div>
  );
};
