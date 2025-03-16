import React, { useEffect, useState } from "react";
import {
  useAllergiesQuery,
  useDeleteAllergyMutation,
} from "@/hooks/useAllergiesQuery";
import { Allergy } from "@/types/allergy";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-objects";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";

const AllergiesList: React.FC = () => {
  const { t } = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Queries and mutations
  const allergiesQuery = useAllergiesQuery();
  const deleteAllergyMutation = useDeleteAllergyMutation();

  // Process allergies data
  useEffect(() => {
    if (allergiesQuery.data) {
      const allAllergies = allergiesQuery.data.pages.flatMap(
        (page) => page.data
      );
      const uniqueAllergies = removeDuplicatesFromArrayObjects(
        allAllergies,
        "_id"
      );
      setAllergies(uniqueAllergies);
      setIsLoading(false);
    }
  }, [allergiesQuery.data]);

  // Load more data
  const handleLoadMore = () => {
    if (allergiesQuery.hasNextPage && !allergiesQuery.isFetchingNextPage) {
      allergiesQuery.fetchNextPage();
    }
  };

  // Handle allergy deletion
  const handleDelete = async (allergy: Allergy) => {
    const isConfirmed = await confirmDialog({
      title: t("common:confirm.delete.title"),
      message: t("common:confirm.deleteAllergy.message", {
        name: allergy.allergyName,
      }),
      successButtonText: t("common:actions.delete"),
      cancelButtonText: t("common:actions.cancel"),
    });
    if (isConfirmed) {
      // Use the string id field instead of _id
      deleteAllergyMutation.mutate(allergy.id, {
        onSuccess: () => {
          enqueueSnackbar(t("common:alerts.deleteSuccess"), {
            variant: "success",
          });
        },
        onError: (error) => {
          console.error("Delete error:", error);
          enqueueSnackbar(t("common:alerts.deleteError"), {
            variant: "error",
          });
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (allergies.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>{t("common:noAllergiesTitle")}</AlertTitle>
        {t("common:noAllergiesMessage")}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t("common:allergiesList.title")}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="allergies table">
          <TableHead>
            <TableRow>
              <TableCell width={80}>{t("common:allergiesList.logo")}</TableCell>
              <TableCell width={180} sx={{ wordWrap: "break-word" }}>
                {t("common:allergiesList.name")}
              </TableCell>
              <TableCell>{t("common:allergiesList.id")}</TableCell>
              <TableCell align="right">
                {t("common:allergiesList.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allergies.map((allergy) => (
              <TableRow key={allergy.id || allergy.allergyId}>
                <TableCell width={80}>
                  {allergy.allergyLogoUrl ? (
                    <Card sx={{ width: 70, height: 70 }}>
                      <CardMedia
                        component="img"
                        height="70"
                        image={allergy.allergyLogoUrl}
                        alt={allergy.allergyName}
                      />
                    </Card>
                  ) : (
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: "grey.200",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="caption">
                        {t("common:allergiesList.noImage")}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell width={120} sx={{ wordWrap: "break-word" }}>
                  <Typography noWrap={false}>{allergy.allergyName}</Typography>
                </TableCell>
                <TableCell>{allergy.allergyId}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="view" size="small" color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(allergy)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {allergiesQuery.hasNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={allergiesQuery.isFetchingNextPage}
          >
            {allergiesQuery.isFetchingNextPage
              ? t("common:actions.loading")
              : t("common:actions.loadMore")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AllergiesList;
