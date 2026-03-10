
export interface PlantInfo {
  name: string;
  scientificName: string;
  description: string;
  isEdible: boolean;
  careInstructions: {
    planting?: string;
    wateringSchedule?: string;
    nutrientSchedule?: string;
    growthMilestones?: string[];
  };
  pestsAndDiseases: {
    commonIssues: string[];
    prevention: string;
    treatment: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
