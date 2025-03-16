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
import { ApiError } from "@/services/api/types/api-error";

type IngredientOption = {
  ingredientId: string;
  ingredientName: string;
};

type CreateMenuItemFormData = {
  menuItemName: string;
  menuItemDescription: string;
  menuItemIngredients: IngredientOption[];
  menuItemUrl?: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("common");
  return yup.object().shape({
    menuItemName: yup.string().required(t("common:validation.required")),
    menuItemDescription: yup.string().required(t("common:validation.required")),
    menuItemIngredients: yup
      .array()
      .of(
        yup.object().shape({
          ingredientId: yup.string().required(),
          ingredientName: yup.string().required(),
        })
      )
      .min(1, t("common:validation.minOneIngredient"))
      .default([]),
  });
};

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
    resolver: yupResolver(validationSchema),
    defaultValues: {
      menuItemName: "",
      menuItemDescription: "",
      menuItemIngredients: [],
      menuItemUrl: undefined,
    },
  });

  const { handleSubmit, setValue, reset, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const apiData = {
      menuItemDescription: formData.menuItemDescription,
      menuItemName: formData.menuItemName,
      menuItemIngredients: formData.menuItemIngredients.map(
        (i) => i.ingredientId
      ),
      menuItemUrl: formData.menuItemUrl,
    };

    createMenuItemMutation.mutate(apiData, {
      onSuccess: (response) => {
        if (response.status === HTTP_CODES_ENUM.CREATED) {
          enqueueSnackbar(t("common:alerts.createSuccess"), {
            variant: "success",
          });
          reset();
        } else {
          enqueueSnackbar(t("common:alerts.error"), { variant: "error" });
        }
      },
      onError: (error: ApiError) => {
        if (error?.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            setError(key as keyof CreateMenuItemFormData, {
              type: "manual",
              message: value as string,
            });
          });
          enqueueSnackbar(t("common:alerts.validationError"), {
            variant: "error",
          });
        } else {
          enqueueSnackbar(t("common:alerts.createError"), { variant: "error" });
        }
      },
    });
  });

  const handleImageChange = (url: string) => {
    setValue("menuItemUrl", url);
  };

  const ingredientOptions = ingredients.map((ingredient) => ({
    ingredientId: ingredient.ingredientId,
    ingredientName: ingredient.ingredientName,
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
              name="menuItemName"
              label={t("common:menuItemForm.name")}
              testId="menu-item-name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateMenuItemFormData>
              name="menuItemDescription"
              label={t("common:menuItemForm.description")}
              testId="menu-item-description"
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
              renderValue={(values) =>
                values.map((value) => value.ingredientName).join(", ")
              }
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
