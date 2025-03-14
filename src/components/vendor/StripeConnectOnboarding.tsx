import { useState } from "react";
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";
import { StepChange } from "@stripe/connect-js";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { useStripeConnect } from "@/hooks/use-stripe-connect";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";

interface StripeAccountDetails {
  id: string;
  [key: string]: unknown;
}

interface StripeAccountResponse {
  account: StripeAccountDetails;
}

interface StripeConnectOnboardingProps {
  vendorId: string;
  onClose?: () => void;
}

export const StripeConnectOnboarding: React.FC<
  StripeConnectOnboardingProps
> = ({ vendorId, onClose }) => {
  const { t } = useTranslation("vendor-status");
  const [onboardingExited, setOnboardingExited] = useState(false);
  const { stripeConnectInstance, isLoading, error } =
    useStripeConnect(vendorId);

  const updateVendorStripeAccount = async (
    stripeAccount: StripeAccountDetails
  ) => {
    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No authentication token");
      }

      //console.log("Updating vendor Stripe account:", stripeAccount.id);

      const response = await fetch(
        `${API_URL}/stripe-connect/update-vendor/${vendorId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokensInfo.token}`,
          },
          body: JSON.stringify({ id: stripeAccount.id }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to update vendor Stripe account: ${errorBody}`);
      }

      await response.json();

      // Call onClose handler if provided
      if (onClose) {
        onClose();
      } else {
        // Otherwise reload the page to refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating Stripe account:", error);
    }
  };

  const handleStepChange = (change: StepChange) => {
    console.log("Current Stripe onboarding step:", change.step);
  };

  const handleExit = async () => {
    setOnboardingExited(true);

    try {
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No authentication token");
      }

      const response = await fetch(`${API_URL}/stripe-connect/account`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Stripe account details");
      }

      const accountData: StripeAccountResponse = await response.json();

      await updateVendorStripeAccount(accountData.account);
    } catch (error) {
      console.error("Error on Stripe onboarding exit:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => (onClose ? onClose() : window.location.reload())}
            fullWidth
            sx={{
              background: (theme) => theme.palette.customGradients.buttonMain,
              "&:hover": {
                background: (theme) => theme.palette.customGradients.buttonMain,
                filter: "brightness(0.9)",
              },
            }}
          >
            {t("stripe.retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (onboardingExited) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t("stripe.exitedMessage")}
          </Alert>
          <Button
            variant="contained"
            onClick={() => setOnboardingExited(false)}
            fullWidth
            sx={{
              background: (theme) => theme.palette.customGradients.buttonMain,
              "&:hover": {
                background: (theme) => theme.palette.customGradients.buttonMain,
                filter: "brightness(0.9)",
              },
            }}
          >
            {t("stripe.resumeOnboarding")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={<Typography variant="h6">{t("stripe.title")}</Typography>}
      />
      <CardContent>
        {stripeConnectInstance && (
          <Box
            sx={{
              ".connect-onboarding": {
                width: "100%",
                minHeight: "500px",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              },
            }}
          >
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              <ConnectAccountOnboarding
                onExit={handleExit}
                onStepChange={handleStepChange}
              />
            </ConnectComponentsProvider>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StripeConnectOnboarding;
