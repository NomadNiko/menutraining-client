import { useState, useEffect } from 'react';
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import useAuth from '@/services/auth/use-auth';

export interface Ticket {
  _id: string;
  userId: string;
  transactionId: string;
  vendorId: string;
  productItemId: string;
  productName: string;
  productDescription: string;
  productPrice: number;
  productType: string;
  status: 'ACTIVE' | 'CANCELLED' | 'REDEEMED' | 'REVOKED';
  quantity: number;
  productDate?: string;
  productStartTime?: string;
  productDuration?: number;
  productLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  productImageURL?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseTicketsReturn {
  tickets: Ticket[];
  activeTickets: Ticket[];
  oldTickets: Ticket[];
  loading: boolean;
}

export function useTickets(): UseTicketsReturn {
  const { t } = useTranslation("tickets");
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          return;
        }

        const response = await fetch(`${API_URL}/tickets/user/${user.id}`, {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tickets");
        
        const data = await response.json();
        setTickets(data.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user?.id, t]);

  const activeTickets = tickets.filter(ticket => ticket.status === 'ACTIVE');
  const oldTickets = tickets.filter(ticket => ticket.status !== 'ACTIVE');

  return { tickets, activeTickets, oldTickets, loading };
}