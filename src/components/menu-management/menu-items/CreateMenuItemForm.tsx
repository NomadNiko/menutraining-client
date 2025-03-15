import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import { useCreateMenuItemMutation } from "@/hooks/useMenuItemsQuery";
import { useIngredientsQuery } from "@/hooks/useIngredientsQuery";
import { useSnackbar } from "@/hooks/use-snackbar";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import ImageUpload from "../ImageUpload";
import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import { Ingredient } from "@/types/ingredient";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-objects";

// Create a type alias that matches the structure expected by the form
type IngredientOption = {
  ingredientId: string;
  ingredientName: string;
  _id: string;
};

type CreateMenuItemFormData = {
  menuItemDescription?: string;
  menuItemIngredients: string[]; // Store just the ingredientId strings
  menuItemUrl?: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("common");
  return yup.object().shape({
    menuItemDescription: yup.string(),
    menuItemIngredients: yup
      .array()
      .of(yup.string().defined())
      .min(1, t("common:validation.minOneIngredient"))
      .default([]), // ensure no undefined values
  });
};

// Create a separate component for form actions to use useFormState
function FormActions() {
  const { t } = useTranslation("common");
  const { isSubmitting } = useFormState();
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      disabled={isSubmitting}
      data-testid="create-menu-item-submit"
    >
      {isSubmitting ? t("common:actions.creating") : t("common:actions.create")}
    </Button>
  );
}

const CreateMenuItemForm: React.FC = () => {
  const { t } = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();
  const createMenuItemMutation = useCreateMenuItemMutation();
  const ingredientsQuery = useIngredientsQuery();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (ingredientsQuery.data) {
      const allIngredients = ingredientsQuery.data.pages.flatMap(
        (page) => page.data
      );
      setIngredients(removeDuplicatesFromArrayObjects(allIngredients, "_id"));
    }
  }, [ingredientsQuery.data]);

  const validationSchema = useValidationSchema();
  const methods = useForm<CreateMenuItemFormData>({
    resolver: yupResolver(validationSchema) as ReturnType<
      typeof yupResolver<CreateMenuItemFormData>
    >,
    defaultValues: {
      menuItemDescription: "",
      menuItemIngredients: [] as string[],
      menuItemUrl: undefined,
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    // We're already providing the ingredients as an array of strings
    const apiData = {
      menuItemDescription: formData.menuItemDescription,
      menuItemIngredients: formData.menuItemIngredients,
      menuItemUrl: formData.menuItemUrl,
    };

    createMenuItemMutation.mutate(apiData, {
      onSuccess: (response) => {
        if (response.status === HTTP_CODES_ENUM.CREATED) {
          enqueueSnackbar(t("common:alerts.createSuccess"), {
            variant: "success",
          });
          reset();
        }
      },
      onError: () => {
        enqueueSnackbar(t("common:alerts.createError"), { variant: "error" });
      },
    });
  });

  const handleImageChange = (url: string) => {
    setValue("menuItemUrl", url);
  };

  // Map ingredients to the correct structure for the select input
  const ingredientOptions = ingredients.map((ingredient) => ({
    _id: ingredient._id,
    ingredientName: ingredient.ingredientName,
    ingredientId: ingredient.ingredientId,
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">
              {t("common:menuItemForm.title")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateMenuItemFormData>
              name="menuItemDescription"
              label={t("common:menuItemForm.description")}
              testId="menu-item-description"
              multiline
              minRows={3}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormMultipleSelectInput<CreateMenuItemFormData, IngredientOption>
              name="menuItemIngredients"
              testId="menu-item-ingredients"
              label={t("common:menuItemForm.ingredients")}
              options={ingredientOptions}
              keyValue="ingredientId"
              renderOption={(option) => option.ingredientName}
              renderValue={(values) => {
                // Convert stringId array to display names
                return values
                  .map((stringId) => {
                    // Find the option with matching ingredientId
                    const found = ingredientOptions.find(
                      (i) => String(i.ingredientId) === String(stringId)
                    );
                    return found ? found.ingredientName : stringId;
                  })
                  .join(", ");
              }}
            />
            {methods.formState.errors.menuItemIngredients && (
              <Typography color="error" variant="caption">
                {methods.formState.errors.menuItemIngredients.message}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ImageUpload
              label={t("common:menuItemForm.uploadImage")}
              onImageUrlChange={handleImageChange}
              testId="menu-item-image-upload"
              error={methods.formState.errors.menuItemUrl?.message}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormActions />
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default CreateMenuItemForm;
