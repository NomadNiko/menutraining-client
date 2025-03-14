import React from 'react';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { QrCode, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PurchasedTicket {
  _id: string;
  productName: string;
  productDescription: string;
  productDate?: string;
  productStartTime?: string;
  productImageURL?: string;
  quantity: number;
  price: number;
  transactionId: string;
}

interface PurchasedTicketsProps {
  tickets: PurchasedTicket[];
}

export default function PurchasedTickets({ tickets }: PurchasedTicketsProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Your Tickets
      </Typography>
      <Grid container spacing={3}>
        {tickets.map((ticket) => (
          <Grid item xs={12} key={ticket._id}>
            <Card sx={{
              background: 'rgba(17, 25, 40, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.125)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  {ticket.productImageURL && (
                    <Box
                      component="img"
                      src={ticket.productImageURL}
                      alt={ticket.productName}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {ticket.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {ticket.productDescription}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {ticket.productDate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={16} />
                          <Typography variant="body2">
                            {format(new Date(ticket.productDate), 'PPP')}
                          </Typography>
                        </Box>
                      )}
                      {ticket.productStartTime && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Clock size={16} />
                          <Typography variant="body2">
                            {ticket.productStartTime}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    minWidth: 120
                  }}>
                    <QrCode size={64} />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Scan to verify
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {ticket.quantity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Transaction ID: {ticket.transactionId}
                    </Typography>
                  </Box>
                  <Typography variant="h6">
                    ${(ticket.price * ticket.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}