import { useState, useCallback } from 'react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { WeekRange } from '../types/calendar-types';

export function useCalendarNavigation(initialDate: Date = new Date()) {
  const [currentWeek, setCurrentWeek] = useState<WeekRange>(() => ({
    start: startOfWeek(initialDate, { weekStartsOn: 0 }),
    end: endOfWeek(initialDate, { weekStartsOn: 0 })
  }));

  const navigateToWeek = useCallback((date: Date) => {
    setCurrentWeek({
      start: startOfWeek(date, { weekStartsOn: 0 }),
      end: endOfWeek(date, { weekStartsOn: 0 })
    });
  }, []);

  const nextWeek = useCallback(() => {
    setCurrentWeek(prev => ({
      start: addWeeks(prev.start, 1),
      end: addWeeks(prev.end, 1)
    }));
  }, []);

  const previousWeek = useCallback(() => {
    setCurrentWeek(prev => ({
      start: subWeeks(prev.start, 1),
      end: subWeeks(prev.end, 1)
    }));
  }, []);

  const goToToday = useCallback(() => {
    navigateToWeek(new Date());
  }, [navigateToWeek]);

  return {
    currentWeek,
    navigateToWeek,
    nextWeek,
    previousWeek,
    goToToday
  };
}