"use client";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";
import useAuthActions from "@/services/auth/use-auth-actions";
import { useAuthPatchMeService } from "@/services/api/services/auth";
import { useForm, FormProvider } from 'react-hook-form';
import FormTextInput from '@/components/form/text-input/form-text-input';
import FormAvatarInput from '@/components/form/avatar-input/form-avatar-input';
import type { FileEntity } from '@/services/api/types/file-entity';
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";

type EditProfileFormData = {
  firstName: string;
  lastName: string;
  photo?: FileEntity;
};

interface ProfileEditFormProps {
  onCancel: () => void;
}

const ProfileEditForm = ({ onCancel }: ProfileEditFormProps) => {
  const { t } = useTranslation("profile");
  const { user } = useAuth();
  const { setUser } = useAuthActions();
  const fetchAuthPatchMe = useAuthPatchMeService();

  const methods = useForm<EditProfileFormData>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      photo: user?.photo,
    },
  });

  const onSubmit = async (formData: EditProfileFormData) => {
    const { data, status } = await fetchAuthPatchMe(formData);
    if (status === HTTP_CODES_ENUM.OK) {
      setUser(data);
      onCancel();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormAvatarInput name="photo" testId="photo" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormTextInput
              name="firstName"
              label={t("inputs.firstName.label")}
              testId="first-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormTextInput
              name="lastName"
              label={t("inputs.lastName.label")}
              testId="last-name"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 1 }}
            >
              {t("actions.save")}
            </Button>
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              {t("actions.cancel")}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default ProfileEditForm;
