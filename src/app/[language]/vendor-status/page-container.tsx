"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import VendorStatusPage from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function VendorStatusPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && (!user || ![RoleEnum.ADMIN, RoleEnum.VENDOR, RoleEnum.PREVENDOR].includes(Number(user.role?.id)))) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return null;
  }

  return <VendorStatusPage />;
}