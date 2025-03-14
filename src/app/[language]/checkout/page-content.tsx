"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { useCartQuery } from "@/hooks/use-cart-query";
import useAuth from "@/services/auth/use-auth";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { styled } from "@mui/material/styles";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Styled container for the checkout form
const CheckoutContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: "600px",
  position: "relative",
  "& .ElementsApp": {
    backgroundColor: "transparent",
  },
  // Custom styling for the embedded checkout iframe container
  "& .EmbeddedCheckout": {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    minHeight: "600px",
    backdropFilter: "blur(10px)",
    boxShadow: theme.shadows[4],
  },
  // Apply custom styles to Stripe Elements
  "& .StripeElement": {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
    "&--focus": {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}25`,
    },
  },
}));

const LoadingContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "calc(100vh - 64px)",
  backgroundColor: theme.palette.background.default,
}));

export default function CheckoutPageContent() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const { data: cartData, isLoading: isCartLoading } = useCartQuery();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
      return;
    }

    if (!isCartLoading && (!cartData || cartData.items.length === 0)) {
      router.replace("/cart");
      return;
    }

    const createCheckoutSession = async () => {
      if (!cartData?.items.length) return;
      setIsLoadingPayment(true);
      setError(null);

      try {
        const tokensInfo = getTokensInfo();
        if (!tokensInfo?.token) {
          throw new Error("No auth token available");
        }

        const response = await fetch(
          `${API_URL}/stripe/create-checkout-session`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokensInfo.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: cartData.items,
              currency: "usd",
              returnUrl: `${window.location.origin}/dashboard`,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to create checkout session"
          );
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) {
          throw new Error("No client secret received");
        }

        setClientSecret(clientSecret);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize checkout";
        setError(errorMessage);
      } finally {
        setIsLoadingPayment(false);
      }
    };

    createCheckoutSession();
  }, [isLoaded, user, router, cartData, isCartLoading]);

  if (isCartLoading || isLoadingPayment) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <CheckoutContainer>
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </CheckoutContainer>
  );
}
