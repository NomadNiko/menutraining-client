import React, { useRef } from 'react';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { ChevronDown } from 'lucide-react';
import Link from "@/components/link";

interface NavGroup {
  groupName: string;
  items: {
    key: string;
    path: string;
  }[];
}

interface GroupedNavItemsProps {
  group: NavGroup;
  t: (key: string) => string;
  onClose: () => void;
  onGroupOpen: (groupName: string) => void;
  isOpen: boolean;
}

const GroupedNavItems: React.FC<GroupedNavItemsProps> = ({ 
  group, 
  t, 
  onClose,
  onGroupOpen,
  isOpen 
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (isOpen) {
      onClose();
    } else {
      onGroupOpen(group.groupName);
    }
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    onClose();
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Box sx={{ display: 'inline-block' }}>
      <Button
        ref={anchorRef}
        onClick={handleToggle}
        sx={{ 
          my: 2, 
          color: "white", 
          display: "flex", 
          alignItems: "center",
          gap: 0.5
        }}
        endIcon={
          <ChevronDown 
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s'
            }} 
          />
        }
      >
        {t(`common:navigation.${group.groupName.toLowerCase()}`)}
      </Button>
      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper sx={{ 
              mt: 0.5,
              backgroundColor: 'background.glass',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={isOpen}
                  onKeyDown={handleListKeyDown}
                >
                  {group.items.map((item) => (
                    <MenuItem 
                      key={item.key}
                      onClick={handleClose}
                      component={Link}
                      href={item.path}
                    >
                      {t(`common:navigation.${item.key}`)}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  );
};

export default GroupedNavItems;