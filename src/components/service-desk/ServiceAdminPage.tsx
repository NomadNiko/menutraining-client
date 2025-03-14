import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import { useState, useEffect } from "react";
import { useTranslation } from "@/services/i18n/client";
import { API_URL } from "@/services/api/config";
import { getTokensInfo } from "@/services/auth/auth-tokens-info";
import { SupportTicket } from "@/types/support-ticket";

import ServiceAdminHeader from "./ServiceAdminHeader";
import ServiceAdminFilters from "./ServiceAdminFilters";
import ServiceAdminSortBar from "./ServiceAdminSortBar";
import ServiceAdminTicketList from "./ServiceAdminTicketList";
import EditTicketForm from "./EditTicketForm";
import UpdateTicketForm from "./UpdateTicketForm";

interface Filters {
  status: string;
  user: string;
  dateRange: string;
  searchTerm: string;
}

interface SortConfig {
  field: "createDate" | "lastUpdate" | "status";
  direction: "asc" | "desc";
}

export default function ServiceAdminPage() {
  const { t } = useTranslation("service-admin");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [showFullView, setShowFullView] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: "",
    user: "",
    dateRange: "",
    searchTerm: "",
  });
  const [sort, setSort] = useState<SortConfig>({
    field: "createDate",
    direction: "desc",
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      const tokensInfo = getTokensInfo();
      if (!tokensInfo?.token) {
        throw new Error("No auth token");
      }

      const queryParams = new URLSearchParams({
        ...(filters.status && { status: filters.status }),
        ...(filters.user && { userId: filters.user }),
        ...(filters.dateRange && { dateRange: filters.dateRange }),
        ...(filters.searchTerm && { search: filters.searchTerm }),
        sortField: sort.field,
        sortDirection: sort.direction,
        admin: "true",
      });

      const response = await fetch(
        `${API_URL}/support-tickets/admin/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${tokensInfo.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      setTickets(data.tickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [filters, sort]);

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSortChange = (field: SortConfig["field"]) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleTicketSelect = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowFullView(true);
  };

  const handleEditClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsEditDialogOpen(true);
  };

  const handleFullViewClose = () => {
    setShowFullView(false);
    setSelectedTicket(null);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedTicket(null);
  };

  if (loading && tickets.length === 0) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ServiceAdminHeader t={t} />

      <ServiceAdminFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={() =>
          setFilters({ status: "", user: "", dateRange: "", searchTerm: "" })
        }
        t={t}
      />

      <ServiceAdminSortBar sort={sort} onSortChange={handleSortChange} t={t} />

      <ServiceAdminTicketList
        tickets={tickets}
        onTicketSelect={handleTicketSelect}
        onEditClick={handleEditClick}
        onRefresh={loadTickets}
        t={t}
      />

      {/* Full View Dialog */}
      <Dialog
        open={showFullView}
        onClose={handleFullViewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {selectedTicket && (
            <Card>
              <CardContent>
                <UpdateTicketForm
                  ticket={selectedTicket}
                  onSuccess={() => {
                    loadTickets();
                    handleFullViewClose();
                  }}
                />
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {selectedTicket && (
            <EditTicketForm
              ticket={selectedTicket}
              onSuccess={() => {
                loadTickets();
                handleEditDialogClose();
              }}
              onCancel={handleEditDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
