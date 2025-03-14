import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import { User } from "@/services/api/types/user";
import { useTranslation } from "@/services/i18n/client";
import UserActions from "./UserActions";

interface UserTableRowProps {
  user: User;
}

function UserTableRow({ user }: UserTableRowProps) {
  const { t: tRoles } = useTranslation("admin-panel-roles");

  return (
    <>
      <TableCell style={{ width: 50 }}>
        <Avatar
          alt={user?.firstName + " " + user?.lastName}
          src={user?.photo?.path}
        />
      </TableCell>
      <TableCell style={{ width: 100 }}>{user?.id}</TableCell>
      <TableCell style={{ width: 200 }}>
        {user?.firstName} {user?.lastName}
      </TableCell>
      <TableCell>{user?.email}</TableCell>
      <TableCell style={{ width: 80 }}>
        {tRoles(`role.${user?.role?.id}`)}
      </TableCell>
      <TableCell style={{ width: 130 }}>
        {user && <UserActions user={user} />}
      </TableCell>
    </>
  );
}

export default UserTableRow;
