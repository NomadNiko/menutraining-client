import { useMemo } from 'react';
import { format, isWithinInterval, startOfDay } from 'date-fns';
import { ProductItem } from '@/app/[language]/types/product-item';
import { GroupedItems, WeekRange } from '../types/calendar-types';

export function useGroupedItems(
  items: ProductItem[],
  weekRange: WeekRange,
  options: {
    showPastItems: boolean;
  } = { showPastItems: true }
) {
  return useMemo(() => {
    const grouped: GroupedItems = {};
    const now = new Date();

    items.forEach(item => {
      const itemDate = new Date(item.productDate);
      
      // Skip if item is in the past and we're not showing past items
      if (!options.showPastItems && startOfDay(itemDate) < startOfDay(now)) {
        return;
      }

      // Skip if item is not within current week
      if (!isWithinInterval(itemDate, { start: weekRange.start, end: weekRange.end })) {
        return;
      }

      const dateKey = format(itemDate, 'yyyy-MM-dd');
      const timeKey = item.startTime;

      if (!grouped[dateKey]) {
        grouped[dateKey] = {};
      }
      
      if (!grouped[dateKey][timeKey]) {
        grouped[dateKey][timeKey] = [];
      }

      grouped[dateKey][timeKey].push(item);
    });

    // Sort items within each time slot
    Object.keys(grouped).forEach(date => {
      Object.keys(grouped[date]).forEach(time => {
        grouped[date][time].sort((a, b) => {
          // Add additional sorting criteria as needed
          return a.templateName.localeCompare(b.templateName);
        });
      });
    });

    return grouped;
  }, [items, weekRange, options.showPastItems]);
}