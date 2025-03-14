import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '@/services/i18n/client';
import { API_URL } from '@/services/api/config';
import { getTokensInfo } from '@/services/auth/auth-tokens-info';
import FormTextInput from '@/components/form/text-input/form-text-input';
import { SupportTicket, UpdateTicketDto, updateTicketSchema } from '../../types/support-ticket';

interface EditTicketFormProps {
  ticket: SupportTicket;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditTicketForm = ({ ticket, onSuccess, onCancel }: EditTicketFormProps) => {
  const { t } = useTranslation('support-tickets');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<UpdateTicketDto>({
    resolver: zodResolver(updateTicketSchema),
    defaultValues: {
      ticketCategory: ticket.ticketCategory,
      ticketTitle: ticket.ticketTitle,
      ticketDescription: ticket.ticketDescription
    }
  });

  const onSubmit = async (data: UpdateTicketDto) => {
    try {
      setIsSubmitting(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error('No auth token');
      }

      const response = await fetch(`${API_URL}/support-tickets/${ticket._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokensInfo.token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error updating ticket:', error);
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
              {t('editTicket.title')}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('fields.ticketId')}: {ticket.ticketId}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {t('fields.status')}: {ticket.status}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormTextInput
                name="ticketCategory"
                label={t('fields.category')}
              />

              <FormTextInput
                name="ticketTitle"
                label={t('fields.title')}
              />

              <FormTextInput
                name="ticketDescription"
                label={t('fields.description')}
              />
            </Box>
          </CardContent>

          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            {onCancel && (
              <Button
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t('actions.cancel')}
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {t('actions.save')}
            </Button>
          </CardActions>
        </form>
      </FormProvider>
    </Card>
  );
};

export default EditTicketForm;