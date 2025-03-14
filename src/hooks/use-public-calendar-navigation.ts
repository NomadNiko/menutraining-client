import { useState, useCallback } from 'react';
import { addDays, subDays, startOfDay, isBefore } from 'date-fns';
import { WeekRange } from '../types/calendar-types';

export function usePublicCalendarNavigation() {
  const today = startOfDay(new Date());
  
  // Create a week range starting from today
  const getInitialWeekRange = () => ({
    start: today,
    end: addDays(today, 6) // Show 7 days including today
  });

  const [currentWeek, setCurrentWeek] = useState<WeekRange>(getInitialWeekRange);

  const navigateToWeek = useCallback((date: Date) => {
    const startDate = startOfDay(date);
    // Prevent navigation to dates before today
    if (isBefore(startDate, today)) {
      setCurrentWeek({
        start: today,
        end: addDays(today, 6)
      });
    } else {
      setCurrentWeek({
        start: startDate,
        end: addDays(startDate, 6)
      });
    }
  }, [today]);

  const nextWeek = useCallback(() => {
    setCurrentWeek(prev => ({
      start: addDays(prev.start, 7),
      end: addDays(prev.end, 7)
    }));
  }, []);

  const previousWeek = useCallback(() => {
    setCurrentWeek(prev => {
      const newStart = subDays(prev.start, 7);
      // Prevent going before today
      if (isBefore(newStart, today)) {
        return {
          start: today,
          end: addDays(today, 6)
        };
      }
      return {
        start: newStart,
        end: subDays(prev.end, 7)
      };
    });
  }, [today]);

  const goToToday = useCallback(() => {
    setCurrentWeek({
      start: today,
      end: addDays(today, 6)
    });
  }, [today]);

  // Check if we can go to previous week
  const canGoPrevious = useCallback(() => {
    const previousStart = subDays(currentWeek.start, 7);
    return !isBefore(previousStart, today);
  }, [currentWeek.start, today]);

  return {
    currentWeek,
    navigateToWeek,
    nextWeek,
    previousWeek,
    goToToday,
    canGoPrevious
  };
}