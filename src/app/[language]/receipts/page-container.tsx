"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import ReceiptsPageContent from "./page-content";

export default function ReceiptsPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/sign-in');
      return;
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return null;
  }

  return <ReceiptsPageContent />;
}