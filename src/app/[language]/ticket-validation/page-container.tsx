"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import VendorTicketValidation from './page-content';
import { RoleEnum } from "@/services/api/types/role";

export default function VendorTicketValidationContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && (!user?.role || Number(user.role.id) !== RoleEnum.VENDOR)) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user?.role || Number(user.role.id) !== RoleEnum.VENDOR) {
    return null;
  }

  return <VendorTicketValidation />;
}