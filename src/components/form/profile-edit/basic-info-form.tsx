import { useForm, FormProvider } from "react-hook-form";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import useAuth from "@/services/auth/use-auth";
import { useSnackbar } from "@/hooks/use-snackbar";
import FormAvatarInput from "@/components/form/avatar-input/form-avatar-input";
import { FileEntity } from "@/services/api/types/file-entity";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "./form-actions";

export type EditProfileBasicInfoFormData = {
  firstName: string;
  lastName: string;
  photo?: FileEntity;
};

const useValidationBasicInfoSchema = () => {
  const { t } = useTranslation("profile");

  return yup.object().shape({
    firstName: yup
      .string()
      .required(t("profile:inputs.firstName.validation.required")),
    lastName: yup
      .string()
      .required(t("profile:inputs.lastName.validation.required")),
  });
};

export function BasicInfoForm() {
  const { setUser } = useAuthActions();
  const { user } = useAuth();
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationBasicInfoSchema();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditProfileBasicInfoFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      photo: undefined,
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthPatchMe(formData);

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<keyof EditProfileBasicInfoFormData>
      ).forEach((key) => {
        setError(key, {
          type: "manual",
          message: t(
            `profile:inputs.${key}.validation.server.${data.errors[key]}`
          ),
        });
      });

      return;
    }

    if (status === HTTP_CODES_ENUM.OK) {
      setUser(data);

      enqueueSnackbar(t("profile:alerts.profile.success"), {
        variant: "success",
      });
    }
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      photo: user?.photo,
    });
  }, [user, reset]);

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3} mt={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t("profile:title1")}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormAvatarInput<EditProfileBasicInfoFormData>
                name="photo"
                testId="photo"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileBasicInfoFormData>
                name="firstName"
                label={t("profile:inputs.firstName.label")}
                testId="first-name"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileBasicInfoFormData>
                name="lastName"
                label={t("profile:inputs.lastName.label")}
                testId="last-name"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormActions
                submitLabel={t("profile:actions.submit")}
                cancelLabel={t("profile:actions.cancel")}
                testId="save-profile"
                cancelTestId="cancel-edit-profile"
                cancelHref="/profile"
              />
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}
