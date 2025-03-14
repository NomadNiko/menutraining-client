import React, { useEffect } from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { User } from 'lucide-react';
import { useUserInfo } from '@/hooks/use-user-info';

interface TicketUserInfoProps {
  userId: string;
  timestamp: Date;
  showTimestamp?: boolean;
}

export const TicketUserInfo: React.FC<TicketUserInfoProps> = ({
  userId,
  timestamp,
  showTimestamp = true
}) => {
  const { fetchUserInfo, getUserDisplayName } = useUserInfo();

  useEffect(() => {
    fetchUserInfo(userId);
  }, [userId, fetchUserInfo]);

  return (
    <Typography 
      variant="caption" 
      color="text.secondary" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5 
      }}
    >
      <User size={16} />
      {getUserDisplayName(userId)}
      {showTimestamp && (
        <Box component="span" sx={{ ml: 0.5 }}>
          • {new Date(timestamp).toLocaleString()}
        </Box>
      )}
    </Typography>
  );
};

export default TicketUserInfo;