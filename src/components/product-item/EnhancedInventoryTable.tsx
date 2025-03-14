import { useState } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ChevronUp, ChevronDown, Calendar, Clock, Tag } from "lucide-react";
import { format } from 'date-fns';
import { ProductItem } from '@/app/[language]/types/product-item';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

type Order = 'asc' | 'desc';
type ColumnId = keyof Pick<ProductItem, 'templateName' | 'productDate' | 'startTime' | 'quantityAvailable'>;

interface BaseColumnType {
  id: ColumnId;
  label: string;
  icon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  minWidth?: number;
  maxWidth?: number;
}

interface StringColumnType extends BaseColumnType {
  type: 'string';
  format: (value: string) => string;
}

interface NumberColumnType extends BaseColumnType {
  type: 'number';
  format: (value: number) => string;
}

type ColumnType = StringColumnType | NumberColumnType;

interface EnhancedTableProps {
  items: ProductItem[];
  onQuantityChange: (item: ProductItem, change: number) => Promise<void>;
  isUpdating: boolean;
  t: (key: string) => string;
}

export default function EnhancedInventoryTable({ 
  items: initialItems, 
  onQuantityChange, 
  isUpdating,
  t 
}: EnhancedTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<ColumnId>('productDate');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns: ColumnType[] = [
    { 
      id: 'templateName', 
      type: 'string',
      label: t('productName'),
      icon: <Tag size={16} />,
      align: 'left',
      format: (value: string) => isMobile ? `${value.slice(0, 42)}${value.length > 42 ? '...' : ''}` : value,
      sortable: true,
      minWidth: isMobile ? 120 : 200
    },
    { 
      id: 'productDate', 
      type: 'string',
      label: t('date'),
      icon: <Calendar size={16} />,
      align: 'left',
      format: (value: string) => format(new Date(value), isMobile ? 'MM/dd' : 'PP'),
      sortable: true,
      minWidth: isMobile ? 80 : 120
    },
    { 
      id: 'startTime', 
      type: 'string',
      label: t('startTime'),
      icon: <Clock size={16} />,
      align: 'left',
      format: (value: string) => format(new Date(`2000-01-01T${value}`), isMobile ? 'HH:mm' : 'p'),
      sortable: true,
      minWidth: isMobile ? 70 : 100
    }
  ];

  const handleRequestSort = (property: ColumnId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getComparatorValue = (item: ProductItem, property: ColumnId): number | string => {
    if (property === 'productDate') {
      const [hours, minutes] = item.startTime.split(':').map(Number);
      const date = new Date(item.productDate);
      date.setHours(hours, minutes, 0, 0);
      return date.getTime();
    }
    
    if (property === 'startTime') {
      const [hours, minutes] = item.startTime.split(':').map(Number);
      return hours * 60 + minutes;
    }
    
    if (property === 'quantityAvailable') {
      return item.quantityAvailable;
    }
    
    return item[property] as string;
  };

  const sortData = (data: ProductItem[]): ProductItem[] => {
    return [...data].sort((a, b) => {
      const aValue = getComparatorValue(a, orderBy);
      const bValue = getComparatorValue(b, orderBy);
      
      let comparison = 0;
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  };

  const sortedAndPaginatedData = sortData(initialItems)
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell 
                padding="none" 
                sx={{ 
                  width: 80,
                  minWidth: 80,
                  maxWidth: 80 
                }}
              >
                {t('quantityShort')}
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    padding: isMobile ? '8px 4px' : undefined
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {isMobile ? column.icon : column.label}
                    </TableSortLabel>
                  ) : (
                    isMobile ? column.icon : column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndPaginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography color="text.secondary">
                    {t('noItems')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedAndPaginatedData.map((item) => (
                <TableRow key={item._id}>
                  <TableCell padding="none">
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1
                    }}>
                      <IconButton
                        onClick={() => onQuantityChange(item, 1)}
                        size="small"
                        disabled={isUpdating}
                      >
                        <ChevronUp size={16} />
                      </IconButton>
                      <Typography variant="body2">
                        {item.quantityAvailable}
                      </Typography>
                      <IconButton
                        onClick={() => onQuantityChange(item, -1)}
                        size="small"
                        disabled={isUpdating || item.quantityAvailable <= 0}
                      >
                        <ChevronDown size={16} />
                      </IconButton>
                    </Box>
                  </TableCell>
                  {columns.map(column => {
                    const value = item[column.id];
                    return (
                      <TableCell 
                        key={column.id} 
                        align={column.align}
                        sx={{
                          padding: isMobile ? '8px 4px' : undefined,
                          fontSize: isMobile ? '0.875rem' : undefined
                        }}
                      >
                        {column.type === 'string' 
                          ? column.format(value as string)
                          : column.type === 'number'
                          ? column.format(value as number)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={isMobile ? [10, 25, 100] : [20, 60, 300]}
        component="div"
        count={initialItems.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? '' : undefined}
      />
    </>
  );
}