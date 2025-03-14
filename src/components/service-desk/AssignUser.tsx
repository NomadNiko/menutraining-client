import { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import InputLabel from "@mui/material/InputLabel";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { TicketStatus } from '../../types/support-ticket';

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface AssignUserProps {
  ticketId: string;
  currentStatus: string;
  onAssignSuccess: () => void;
}

export const AssignUser = ({ ticketId, currentStatus, onAssignSuccess }: AssignUserProps) => {
  const { t } = useTranslation('service-desk');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Load users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token');
        }

        const response = await fetch(`${API_URL}/v1/users`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [t]);

  const handleAssign = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      // Assign user
      const assignResponse = await fetch(`${API_URL}/support-tickets/${ticketId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ assignedTo: selectedUser })
      });

      if (!assignResponse.ok) {
        throw new Error('Failed to assign user');
      }

      // Update status to ASSIGNED if current status is OPENED
      if (currentStatus === TicketStatus.OPENED) {
        const statusResponse = await fetch(`${API_URL}/support-tickets/${ticketId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokensInfo.token}`
          },
          body: JSON.stringify({ status: TicketStatus.ASSIGNED })
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to update status');
        }
      }

      setSelectedUser('');
      onAssignSuccess();
    } catch (error) {
      console.error('Error assigning user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUsers) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <FormControl fullWidth size="small">
        <InputLabel id="assign-user-label">
          {t('fields.assignUser')}
        </InputLabel>
        <Select
          labelId="assign-user-label"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          label={t('fields.assignUser')}
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={handleAssign}
        disabled={!selectedUser || loading}
        sx={{ minWidth: 100 }}
      >
        {loading ? <CircularProgress size={24} /> : t('actions.assign')}
      </Button>
    </Box>
  );
};

export default AssignUser;