import { RoleEnum } from "@/services/api/types/role";
import { User } from "@/services/api/types/user";
import Button from "@mui/material/Button";
import Link from "@/components/link";
import { useTranslation } from "@/services/i18n/client";
import { useState } from "react";
import GroupedNavItems from "./grouped-nav-items";

interface NavItemProps {
  user: User | null;
  onClose: () => void;
}

const ADMIN_GROUP = {
  groupName: 'Admin',
  items: [
    { key: "service-admin", path: "/service-admin" },
    { key: "vendor-admin", path: "/vendor-admin" },
    { key: "users", path: "/admin-panel/users" },
    { key: "approvals", path: "/approvals" }
  ]
};

const PRODUCT_GROUP = {
  groupName: 'Products',
  items: [
    { key: "addProduct", path: "/templates" },
    { key: "items", path: "/product-items" },
    { key: "inventory", path: "/inventory" },
  ]
};

export const getNavItems = (user: User | null) => {
  const isAdmin = user?.role && Number(user.role.id) === RoleEnum.ADMIN;
  const isVendor = user?.role && (Number(user.role.id) === RoleEnum.VENDOR || Number(user.role.id) === RoleEnum.PREVENDOR);

  const regularItems = [
    { key: "home", path: "/", roles: [] },
    { key: "dashboard", path: "/dashboard", roles: [] },
    { key: "vendor-status", path: "/vendor-status", roles: [RoleEnum.PREVENDOR] },
    { key: "vendor-account", path: "/vendor-account", roles: [RoleEnum.VENDOR] },
    { key: "ticket-validation", path: "/ticket-validation", roles: [RoleEnum.VENDOR] },
  ];

  const filteredItems = regularItems.filter(item => {
    if (item.roles.length === 0) return true;
    return user?.role && item.roles.includes(Number(user.role.id));
  });

  return {
    regularItems: filteredItems,
    productGroup: isVendor ? PRODUCT_GROUP : null,
    adminGroup: isAdmin ? ADMIN_GROUP : null
  };
};

export const NavItems: React.FC<NavItemProps> = ({ user, onClose }) => {
  const { t } = useTranslation("common");
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { regularItems, adminGroup, productGroup } = getNavItems(user);

  const handleGroupOpen = (groupName: string) => {
    setOpenGroup(groupName);
  };

  const handleGroupClose = () => {
    setOpenGroup(null);
  };

  return (
    <>
      {regularItems.map((item) => (
        <Button
          key={item.key}
          onClick={onClose}
          sx={{ my: 2, color: "white", display: "block" }}
          component={Link}
          href={item.path}
        >
          {t(`common:navigation.${item.key}`)}
        </Button>
      ))}
      {adminGroup && (
        <GroupedNavItems
          group={adminGroup}
          t={t}
          onClose={handleGroupClose}
          onGroupOpen={handleGroupOpen}
          isOpen={openGroup === adminGroup.groupName}
        />
      )}
      {productGroup && (
        <GroupedNavItems
          group={productGroup}
          t={t}
          onClose={handleGroupClose}
          onGroupOpen={handleGroupOpen}
          isOpen={openGroup === productGroup.groupName}
        />
      )}
    </>
  );
};