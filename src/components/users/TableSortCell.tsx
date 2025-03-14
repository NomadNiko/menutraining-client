import { PropsWithChildren } from "react";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import { SortEnum } from "@/services/api/types/sort-type";

type TableSortCellProps<T> = PropsWithChildren<{
  width?: number;
  orderBy: keyof T;
  order: SortEnum;
  column: keyof T;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => void;
}>;

function TableSortCell<T>({
  width,
  orderBy,
  order,
  column,
  handleRequestSort,
  children,
}: TableSortCellProps<T>) {
  return (
    <TableCell
      style={{ width }}
      sortDirection={orderBy === column ? order : false}
    >
      <TableSortLabel
        active={orderBy === column}
        direction={orderBy === column ? order : SortEnum.ASC}
        onClick={(event) => handleRequestSort(event, column)}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );
}

export default TableSortCell;
