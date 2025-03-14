"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { useTickets, Ticket } from '@/hooks/use-tickets';
import TicketCard from '@/components/tickets/TicketCard';
import { DashboardSection } from './common';

const TicketDetail = dynamic(
  () => import('@/components/tickets/UpcomingTicketDetail'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false
  }
);

export const TicketsSection = () => {
  const { t } = useTranslation("tickets");
  const { activeTickets, loading: ticketsLoading } = useTickets();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <Box sx={{ position: 'relative', zIndex: 80 }}>
      <DashboardSection>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h5" gutterBottom>
            {t("upcomingTickets")}
          </Typography>
          
          {ticketsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          ) : activeTickets.length === 0 ? (
            <Typography color="text.secondary">
              {t("noUpcomingTickets")}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {activeTickets.slice(0, 4).map((ticket) => (
                <Grid item xs={12} key={ticket._id}>
                  <TicketCard
                    ticket={ticket}
                    onClick={() => setSelectedTicket(ticket)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ 
            mt: 'auto', 
            pt: 2,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Button
              variant="outlined"
              LinkComponent="a"
              href="/tickets"
              fullWidth
              sx={{ maxWidth: 200 }}
            >
              {t("viewAll")}
            </Button>
          </Box>
        </Box>
      </DashboardSection>
      
      {selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </Box>
  );
};