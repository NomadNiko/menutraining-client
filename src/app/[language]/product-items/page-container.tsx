"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import ProductItemsPageContent from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function ProductItemsPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace('/sign-in');
      } else if (
        Number(user.role?.id) !== RoleEnum.ADMIN && 
        Number(user.role?.id) !== RoleEnum.PREVENDOR && 
        Number(user.role?.id) !== RoleEnum.VENDOR
      ) {
        router.replace('/');
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return null;
  }

  if (!user || (
    Number(user.role?.id) !== RoleEnum.ADMIN && 
    Number(user.role?.id) !== RoleEnum.PREVENDOR && 
    Number(user.role?.id) !== RoleEnum.VENDOR
  )) {
    return null;
  }

  return <ProductItemsPageContent />;
}