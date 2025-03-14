"use client";
import withPageRequiredAuth from "@/services/auth/with-page-required-auth";
import useAuth from "@/services/auth/use-auth";
import { UserProviderEnum } from "@/services/api/types/user";
import { BasicInfoForm } from "@/components/form/profile-edit/basic-info-form";
import { ChangeEmailForm } from "@/components/form/profile-edit/change-email-form";
import { ChangePasswordForm } from "@/components/form/profile-edit/change-password-form";

function FormChangeEmailWrapper() {
  const { user } = useAuth();
  return user?.provider === UserProviderEnum.EMAIL ? <ChangeEmailForm /> : null;
}

function FormChangePasswordWrapper() {
  const { user } = useAuth();
  return user?.provider === UserProviderEnum.EMAIL ? (
    <ChangePasswordForm />
  ) : null;
}

function EditProfile() {
  return (
    <>
      <BasicInfoForm />
      <FormChangeEmailWrapper />
      <FormChangePasswordWrapper />
    </>
  );
}

export default withPageRequiredAuth(EditProfile);
