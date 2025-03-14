"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import VendorAccountPageContent from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function VendorAccountPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && (!user?.role || Number(user.role.id) !== RoleEnum.VENDOR)) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  if (!user?.role || Number(user.role.id) !== RoleEnum.VENDOR) {
    return null;
  }

  return <VendorAccountPageContent />;
}