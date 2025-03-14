import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import FormTextInput from "@/components/form/text-input/form-text-input";
import {
  SupportTicket,
  AddTicketUpdateDto,
  ticketUpdateSchema,
} from "../../types/support-ticket";
import useAuth from "@/services/auth/use-auth";

interface UpdateTicketFormProps {
  ticket: SupportTicket;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UpdateTicketForm = ({
  ticket,
  onSuccess,
  onCancel,
}: UpdateTicketFormProps) => {
  const { t } = useTranslation("support-tickets");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const methods = useForm<AddTicketUpdateDto>({
    resolver: zodResolver(ticketUpdateSchema),
    defaultValues: {
      updateText: "",
    },
  });

  const onSubmit = async (data: AddTicketUpdateDto) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No auth token");
      }

      const response = await fetch(
        `${API_URL}/support-tickets/${ticket._id}/updates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokensInfo.token}`,
          },
          body: JSON.stringify({
            ...data,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update ticket");
      }

      methods.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("updateTicket.title")}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t("fields.ticketId")}: {ticket.ticketId}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {t("fields.status")}: {ticket.status}
              </Typography>
            </Box>
            <FormTextInput
              name="updateText"
              label={t("fields.updateText")}
              multiline
              minRows={3}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
            {onCancel && (
              <Button onClick={onCancel} disabled={isSubmitting}>
                {t("actions.cancel")}
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {t("actions.addUpdate")}
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default UpdateTicketForm;
