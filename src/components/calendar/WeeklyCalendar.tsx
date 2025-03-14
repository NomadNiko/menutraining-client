import { useState, useEffect } from 'react';
import { eachDayOfInterval, format, parseISO } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DayColumn from './DayColumn';
import { ProductItem } from '@/app/[language]/types/product-item';

interface WeeklyCalendarProps {
  items: ProductItem[];
  onItemClick: (item: ProductItem) => void;
  currentWeek: {
    start: Date;
    end: Date;
  };
  isVendorView?: boolean;
}

export default function WeeklyCalendar({ 
  items, 
  onItemClick, 
  currentWeek,
  isVendorView = false 
}: WeeklyCalendarProps) {
  const [groupedItems, setGroupedItems] = useState<Map<string, ProductItem[]>>(new Map());

  useEffect(() => {
    const itemMap = new Map<string, ProductItem[]>();
    
    items.forEach(item => {
      const dateKey = format(parseISO(item.productDate), 'yyyy-MM-dd');
      
      if (!itemMap.has(dateKey)) {
        itemMap.set(dateKey, []);
      }
      itemMap.get(dateKey)?.push(item);
    });

    itemMap.forEach((dayItems, date) => {
      itemMap.set(date, dayItems.sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      ));
    });

    setGroupedItems(itemMap);
  }, [items]);

  const weekDays = eachDayOfInterval({
    start: currentWeek.start,
    end: currentWeek.end
  });

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRadius: 1,
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6">
          {`${format(currentWeek.start, 'MMMM d')} - ${format(currentWeek.end, 'MMMM d, yyyy')}`}
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex',
        flex: 1,
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'auto',
        '& > *': {
          flex: { xs: '0 0 auto', sm: 1 },
          minHeight: { xs: 300, sm: 'auto' },
          borderRight: { xs: 0, sm: 1 },
          borderBottom: { xs: 1, sm: 0 },
          borderColor: 'divider',
          '&:last-child': {
            borderRight: 0,
            borderBottom: 0
          }
        }
      }}>
        {weekDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return (
            <DayColumn
              key={dateKey}
              date={day}
              items={groupedItems.get(dateKey) || []}
              onItemClick={onItemClick}
              isVendorView={isVendorView}
            />
          );
        })}
      </Box>
    </Box>
  );
}