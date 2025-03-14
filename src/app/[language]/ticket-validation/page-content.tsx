"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from "@/services/auth/use-auth";
import TicketValidationList from '@/components/tickets/validation/TicketValidationList';
import { TicketWithUserName } from '@/components/tickets/validation/types';
import { useSnackbar } from '@/hooks/use-snackbar';

export default function VendorTicketValidation() {
  const { t } = useTranslation("vendor-tickets");
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tickets, setTickets] = useState<TicketWithUserName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token || !user?.id) {
          throw new Error('Unauthorized');
        }
        
        const vendorResponse = await fetch(`${API_URL}/v1/vendors/user/${user.id}/owned`, {
          headers: { 'Authorization': `Bearer ${tokensInfo.token}` }
        });
        
        if (!vendorResponse.ok) {
          throw new Error('Failed to fetch vendor information');
        }
        
        const vendorData = await vendorResponse.json();
        if (!vendorData.data.length) {
          throw new Error('No vendor profile found');
        }
        
        const vendorId = vendorData.data[0]._id;
        
        const response = await fetch(`${API_URL}/tickets/vendor/${vendorId}`, {
          headers: { 'Authorization': `Bearer ${tokensInfo.token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to load tickets');
        }
        
        const data = await response.json();
        const rawTickets = data.data;
        
        const ticketsWithUserNames = await Promise.all(
          rawTickets.map(async (ticket: Omit<TicketWithUserName, 'userName'>) => {
            try {
              const userNameResponse = await fetch(`${API_URL}/v1/users/${ticket.userId}/name`, {
                headers: { 'Authorization': `Bearer ${tokensInfo.token}` }
              });
              
              if (userNameResponse.ok) {
                const userData = await userNameResponse.json();
                const userName = userData.firstName && userData.lastName 
                  ? `${userData.firstName} ${userData.lastName}` 
                  : userData.email;
                
                return { ...ticket, userName };
              }
              
              return { ...ticket, userName: ticket.userId };
            } catch (error) {
              console.error(`Error fetching user name for ticket ${ticket._id}:`, error);
              return { ...ticket, userName: ticket.userId };
            }
          })
        );
        
        setTickets(ticketsWithUserNames);
      } catch (error) {
        console.error('Error loading tickets:', error);
        setError(t('errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    
    loadTickets();
  }, [user, t]);
  
  const handleRedeemTicket = async (ticketId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('Unauthorized');
      }
      
      const response = await fetch(`${API_URL}/tickets/${ticketId}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to redeem ticket');
      }
      
      const updatedTicket = await response.json();
      setTickets(prev => 
        prev.map(ticket => 
          ticket._id === ticketId ? { ...updatedTicket.data, userName: ticket.userName } : ticket
        )
      );
      
      enqueueSnackbar(t('ticketRedeemed'), { variant: 'success' });
    } catch (error) {
      console.error('Error redeeming ticket:', error);
      enqueueSnackbar(
        error instanceof Error ? error.message : t('redeemFailed'), 
        { variant: 'error' }
      );
    }
  };
  
  const handleRefundTicket = async (ticketId: string) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('Unauthorized');
      }
      
      // Use the existing refund API endpoint
      const response = await fetch(`${API_URL}/stripe/refund/ticket/${ticketId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to refund ticket');
      }
      
      // Optimistically update the UI
      // The webhook will handle the actual status change
      setTickets(prev => 
        prev.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, status: 'CANCELLED' as const } 
            : ticket
        )
      );
      
      enqueueSnackbar(t('refundInitiated'), { variant: 'success' });
    } catch (error) {
      console.error('Error refunding ticket:', error);
      throw error;
    }
  };
  
  return (
    <TicketValidationList 
      tickets={tickets}
      loading={loading}
      error={error}
      onRedeemTicket={handleRedeemTicket}
      onRefundTicket={handleRefundTicket}
    />
  );
}