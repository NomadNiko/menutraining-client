import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { Download, Ticket as TicketIcon, ExternalLink } from "lucide-react";
import { format, isValid } from 'date-fns';
import type { Ticket } from '@/hooks/use-tickets';
import QRGenerator from "./QRGenerator";
import html2canvas from 'html2canvas';

interface TicketDetailProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onClose }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, "dd MMM ''yy") : 'N/A';
  };

  const getStatusColor = (status: string): "success" | "error" | "warning" | "info" => {
    switch (status) {
      case 'ACTIVE': return "success";
      case 'REDEEMED': return "info";
      case 'CANCELLED': return "error";
      case 'REVOKED': return "warning";
      default: return "info";
    }
  };

  const handleExportTicket = async () => {
    const ticketEl = document.getElementById('ticket-content');
    if (!ticketEl) return;

    try {
      const canvas = await html2canvas(ticketEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        windowWidth: 440,
        windowHeight: 1350
      });
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'pdf', 1.0);
      });
    
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${ticket._id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting ticket:', error);
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = minutes / 60;
    return `${hours}h`;
  };
  
  const handleOpenMap = () => {
    if (ticket.productLocation) {
      const { coordinates } = ticket.productLocation;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`,
        '_blank'
      );
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
      onClick={onClose}
    >
      <Paper 
        sx={{ 
          maxWidth: 500, 
          width: '100%', 
          mx: 'auto', 
          p: 3,
          backgroundColor: 'background.paper',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <Box id="ticket-content" sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 3,
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TicketIcon size={24} />
            <Typography variant="h6">{ticket.productName}</Typography>
          </Box>

          <Alert severity={getStatusColor(ticket.status)} sx={{ mb: 3 }}>
            Ticket Status: {ticket.status}
          </Alert>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <QRGenerator ticketId={ticket._id} transactionId={ticket.transactionId} />
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={6}>
              <Typography color="text.secondary" variant="caption" display="block">
                Date
              </Typography>
              <Typography>{formatDate(ticket.productDate)}</Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography color="text.secondary" variant="caption" display="block">
                Time
              </Typography>
              <Typography>{ticket.productStartTime || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography color="text.secondary" variant="caption" display="block">
                Duration
              </Typography>
              <Typography>
                {ticket.productDuration && formatDuration(ticket.productDuration)}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography color="text.secondary" variant="caption" display="block">
                Quantity
              </Typography>
              <Typography>{ticket.quantity}</Typography>
            </Grid>
          </Grid>

          {ticket.productLocation && (
            <Box sx={{ mb: 2, ml: 2 }}>
              <Button
                variant="text"
                size="small"
                onClick={handleOpenMap}
                endIcon={<ExternalLink size={16} />}
              >
                View Location
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={handleExportTicket}
          >
            Export
          </Button>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketDetail;