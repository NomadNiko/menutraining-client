import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import LinearProgress from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { SortEnum } from "@/services/api/types/sort-type";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";
import TableSortCell from "./TableSortCell";

const TableCellLoadingContainer = styled(TableCell)(() => ({
  padding: 0,
}));

interface UserTableHeaderProps {
  orderBy: keyof User;
  order: SortEnum;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof User
  ) => void;
  isFetchingNextPage: boolean;
}

function UserTableHeader({
  orderBy,
  order,
  handleRequestSort,
  isFetchingNextPage,
}: UserTableHeaderProps) {
  const { t: tUsers } = useTranslation("admin-panel-users");

  return (
    <>
      <TableRow>
        <TableCell style={{ width: 50 }}></TableCell>
        <TableSortCell<User>
          width={100}
          orderBy={orderBy}
          order={order}
          column="id"
          handleRequestSort={handleRequestSort}
        >
          {tUsers("admin-panel-users:table.column1")}
        </TableSortCell>
        <TableCell style={{ width: 200 }}>
          {tUsers("admin-panel-users:table.column2")}
        </TableCell>
        <TableSortCell<User>
          orderBy={orderBy}
          order={order}
          column="email"
          handleRequestSort={handleRequestSort}
        >
          {tUsers("admin-panel-users:table.column3")}
        </TableSortCell>
        <TableCell style={{ width: 80 }}>
          {tUsers("admin-panel-users:table.column4")}
        </TableCell>
        <TableCell style={{ width: 130 }}></TableCell>
      </TableRow>
      {isFetchingNextPage && (
        <TableRow>
          <TableCellLoadingContainer colSpan={6}>
            <LinearProgress />
          </TableCellLoadingContainer>
        </TableRow>
      )}
    </>
  );
}

export default UserTableHeader;
