import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import {
  useCreateIngredientMutation,
  useIngredientsQuery,
} from "@/hooks/useIngredientsQuery";
import { useAllergiesQuery } from "@/hooks/useAllergiesQuery";
import { useSnackbar } from "@/hooks/use-snackbar";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import ImageUpload from "../ImageUpload";
import FormMultipleSelectInput from "@/components/form/multiple-select/form-multiple-select";
import { Allergy } from "@/types/allergy";
import { Ingredient } from "@/types/ingredient";
import removeDuplicatesFromArrayObjects from "@/services/helpers/remove-duplicates-from-array-objects";
import { ApiError } from "@/services/api/types/api-error";

type AllergyOption = {
  allergyId: string;
  allergyName: string;
};

type IngredientOption = {
  ingredientId: string;
  ingredientName: string;
};

type CreateIngredientFormData = {
  ingredientName: string;
  ingredientAllergies: AllergyOption[];
  ingredientImageUrl?: string;
  subIngredients: IngredientOption[];
};

const useValidationSchema = () => {
  const { t } = useTranslation("common");
  return yup.object().shape({
    ingredientName: yup.string().required(t("common:validation.required")),
    ingredientAllergies: yup
      .array()
      .of(
        yup.object().shape({
          allergyId: yup.string().required(),
          allergyName: yup.string().required(),
        })
      )
      .default([]),
    subIngredients: yup
      .array()
      .of(
        yup.object().shape({
          ingredientId: yup.string().required(),
          ingredientName: yup.string().required(),
        })
      )
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
      data-testid="create-ingredient-submit"
    >
      {isSubmitting ? t("common:actions.creating") : t("common:actions.create")}
    </Button>
  );
}

const CreateIngredientForm: React.FC = () => {
  const { t } = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();
  const createIngredientMutation = useCreateIngredientMutation();
  const allergiesQuery = useAllergiesQuery();
  const ingredientsQuery = useIngredientsQuery();
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (allergiesQuery.data) {
      const allAllergies = allergiesQuery.data.pages.flatMap(
        (page) => page.data
      );
      setAllergies(removeDuplicatesFromArrayObjects(allAllergies, "_id"));
    }
  }, [allergiesQuery.data]);

  useEffect(() => {
    if (ingredientsQuery.data) {
      const allIngredients = ingredientsQuery.data.pages.flatMap(
        (page) => page.data
      );
      setIngredients(removeDuplicatesFromArrayObjects(allIngredients, "_id"));
    }
  }, [ingredientsQuery.data]);

  const validationSchema = useValidationSchema();
  const methods = useForm<CreateIngredientFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ingredientName: "",
      ingredientAllergies: [],
      ingredientImageUrl: undefined,
      subIngredients: [],
    },
  });

  const { handleSubmit, setValue, reset, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const apiData = {
      ingredientName: formData.ingredientName,
      ingredientAllergies: formData.ingredientAllergies.map((a) => a.allergyId),
      ingredientImageUrl: formData.ingredientImageUrl,
      subIngredients: formData.subIngredients.map((i) => i.ingredientId),
    };

    createIngredientMutation.mutate(apiData, {
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
            setError(key as keyof CreateIngredientFormData, {
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
    setValue("ingredientImageUrl", url);
  };

  const allergyOptions = allergies.map((allergy) => ({
    allergyId: allergy.allergyId,
    allergyName: allergy.allergyName,
  }));

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
              {t("common:ingredientForm.title")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateIngredientFormData>
              name="ingredientName"
              label={t("common:ingredientForm.name")}
              testId="ingredient-name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormMultipleSelectInput<CreateIngredientFormData, AllergyOption>
              name="ingredientAllergies"
              testId="ingredient-allergies"
              label={t("common:ingredientForm.allergies")}
              options={allergyOptions}
              keyValue="allergyId"
              renderOption={(option) => option.allergyName}
              renderValue={(values) =>
                values.map((value) => value.allergyName).join(", ")
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormMultipleSelectInput<CreateIngredientFormData, IngredientOption>
              name="subIngredients"
              testId="ingredient-sub-ingredients"
              label={t("common:ingredientForm.subIngredients")}
              options={ingredientOptions}
              keyValue="ingredientId"
              renderOption={(option) => option.ingredientName}
              renderValue={(values) =>
                values.map((value) => value.ingredientName).join(", ")
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ImageUpload
              label={t("common:ingredientForm.uploadImage")}
              onImageUrlChange={handleImageChange}
              testId="ingredient-image-upload"
              error={methods.formState.errors.ingredientImageUrl?.message}
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

export default CreateIngredientForm;
