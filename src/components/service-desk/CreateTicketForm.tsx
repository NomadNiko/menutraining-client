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
import FormCategorySelect from "@/components/form/category-select/form-category-select";
import {
  CreateTicketDto,
  createTicketSchema,
  TicketCategory,
} from "../../types/support-ticket";
import useAuth from "@/services/auth/use-auth";

interface CreateTicketFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateTicketForm = ({
  onSuccess,
  onCancel,
}: CreateTicketFormProps) => {
  const { t } = useTranslation("support-tickets");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const methods = useForm<CreateTicketDto>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      ticketCategory: TicketCategory.TICKETS,
      ticketTitle: "",
      ticketDescription: "",
    },
  });

  const onSubmit = async (data: CreateTicketDto) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No auth token");
      }
      const response = await fetch(`${API_URL}/support-tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokensInfo.token}`,
        },
        body: JSON.stringify({
          ...data,
          createdBy: user?.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error creating ticket:", error);
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
              {t("createTicket.title")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "50%" }}>
                <FormCategorySelect
                  name="ticketCategory"
                  label={t("fields.category")}
                  testId="ticket-category"
                  size="small"
                  defaultValue={TicketCategory.TICKETS}
                />
              </Box>
              <FormTextInput name="ticketTitle" label={t("fields.title")} />
              <FormTextInput
                name="ticketDescription"
                label={t("fields.description")}
                multiline
                minRows={3}
              />
            </Box>
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
              {t("actions.submit")}
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default CreateTicketForm;
