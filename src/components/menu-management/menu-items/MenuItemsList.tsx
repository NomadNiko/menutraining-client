import React, { useEffect, useState } from "react";
import {
  useMenuItemsQuery,
  useDeleteMenuItemMutation,
} from "@/hooks/useMenuItemsQuery";
import { useIngredientsQuery } from "@/hooks/useIngredientsQuery";
import { MenuItem } from "@/types/menu-item";
import { Ingredient } from "@/types/ingredient";
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
import { useTranslation } from "@/services/i18n/client";
import { useSnackbar } from "@/hooks/use-snackbar";
import useConfirmDialog from "@/components/confirm-dialog/use-confirm-dialog";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-objects";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

const MenuItemsList: React.FC = () => {
  const { t } = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const theme = useTheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Map<string, Ingredient>>(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(true);

  // Queries and mutations
  const menuItemsQuery = useMenuItemsQuery();
  const ingredientsQuery = useIngredientsQuery();
  const deleteMenuItemMutation = useDeleteMenuItemMutation();

  // Process ingredients data to create a lookup map
  useEffect(() => {
    if (ingredientsQuery.data) {
      const allIngredients = ingredientsQuery.data.pages.flatMap(
        (page) => page.data
      );
      const uniqueIngredients = removeDuplicatesFromArrayObjects(
        allIngredients,
        "_id"
      );
      const ingredientMap = new Map<string, Ingredient>();
      uniqueIngredients.forEach((ingredient) => {
        ingredientMap.set(ingredient.ingredientId, ingredient);
      });
      setIngredients(ingredientMap);
    }
  }, [ingredientsQuery.data]);

  // Process menu items data
  useEffect(() => {
    if (menuItemsQuery.data) {
      const allMenuItems = menuItemsQuery.data.pages.flatMap(
        (page) => page.data
      );
      const uniqueMenuItems = removeDuplicatesFromArrayObjects(
        allMenuItems,
        "_id"
      );
      setMenuItems(uniqueMenuItems);
      setIsLoading(false);
    }
  }, [menuItemsQuery.data]);

  // Load more data
  const handleLoadMore = () => {
    if (menuItemsQuery.hasNextPage && !menuItemsQuery.isFetchingNextPage) {
      menuItemsQuery.fetchNextPage();
    }
  };

  // Handle menu item deletion
  const handleDelete = async (menuItem: MenuItem) => {
    const isConfirmed = await confirmDialog({
      title: t("common:confirm.delete.title"),
      message: t("common:confirm.deleteMenuItem.message", {
        name: menuItem.menuItemName || t("common:menuItemsList.unnamedItem"),
      }),
      successButtonText: t("common:actions.delete"),
      cancelButtonText: t("common:actions.cancel"),
    });
    if (isConfirmed) {
      // Use the string id field instead of _id
      deleteMenuItemMutation.mutate(menuItem.id, {
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

  // Render ingredients as chips
  const renderIngredients = (ingredientIds: string[]) => {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: theme.spacing(0.5) }}>
        {ingredientIds.map((id) => {
          const ingredient = ingredients.get(id);
          return ingredient ? (
            <Chip
              key={id}
              label={ingredient.ingredientName}
              size="small"
              sx={{ marginRight: theme.spacing(0.5) }}
            />
          ) : null;
        })}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (menuItems.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>{t("common:noMenuItemsTitle")}</AlertTitle>
        {t("common:noMenuItemsMessage")}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t("common:menuItemsList.title")}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="menu items table">
          <TableHead>
            <TableRow>
              <TableCell width={80}>
                {t("common:menuItemsList.image")}
              </TableCell>
              <TableCell width={120} sx={{ wordWrap: "break-word" }}>
                {t("common:menuItemsList.name")}
              </TableCell>
              <TableCell>{t("common:menuItemsList.description")}</TableCell>
              <TableCell>{t("common:menuItemsList.ingredients")}</TableCell>
              <TableCell>{t("common:menuItemsList.id")}</TableCell>
              <TableCell align="right">
                {t("common:menuItemsList.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((menuItem) => (
              <TableRow key={menuItem.id || menuItem.menuItemId}>
                <TableCell width={80}>
                  {menuItem.menuItemUrl ? (
                    <Card sx={{ width: 70, height: 70 }}>
                      <CardMedia
                        component="img"
                        height="70"
                        image={menuItem.menuItemUrl}
                        alt={menuItem.menuItemDescription || "Menu item"}
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
                        {t("common:menuItemsList.noImage")}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell width={180} sx={{ wordWrap: "break-word" }}>
                  <Typography noWrap={false}>
                    {menuItem.menuItemName}
                  </Typography>
                </TableCell>
                <TableCell>
                  {menuItem.menuItemDescription ||
                    t("common:menuItemsList.noDescription")}
                </TableCell>
                <TableCell>
                  {renderIngredients(menuItem.menuItemIngredients)}
                </TableCell>
                <TableCell>{menuItem.menuItemId}</TableCell>
                <TableCell align="right">
                  <IconButton aria-label="view" size="small" color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(menuItem)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {menuItemsQuery.hasNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={menuItemsQuery.isFetchingNextPage}
          >
            {menuItemsQuery.isFetchingNextPage
              ? t("common:actions.loading")
              : t("common:actions.loadMore")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MenuItemsList;
