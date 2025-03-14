import { useForm, FormProvider } from "react-hook-form";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "@/services/auth/use-auth";
import { useSnackbar } from "@/hooks/use-snackbar";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "./form-actions";

export type EditProfileChangeEmailFormData = {
  email: string;
  emailConfirmation: string;
};

const useValidationChangeEmailSchema = () => {
  const { t } = useTranslation("profile");
  const { user } = useAuth();

  return yup.object().shape({
    email: yup
      .string()
      .notOneOf(
        [user?.email],
        t("profile:inputs.email.validation.currentEmail")
      )
      .email(t("profile:inputs.email.validation.email"))
      .required(t("profile:inputs.email.validation.required")),
    emailConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("email")],
        t("profile:inputs.emailConfirmation.validation.match")
      )
      .required(t("profile:inputs.emailConfirmation.validation.required")),
  });
};

export function ChangeEmailForm() {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationChangeEmailSchema();
  const { user } = useAuth();

  const methods = useForm<EditProfileChangeEmailFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      emailConfirmation: "",
    },
  });

  const { handleSubmit, reset, setError } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthPatchMe({
      email: formData.email,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<keyof EditProfileChangeEmailFormData>
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
      reset();

      enqueueSnackbar(t("profile:alerts.email.success"), {
        variant: "success",
        autoHideDuration: 15000,
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t("profile:title2")}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1">{user?.email}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileChangeEmailFormData>
                name="email"
                label={t("profile:inputs.email.label")}
                type="email"
                testId="email"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileChangeEmailFormData>
                name="emailConfirmation"
                label={t("profile:inputs.emailConfirmation.label")}
                type="email"
                testId="email-confirmation"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormActions
                submitLabel={t("profile:actions.submit")}
                cancelLabel={t("profile:actions.cancel")}
                testId="save-email"
                cancelTestId="cancel-edit-email"
                cancelHref="/profile"
              />
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}
