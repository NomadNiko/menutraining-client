export interface KeyPoint {
    title: string;
    description: string;
  }
  
  export interface ExperienceEntry {
    period: string;
    role: string;
    company?: string;
    description: string;
    skills: string[]; // Added skills array
    keyPoints: KeyPoint[];
  }