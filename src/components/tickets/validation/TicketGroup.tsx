import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "@/services/i18n/client";
import { TicketWithUserName } from './types';
import TicketCard from './TicketCard';

interface TicketGroupProps {
  productItemId: string;
  groupName: string;
  activeTickets: TicketWithUserName[];
  redeemedTickets: TicketWithUserName[];
  cancelledTickets: TicketWithUserName[];
  onRedeemTicket: (ticketId: string) => Promise<void>;
  onRefundTicket: (ticketId: string) => Promise<void>;
}

export default function TicketGroup({
  groupName,
  activeTickets,
  redeemedTickets,
  cancelledTickets,
  onRedeemTicket,
  onRefundTicket
}: TicketGroupProps) {
  const { t } = useTranslation("vendor-tickets");
  const hasTickets = activeTickets.length > 0 || redeemedTickets.length > 0 || cancelledTickets.length > 0;

  return (
    <Paper 
      elevation={1}
      sx={{ 
        height: '100%',
        p: 2,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {groupName}
      </Typography>

      {!hasTickets && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          {t('noTicketsForProduct')}
        </Typography>
      )}

      {activeTickets.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 1.5 }}>
            {t('activeTickets')} ({activeTickets.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activeTickets.map(ticket => (
              <TicketCard 
                key={ticket._id} 
                ticket={ticket} 
                onRedeemTicket={onRedeemTicket}
                onRefundTicket={onRefundTicket}
              />
            ))}
          </Box>
        </Box>
      )}

      {redeemedTickets.length > 0 && (
        <Box sx={{ mb: 3, opacity: 0.85 }}>
          <Typography variant="subtitle2" color="info.main" sx={{ mb: 1.5 }}>
            {t('redeemedTickets')} ({redeemedTickets.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {redeemedTickets.map(ticket => (
              <TicketCard 
                key={ticket._id} 
                ticket={ticket} 
                onRedeemTicket={onRedeemTicket}
                onRefundTicket={onRefundTicket}
                readOnly
              />
            ))}
          </Box>
        </Box>
      )}

      {cancelledTickets.length > 0 && (
        <Accordion 
          sx={{ 
            mt: 2, 
            opacity: 0.7,
            '&:before': { display: 'none' },
            boxShadow: 'none',
            background: 'transparent'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('cancelledTickets')} ({cancelledTickets.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cancelledTickets.map(ticket => (
                <TicketCard 
                  key={ticket._id} 
                  ticket={ticket} 
                  onRedeemTicket={onRedeemTicket}
                  readOnly
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
}