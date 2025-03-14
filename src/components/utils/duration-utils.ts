export const formatDuration = (minutes: number): string => {
    if (!minutes) return '0min';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}min`;
    }
    
    if (remainingMinutes === 0) {
      return `${hours}hr`;
    }
    
    return `${hours}hr ${remainingMinutes}min`;
  };