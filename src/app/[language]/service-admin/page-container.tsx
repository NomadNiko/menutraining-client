"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import ServiceAdminPageContent from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function ServiceAdminPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && (!user?.role || Number(user.role.id) !== RoleEnum.ADMIN)) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  if (!user?.role || Number(user.role.id) !== RoleEnum.ADMIN) {
    return null;
  }

  return <ServiceAdminPageContent />;
}