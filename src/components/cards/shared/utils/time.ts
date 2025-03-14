export const calculateEndTime = (startTime: Date, durationMinutes: number): Date => {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    return endTime;
  };