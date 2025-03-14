import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Modal from "@mui/material/Modal";
import { CheckCircle2, Circle, CircleDashed, PlusCircle } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";
import { useVendorStatus } from "@/hooks/use-vendor-status";
import { styled } from "@mui/material/styles";
import StripeConnectOnboarding from "@/components/vendor/StripeConnectOnboarding";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.glass,
  backdropFilter: "blur(10px)",
  border: `1px solid ${theme.palette.divider}`,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

interface StatusStepProps {
  status: "complete" | "in-progress" | "pending";
  title: string;
  description: string;
  children?: React.ReactNode;
}

const StatusStep: React.FC<StatusStepProps> = ({
  status,
  title,
  description,
  children,
}) => {
  const getIcon = () => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="text-green-500" />;
      case "in-progress":
        return <CircleDashed className="text-blue-500 animate-spin" />;
      default:
        return <Circle className="text-gray-300" />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        bgcolor: "background.glass",
        backdropFilter: "blur(10px)",
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Box sx={{ pt: 1 }}>{getIcon()}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        {children && <Box sx={{ mt: 2 }}>{children}</Box>}
      </Box>
    </Box>
  );
};

const VendorStatusPage: React.FC = () => {
  const { t } = useTranslation("vendor-status");
  const { user } = useAuth();
  const { vendor, loading, error, refreshStatus } = useVendorStatus(
    user?.id?.toString() || ""
  );
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  // Use the new isStripeSetupComplete field instead of checking detailsSubmitted
  const isStripeComplete = vendor?.isStripeSetupComplete === true;

  // Refresh status when modal closes
  const handleModalClose = () => {
    setIsStripeModalOpen(false);
    refreshStatus();
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!vendor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">{t("noVendorFound")}</Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t("vendorOnboarding")}
        </Typography>

        <StyledCard>
          <CardContent>
            {/* Step 1: Always complete */}
            <StatusStep
              status="complete"
              title={t("steps.profile.title")}
              description={t("steps.profile.description")}
            />

            {/* Step 2: Create Templates */}
            <StatusStep
              status={vendor.hasTemplates ? "complete" : "in-progress"}
              title={t("steps.templates.title")}
              description={t("steps.templates.description")}
            >
              {!vendor.hasTemplates && (
                <Button
                  variant="contained"
                  startIcon={<PlusCircle />}
                  href="/templates/add"
                  sx={{
                    background: (theme) =>
                      theme.palette.customGradients.buttonMain,
                    "&:hover": {
                      background: (theme) =>
                        theme.palette.customGradients.buttonMain,
                      filter: "brightness(0.9)",
                    },
                  }}
                >
                  {t("createTemplate")}
                </Button>
              )}
            </StatusStep>

            {/* Step 3: Generate Items */}
            <StatusStep
              status={
                vendor.hasProducts
                  ? "complete"
                  : vendor.hasTemplates
                  ? "in-progress"
                  : "pending"
              }
              title={t("steps.items.title")}
              description={t("steps.items.description")}
            >
              {!vendor.hasProducts &&
                vendor.hasTemplates &&
                vendor.templates?.map((template) => (
                  <Button
                    key={template._id}
                    variant="outlined"
                    startIcon={<PlusCircle />}
                    href={`/templates/${template._id}/generate`}
                    sx={{ mr: 2, mb: 1 }}
                  >
                    {t("generateItems", { template: template.templateName })}
                  </Button>
                ))}
            </StatusStep>

            {/* Step 4: Stripe Connect */}
            <StatusStep
              status={
                isStripeComplete
                  ? "complete"
                  : vendor.hasProducts
                  ? "in-progress"
                  : "pending"
              }
              title={t("steps.stripe.title")}
              description={t("steps.stripe.description")}
            >
              {vendor.hasProducts && !isStripeComplete && (
                <Button
                  variant="contained"
                  onClick={() => setIsStripeModalOpen(true)}
                  sx={{
                    background: (theme) =>
                      theme.palette.customGradients.buttonMain,
                    "&:hover": {
                      background: (theme) =>
                        theme.palette.customGradients.buttonMain,
                      filter: "brightness(0.9)",
                    },
                  }}
                >
                  {t("connectStripe")}
                </Button>
              )}
            </StatusStep>

            {/* Step 5: Final Approval */}
            <StatusStep
              status={isStripeComplete ? "in-progress" : "pending"}
              title={t("steps.approval.title")}
              description={t("steps.approval.description")}
            >
              {isStripeComplete && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  {t("awaitingApproval")}
                </Alert>
              )}
            </StatusStep>
          </CardContent>
        </StyledCard>

        {vendor.vendorStatus === "ACTION_NEEDED" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>{t("actionNeeded")}</AlertTitle>
            <Typography variant="body2">{vendor.actionNeeded}</Typography>
          </Alert>
        )}
      </Container>

      <Modal
        open={isStripeModalOpen}
        onClose={handleModalClose}
        sx={{
          display: "block",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "800px",
            minHeight: "100%",
            mx: "auto",
            bgcolor: "background.paper",
            borderRadius: { xs: 0, sm: 2 },
            boxShadow: 24,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {vendor && (
            <StripeConnectOnboarding
              vendorId={vendor._id}
              onClose={handleModalClose}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default VendorStatusPage;
