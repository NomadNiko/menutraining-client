import React, { useEffect, useState } from "react";
import {
  useIngredientsQuery,
  useDeleteIngredientMutation,
} from "@/hooks/useIngredientsQuery";
import { useAllergiesQuery } from "@/hooks/useAllergiesQuery";
import { Ingredient } from "@/types/ingredient";
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
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-objects";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

const IngredientsList: React.FC = () => {
  const { t } = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const theme = useTheme();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [allergies, setAllergies] = useState<Map<string, Allergy>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Queries and mutations
  const ingredientsQuery = useIngredientsQuery();
  const allergiesQuery = useAllergiesQuery();
  const deleteIngredientMutation = useDeleteIngredientMutation();

  // Process allergies data to create a lookup map
  useEffect(() => {
    if (allergiesQuery.data) {
      const allAllergies = allergiesQuery.data.pages.flatMap(
        (page) => page.data
      );
      const uniqueAllergies = removeDuplicatesFromArrayObjects(
        allAllergies,
        "_id"
      );
      const allergyMap = new Map<string, Allergy>();
      uniqueAllergies.forEach((allergy) => {
        allergyMap.set(allergy.allergyId, allergy);
      });
      setAllergies(allergyMap);
    }
  }, [allergiesQuery.data]);

  // Process ingredients data
  useEffect(() => {
    if (ingredientsQuery.data) {
      const allIngredients = ingredientsQuery.data.pages.flatMap(
        (page) => page.data
      );
      const uniqueIngredients = removeDuplicatesFromArrayObjects(
        allIngredients,
        "_id"
      );
      setIngredients(uniqueIngredients);
      setIsLoading(false);
    }
  }, [ingredientsQuery.data]);

  // Load more data when scrolling
  const handleLoadMore = () => {
    if (ingredientsQuery.hasNextPage && !ingredientsQuery.isFetchingNextPage) {
      ingredientsQuery.fetchNextPage();
    }
  };

  // Handle ingredient deletion
  const handleDelete = async (ingredient: Ingredient) => {
    const isConfirmed = await confirmDialog({
      title: t("common:confirm.delete.title"),
      message: t("common:confirm.deleteIngredient.message", {
        name: ingredient.ingredientName,
      }),
      successButtonText: t("common:actions.delete"),
      cancelButtonText: t("common:actions.cancel"),
    });

    if (isConfirmed) {
      // Use the string id field instead of _id
      deleteIngredientMutation.mutate(ingredient.id, {
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

  // Display allergies as chips
  const renderAllergies = (allergyIds: string[]) => {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: theme.spacing(0.5) }}>
        {allergyIds.map((id) => {
          const allergy = allergies.get(id);
          return allergy ? (
            <Chip
              key={id}
              label={allergy.allergyName}
              size="small"
              sx={{ marginRight: theme.spacing(0.5) }}
            />
          ) : null;
        })}
      </Box>
    );
  };

  // Find sub-ingredient names
  const getIngredientNames = (ids: string[]) => {
    return ids
      .map((id) => {
        const foundIngredient = ingredients.find(
          (ing) => ing.ingredientId === id
        );
        return foundIngredient ? foundIngredient.ingredientName : id;
      })
      .join(", ");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (ingredients.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>{t("common:noIngredientsTitle")}</AlertTitle>
        {t("common:noIngredientsMessage")}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t("common:ingredientsList.title")}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="ingredients table">
          <TableHead>
            <TableRow>
              <TableCell>{t("common:ingredientsList.id")}</TableCell>
              <TableCell>{t("common:ingredientsList.name")}</TableCell>
              <TableCell>{t("common:ingredientsList.allergies")}</TableCell>
              <TableCell>
                {t("common:ingredientsList.subIngredients")}
              </TableCell>
              <TableCell align="right">
                {t("common:ingredientsList.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id || ingredient.ingredientId}>
                <TableCell component="th" scope="row">
                  {ingredient.ingredientId}
                </TableCell>
                <TableCell>{ingredient.ingredientName}</TableCell>
                <TableCell>
                  {renderAllergies(ingredient.ingredientAllergies)}
                </TableCell>
                <TableCell>
                  {ingredient.subIngredients &&
                  ingredient.subIngredients.length > 0
                    ? getIngredientNames(ingredient.subIngredients)
                    : t("common:ingredientsList.none")}
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="view" size="small" color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(ingredient)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {ingredientsQuery.hasNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={ingredientsQuery.isFetchingNextPage}
          >
            {ingredientsQuery.isFetchingNextPage
              ? t("common:actions.loading")
              : t("common:actions.loadMore")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default IngredientsList;
