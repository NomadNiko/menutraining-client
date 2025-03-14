"use client";

import { User } from "@/services/api/types/user";
import { SortEnum } from "@/services/api/types/sort-type";
import { TableVirtuoso } from "react-virtuoso";
import TableComponents from "@/components/table/table-components";
import UserTableHeader from "./UserTableHeader";
import UserTableRow from "./UserTableRow";

interface UsersTableProps {
  users: User[];
  order: SortEnum;
  orderBy: keyof User;
  handleRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof User
  ) => void;
  handleScroll: () => void;
  isFetchingNextPage: boolean;
}

function UsersTable({
  users,
  order,
  orderBy,
  handleRequestSort,
  handleScroll,
  isFetchingNextPage,
}: UsersTableProps) {
  return (
    <TableVirtuoso
      style={{ height: 500 }}
      data={users}
      components={TableComponents}
      endReached={handleScroll}
      overscan={20}
      useWindowScroll
      increaseViewportBy={400}
      fixedHeaderContent={() => (
        <UserTableHeader
          orderBy={orderBy}
          order={order}
          handleRequestSort={handleRequestSort}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
      itemContent={(index, user) => <UserTableRow user={user} />}
    />
  );
}

export default UsersTable;
