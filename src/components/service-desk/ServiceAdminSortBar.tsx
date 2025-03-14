import { Calendar, Clock, Filter } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
interface SortConfig {
  field: 'createDate' | 'lastUpdate' | 'status';
  direction: 'asc' | 'desc';
}

interface ServiceAdminSortBarProps {
  sort: SortConfig;
  onSortChange: (field: SortConfig['field']) => void;
  t: (key: string) => string;
}

const ServiceAdminSortBar = ({ sort, onSortChange, t }: ServiceAdminSortBarProps) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <Button
        variant={sort.field === 'createDate' ? 'contained' : 'outlined'}
        startIcon={<Calendar size={20} />}
        onClick={() => onSortChange('createDate')}
      >
        {t('sort.created')} {sort.field === 'createDate' && (sort.direction === 'asc' ? '↑' : '↓')}
      </Button>
      
      <Button
        variant={sort.field === 'lastUpdate' ? 'contained' : 'outlined'}
        startIcon={<Clock size={20} />}
        onClick={() => onSortChange('lastUpdate')}
      >
        {t('sort.lastUpdate')} {sort.field === 'lastUpdate' && (sort.direction === 'asc' ? '↑' : '↓')}
      </Button>
      
      <Button
        variant={sort.field === 'status' ? 'contained' : 'outlined'}
        startIcon={<Filter size={20} />}
        onClick={() => onSortChange('status')}
      >
        {t('sort.status')} {sort.field === 'status' && (sort.direction === 'asc' ? '↑' : '↓')}
      </Button>
    </Box>
  );
};

export default ServiceAdminSortBar;