import { useMemo, JSX } from 'react';
import dynamic from 'next/dynamic';
import { format, isWithinInterval, eachDayOfInterval, isToday } from 'date-fns';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { ProductItem } from '@/app/[language]/types/product-item';
import { usePublicCalendarNavigation } from '@/hooks/use-public-calendar-navigation';
import { useTranslation } from "@/services/i18n/client";

const PublicDayColumn = dynamic(
  () => import('./PublicDayColumn'),
  { ssr: false }
);

interface PublicWeeklyCalendarProps {
  items: ProductItem[];
  onItemClick: (item: ProductItem) => void;
}

interface GroupedItems {
  [date: string]: ProductItem[];
}

export function PublicWeeklyCalendar({ 
  items, 
  onItemClick
}: PublicWeeklyCalendarProps): JSX.Element {
  const { t } = useTranslation("product-items");
  const {
    currentWeek,
    nextWeek,
    previousWeek,
    goToToday,
    canGoPrevious
  } = usePublicCalendarNavigation();
  
  // Memoize the grouping of items
  const groupedItems = useMemo(() => {
    const itemMap: GroupedItems = {};
    
    items.forEach(item => {
      const itemDate = new Date(item.productDate);
      if (!isWithinInterval(itemDate, { start: currentWeek.start, end: currentWeek.end })) {
        return;
      }
      
      const dateKey = format(itemDate, 'yyyy-MM-dd');
      if (!itemMap[dateKey]) {
        itemMap[dateKey] = [];
      }
      itemMap[dateKey].push(item);
    });

    // Sort items within each day by start time
    Object.keys(itemMap).forEach(date => {
      itemMap[date].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return itemMap;
  }, [items, currentWeek.start, currentWeek.end]);

  const weekDays = useMemo(() => 
    eachDayOfInterval({
      start: currentWeek.start,
      end: currentWeek.end
    }), 
    [currentWeek]
  );

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={previousWeek} 
            disabled={!canGoPrevious()}
            size="small"
          >
            <ChevronLeft />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<Calendar />}
            onClick={goToToday}
            size="small"
          >
            {t('today')}
          </Button>
          <IconButton 
            onClick={nextWeek}
            size="small"
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
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
            <PublicDayColumn
              key={dateKey}
              date={day}
              items={groupedItems[dateKey] || []}
              onItemClick={onItemClick}
              isToday={isToday(day)}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default PublicWeeklyCalendar;