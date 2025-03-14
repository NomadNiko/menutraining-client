import { useState } from 'react';
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

interface ChangeStatusProps {
  ticketId: string;
  currentStatus: TicketStatus;
  onStatusChange: () => void;
}

export const ChangeStatus = ({ ticketId, currentStatus, onStatusChange }: ChangeStatusProps) => {
  const { t } = useTranslation('service-desk');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | ''>('');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    if (!selectedStatus) return;

    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/support-tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify({ status: selectedStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setSelectedStatus('');
      onStatusChange();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: TicketStatus.OPENED, label: t('status.opened') },
    { value: TicketStatus.ASSIGNED, label: t('status.assigned') },
    { value: TicketStatus.HOLD, label: t('status.hold') },
    { value: TicketStatus.RESOLVED, label: t('status.resolved') },
    { value: TicketStatus.CLOSED, label: t('status.closed') }
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <FormControl fullWidth size="small">
        <InputLabel id="change-status-label">
          {t('fields.status')}
        </InputLabel>
        <Select
          labelId="change-status-label"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as TicketStatus)}
          label={t('fields.status')}
        >
          {statusOptions.map((status) => (
            <MenuItem 
              key={status.value} 
              value={status.value}
              disabled={status.value === currentStatus}
            >
              {status.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={handleStatusChange}
        disabled={!selectedStatus || loading}
        sx={{ minWidth: 120 }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          t('actions.updateStatus')
        )}
      </Button>
    </Box>
  );
};

export default ChangeStatus;