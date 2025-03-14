"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { useTranslation } from "@/services/i18n/client";
import useAuth from "@/services/auth/use-auth";
import { DashboardSection } from './common';

// Dynamically import the edit form component
const ProfileEditForm = dynamic(
  () => import('./ProfileEditForm'),
  { 
    loading: () => <div>Loading...</div>,
    ssr: false
  }
);

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
}));

export const ProfileSection = () => {
  const { t } = useTranslation("profile");
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <DashboardSection>
      {!isEditing ? (
        <Grid container spacing={3} wrap="nowrap">
          <Grid item>
            <StyledAvatar
              alt={user?.firstName + " " + user?.lastName}
              data-testid="user-icon"
              src={user?.photo?.path}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom data-testid="user-name">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="h6" gutterBottom data-testid="user-email">
              {user?.email}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              data-testid="edit-profile"
            >
              {t("actions.edit")}
            </Button>
          </Grid>
        </Grid>
      ) : (
        <ProfileEditForm onCancel={() => setIsEditing(false)} />
      )}
    </DashboardSection>
  );
};
