import React from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Calendar, Clock, Hash } from "lucide-react";
import { format, isValid } from 'date-fns';
import { styled } from '@mui/material/styles';
import type { Ticket } from '@/hooks/use-tickets';

// Utility function to wrap text at word boundaries
const wrapText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
};

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.glass,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  cursor: 'pointer',
}));

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'N/A';
  const hours = minutes / 60;
  return `${hours}h`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isValid(date) ? format(date, "dd MMM ''yy") : 'N/A';
};

export const TicketCard: React.FC<{
  ticket: Ticket;
  onClick: () => void;
}> = ({ ticket, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'REDEEMED': return 'info';
      case 'CANCELLED': return 'error';
      case 'REVOKED': return 'warning';
      default: return 'default';
    }
  };

  return (
    <StyledCard onClick={onClick}>
      <Box sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1
      }}>
        <Chip
          label={ticket.status}
          color={getStatusColor(ticket.status)}
          size="small"
        />
      </Box>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            whiteSpace: 'pre-line', 
            lineHeight: 1.2,
            display: 'block' 
          }}
        >
          {wrapText(ticket.productName)}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {ticket.productDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} />
              <Typography variant="body2">
                {formatDate(ticket.productDate)}
              </Typography>
            </Box>
          )}
          {ticket.productStartTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} />
              <Typography variant="body2">
                {ticket.productStartTime}
                {ticket.productDuration && ` (${formatDuration(ticket.productDuration)})`}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Hash size={16} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {`ID: ${ticket._id.slice(-8)}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 2 
        }}>
          <Typography variant="subtitle1" color="primary">
            {`Qty: ${ticket.quantity}`}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            ${ticket.productPrice.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TicketCard;