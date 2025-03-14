import { useForm, FormProvider } from "react-hook-form";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormTextInput from "@/components/form/text-input/form-text-input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "@/hooks/use-snackbar";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { useTranslation } from "@/services/i18n/client";
import { FormActions } from "./form-actions";

export type EditProfileChangePasswordFormData = {
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
};

const useValidationChangePasswordSchema = () => {
  const { t } = useTranslation("profile");

  return yup.object().shape({
    oldPassword: yup
      .string()
      .min(6, t("profile:inputs.password.validation.min"))
      .required(t("profile:inputs.password.validation.required")),
    password: yup
      .string()
      .min(6, t("profile:inputs.password.validation.min"))
      .required(t("profile:inputs.password.validation.required")),
    passwordConfirmation: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("profile:inputs.passwordConfirmation.validation.match")
      )
      .required(t("profile:inputs.passwordConfirmation.validation.required")),
  });
};

export function ChangePasswordForm() {
  const fetchAuthPatchMe = useAuthPatchMeService();
  const { t } = useTranslation("profile");
  const validationSchema = useValidationChangePasswordSchema();
  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<EditProfileChangePasswordFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { handleSubmit, setError, reset } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    const { data, status } = await fetchAuthPatchMe({
      password: formData.password,
      oldPassword: formData.oldPassword,
    });

    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      (
        Object.keys(data.errors) as Array<
          keyof EditProfileChangePasswordFormData
        >
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

      enqueueSnackbar(t("profile:alerts.password.success"), {
        variant: "success",
      });
    }
  });

  return (
    <FormProvider {...methods}>
      <Container maxWidth="xs">
        <form onSubmit={onSubmit}>
          <Grid container spacing={2} mb={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6">{t("profile:title3")}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileChangePasswordFormData>
                name="oldPassword"
                label={t("profile:inputs.oldPassword.label")}
                type="password"
                testId="old-password"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileChangePasswordFormData>
                name="password"
                label={t("profile:inputs.password.label")}
                type="password"
                testId="new-password"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormTextInput<EditProfileChangePasswordFormData>
                name="passwordConfirmation"
                label={t("profile:inputs.passwordConfirmation.label")}
                type="password"
                testId="password-confirmation"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormActions
                submitLabel={t("profile:actions.submit")}
                cancelLabel={t("profile:actions.cancel")}
                testId="save-password"
                cancelTestId="cancel-edit-password"
                cancelHref="/profile"
              />
            </Grid>
          </Grid>
        </form>
      </Container>
    </FormProvider>
  );
}
