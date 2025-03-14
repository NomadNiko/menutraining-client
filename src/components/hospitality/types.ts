export interface KeyPoint {
    title: string;
    description: string;
  }
  
  export interface ExperienceEntry {
    period: string;
    role: string;
    company?: string;
    location?: string;
    description: string;
    skills: string[];
    keyPoints: KeyPoint[];
  }