import { useState, useEffect } from 'react';
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

export const useStripeConnect = (vendorId: string | undefined) => {
    const [stripeConnectInstance, setStripeConnectInstance] = useState<ReturnType<typeof loadConnectAndInitialize> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
      if (!vendorId) return;
  
      const initializeStripeConnect = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const tokensInfo = getTokensInfo();
          if (!tokensInfo?.token) {
            throw new Error('No auth token available');
          }
  
          // Step 1: Create/Get Stripe Account
          console.log('Creating/Getting Stripe account...');
          const accountResponse = await fetch(`${API_URL}/stripe-connect/account`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokensInfo.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vendorId })
          });
  
          if (!accountResponse.ok) {
            throw new Error('Failed to create/retrieve Stripe account');
          }
          const { account: stripeAccountId } = await accountResponse.json();
          
          // Step 2: Update Vendor's Stripe Connect ID
          console.log('Updating vendor with Stripe Connect ID...');
          const updateResponse = await fetch(`${API_URL}/vendors/${vendorId}/stripe-connect`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokensInfo.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ stripeConnectId: stripeAccountId })
          });

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json().catch(() => ({}));
            throw new Error(`Failed to update vendor: ${errorData.message || updateResponse.statusText}`);
          }
          
          // Step 3: Create Account Session
          console.log('Creating account session...');
          const fetchClientSecret = async () => {
            const sessionResponse = await fetch(`${API_URL}/stripe-connect/account-session`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${tokensInfo.token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                account: stripeAccountId
              })
            });
  
            if (!sessionResponse.ok) {
              throw new Error('Failed to create account session');
            }
            const { client_secret: clientSecret } = await sessionResponse.json();
            return clientSecret;
          };
  
          // Step 4: Initialize Stripe Connect
          console.log('Initializing Stripe Connect...');
          const stripeConnect = await loadConnectAndInitialize({
            publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
            fetchClientSecret,
            appearance: {
              overlays: "dialog",
              variables: {
                colorPrimary: "#FFFFFF",
                colorBackground: "#1C283A",
                colorText: "#FFFFFF",
              },
            },
          });
  
          setStripeConnectInstance(stripeConnect);
          console.log('Stripe Connect initialized successfully');
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Stripe Connect';
          console.error('Stripe Connect Error:', errorMessage);
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };
  
      initializeStripeConnect();
    }, [vendorId]);
  
    return {
      stripeConnectInstance,
      isLoading,
      error
    };
};

export default useStripeConnect;