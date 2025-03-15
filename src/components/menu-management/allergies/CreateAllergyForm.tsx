import React from "react";
import { useForm, FormProvider, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import { useCreateAllergyMutation } from "@/hooks/useAllergiesQuery";
import { useSnackbar } from "@/hooks/use-snackbar";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import ImageUpload from "../ImageUpload";

type CreateAllergyFormData = {
  allergyName: string;
  allergyLogoUrl?: string;
};

const useValidationSchema = () => {
  const { t } = useTranslation("common");
  return yup.object().shape({
    allergyName: yup.string().required(t("common:validation.required")),
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
      data-testid="create-allergy-submit"
    >
      {isSubmitting ? t("common:actions.creating") : t("common:actions.create")}
    </Button>
  );
}

const CreateAllergyForm: React.FC = () => {
  const { t } = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();
  const createAllergyMutation = useCreateAllergyMutation();
  const validationSchema = useValidationSchema();

  const methods = useForm<CreateAllergyFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      allergyName: "",
      allergyLogoUrl: undefined,
    },
  });

  const { handleSubmit, setValue, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    createAllergyMutation.mutate(formData, {
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
    setValue("allergyLogoUrl", url);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">
              {t("common:allergyForm.title")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateAllergyFormData>
              name="allergyName"
              label={t("common:allergyForm.name")}
              testId="allergy-name"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ImageUpload
              label={t("common:allergyForm.uploadLogo")}
              onImageUrlChange={handleImageChange}
              testId="allergy-logo-upload"
              error={methods.formState.errors.allergyLogoUrl?.message}
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

export default CreateAllergyForm;
