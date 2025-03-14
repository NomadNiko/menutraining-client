import { Edit, ExternalLink, User } from "lucide-react";
import { SupportTicket } from "@/types/support-ticket";
import TicketUserInfo from "./TicketUserInfo";
import AssignUser from "./AssignUser";
import ChangeStatus from "./ChangeStatus";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

interface ServiceAdminTicketListProps {
  tickets: SupportTicket[];
  onTicketSelect: (ticket: SupportTicket) => void;
  onEditClick: (ticket: SupportTicket) => void;
  onRefresh: () => Promise<void>;
  t: (key: string) => string;
}

const ServiceAdminTicketList = ({
  tickets,
  onTicketSelect,
  onEditClick,
  onRefresh,
  t,
}: ServiceAdminTicketListProps) => {
  const getStatusColor = (
    status: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info" => {
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

  if (tickets.length === 0) {
    return (
      <Grid item xs={12}>
        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
          {t("noTickets")}
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {tickets.map((ticket) => (
        <Grid item xs={12} key={ticket._id}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">{ticket.ticketTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.ticketDescription}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label={ticket.ticketCategory}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={t(`status.${ticket.status.toLowerCase()}`)}
                    color={getStatusColor(ticket.status)}
                    size="small"
                  />
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", gap: 3, alignItems: "center", mb: 2 }}
              >
                <TicketUserInfo
                  userId={ticket.createdBy}
                  timestamp={new Date(ticket.createDate)}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <User size={16} />
                  {t("ticket")} #{ticket.ticketId}
                </Typography>
              </Box>

              {ticket.assignedTo && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t("assigned.to")}:
                  </Typography>
                  <TicketUserInfo
                    userId={ticket.assignedTo}
                    timestamp={new Date(ticket.createDate)}
                    showTimestamp={false}
                  />
                </Box>
              )}

              {ticket.updates.length > 0 && (
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {t("latestUpdate")}:
                  </Typography>
                  <Typography variant="body2">
                    {ticket.updates[ticket.updates.length - 1].updateText}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <TicketUserInfo
                      userId={ticket.updates[ticket.updates.length - 1].userId}
                      timestamp={
                        new Date(
                          ticket.updates[ticket.updates.length - 1].timestamp
                        )
                      }
                    />
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ExternalLink size={16} />}
                  onClick={() => onTicketSelect(ticket)}
                >
                  {t("actions.viewDetails")}
                </Button>

                <AssignUser
                  ticketId={ticket._id}
                  currentStatus={ticket.status}
                  onAssignSuccess={onRefresh}
                />

                <ChangeStatus
                  ticketId={ticket._id}
                  currentStatus={ticket.status}
                  onStatusChange={onRefresh}
                />

                <IconButton size="small" onClick={() => onEditClick(ticket)}>
                  <Edit size={20} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceAdminTicketList;
