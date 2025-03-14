"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import VendorAdminPage from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function VendorAdminPageContainer() {
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

  // Check if user has admin role before rendering the page
  if (!user?.role || Number(user.role.id) !== RoleEnum.ADMIN) {
    return null;
  }

  return <VendorAdminPage />;
}