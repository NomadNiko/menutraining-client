// ./ixplor-app/src/components/service-desk/TicketDetailView.tsx
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { MessageCircle, CheckCircle } from "lucide-react";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { SupportTicket, TicketStatus } from "../../types/support-ticket";
import TicketUserInfo from "./TicketUserInfo";
import UpdateTicketForm from "./UpdateTicketForm";

interface TicketDetailViewProps {
  ticket: SupportTicket;
  onSuccess: () => void;
  onClose: () => void;
}

export const TicketDetailView = ({
  ticket,
  onSuccess,
  onClose,
}: TicketDetailViewProps) => {
  const { t } = useTranslation("service-desk");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [localTicket, setLocalTicket] = useState<SupportTicket>(ticket);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update local ticket when prop changes (like after a refresh)
  useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPENED":
        return "warning";
      case "ASSIGNED":
        return "info";
      case "HOLD":
        return "secondary";
      case "RESOLVED":
        return "success";
      case "CLOSED":
        return "default";
      default:
        return "default";
    }
  };

  const fetchUpdatedTicket = async () => {
    try {
      setIsRefreshing(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No auth token");
      }

      const response = await fetch(`${API_URL}/support-tickets/${ticket._id}`, {
        headers: {
          Authorization: `Bearer ${tokensInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch updated ticket");
      }

      const data = await response.json();
      if (data && data.ticket) {
        setLocalTicket(data.ticket);
      }

      return data.ticket;
    } catch (error) {
      console.error("Error fetching updated ticket:", error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResolve = async () => {
    try {
      setIsResolving(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No auth token");
      }

      const response = await fetch(
        `${API_URL}/support-tickets/${ticket._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokensInfo.token}`,
          },
          body: JSON.stringify({ status: TicketStatus.RESOLVED }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve ticket");
      }

      // Update local ticket state to reflect the status change
      setLocalTicket({
        ...localTicket,
        status: TicketStatus.RESOLVED,
      });

      // Notify parent component to refresh ticket list
      onSuccess();
    } catch (error) {
      console.error("Error resolving ticket:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleAddUpdateSuccess = async () => {
    setIsUpdateDialogOpen(false);

    // First notify parent component to refresh the main ticket list
    onSuccess();

    // Then refresh the local ticket data
    try {
      const updatedTicket = await fetchUpdatedTicket();

      // If we couldn't get updated ticket data, force a refresh using the parent's data
      if (!updatedTicket) {
        // Just close the detail view, as the main list should be refreshed already
        onClose();
      }
    } catch (error) {
      console.error("Error handling update success:", error);
    }
  };

  // Sort updates by timestamp in descending order (newest first)
  const sortedUpdates = [...(localTicket.updates || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                {localTicket.ticketTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {localTicket.ticketCategory}
              </Typography>
            </Box>
            <Chip
              label={t(`status.${localTicket.status.toLowerCase()}`)}
              color={getStatusColor(localTicket.status)}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              {localTicket.ticketDescription}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <TicketUserInfo
              userId={localTicket.createdBy}
              timestamp={new Date(localTicket.createDate)}
            />
            <Typography variant="caption" color="text.secondary">
              {t("ticket")} #{localTicket.ticketId}
            </Typography>
          </Box>

          {localTicket.assignedTo && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2">{t("assigned.to")}:</Typography>
              <TicketUserInfo
                userId={localTicket.assignedTo}
                timestamp={new Date(localTicket.createDate)}
                showTimestamp={false}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">{t("updates")}</Typography>

            {isRefreshing && (
              <Typography variant="caption" color="text.secondary">
                {t("refreshing")}...
              </Typography>
            )}
          </Box>

          {sortedUpdates.length === 0 ? (
            <Typography color="text.secondary" sx={{ my: 2 }}>
              {t("noUpdates")}
            </Typography>
          ) : (
            <Box sx={{ mt: 2 }}>
              {sortedUpdates.map((update, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    backgroundColor: "background.paper",
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {update.updateText}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <TicketUserInfo
                        userId={update.userId}
                        timestamp={new Date(update.timestamp)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={onClose}>
              {t("actions.close")}
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              {localTicket.status !== TicketStatus.CLOSED &&
                localTicket.status !== TicketStatus.RESOLVED && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleResolve}
                    disabled={isResolving}
                  >
                    {t("actions.resolve")}
                  </Button>
                )}
              {localTicket.status !== TicketStatus.CLOSED && (
                <Button
                  variant="contained"
                  startIcon={<MessageCircle />}
                  onClick={() => setIsUpdateDialogOpen(true)}
                >
                  {t("actions.addUpdate")}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <UpdateTicketForm
            ticket={localTicket}
            onSuccess={handleAddUpdateSuccess}
            onCancel={() => setIsUpdateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TicketDetailView;
