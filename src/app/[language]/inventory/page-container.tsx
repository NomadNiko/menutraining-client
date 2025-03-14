"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import InventoryPageContent from "./page-content";
import { RoleEnum } from "@/services/api/types/role";

export default function InventoryPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace('/sign-in');
        setAuthorized(false);
      } else if (Number(user.role?.id) !== RoleEnum.VENDOR) {
        router.replace('/');
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || authorized === null) {
    return null;
  }

  if (!authorized) {
    return null;
  }

  return <InventoryPageContent />;
}
