import { ProductItem } from '@/app/[language]/types/product-item';

export type DateKey = string; // Format: 'YYYY-MM-DD'
export type TimeKey = string; // Format: 'HH:mm'

export interface GroupedItems {
  [date: DateKey]: {
    [time: TimeKey]: ProductItem[];
  };
}

export interface WeekRange {
  start: Date;
  end: Date;
}

export interface CalendarState {
  currentWeek: WeekRange;
  selectedDate: Date | null;
  selectedItem: ProductItem | null;
}

export interface CalendarViewOptions {
  isVendorView: boolean;
  showPastItems: boolean;
}