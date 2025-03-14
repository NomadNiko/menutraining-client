export interface Ticket {
    _id: string;
    userId: string;
    productItemId: string;
    productName: string;
    productDescription: string;
    productPrice: number;
    status: 'ACTIVE' | 'CANCELLED' | 'REDEEMED' | 'REVOKED';
    quantity: number;
    productDate?: string;
    productStartTime?: string;
  }
  
  export interface TicketWithUserName extends Ticket {
    userName: string;
  }