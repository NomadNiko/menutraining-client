import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { CartItemType } from '@/app/[language]/cart/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const useStripeCheckout = (cartItems: CartItemType[] | undefined) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) return;

    const initializeCheckout = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error('No auth token available');
        }

        // Create payload matching server expectations
        const payload = {
          items: cartItems,
          currency: 'usd',
          returnUrl: `${window.location.origin}/dashboard`
        };

        const response = await fetch(`${API_URL}/stripe/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokensInfo.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        }

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize checkout';
        setError(errorMessage);
        } finally {
        setIsLoading(false);
      }
    };

    initializeCheckout();
  }, [cartItems]);

  return {
    stripePromise,
    clientSecret,
    isLoading,
    error
  };
};

export default useStripeCheckout;