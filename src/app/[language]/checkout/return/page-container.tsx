"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import CheckoutReturnPageContent from "./page-content";

export default function CheckoutReturnPageContainer() {
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

  return <CheckoutReturnPageContent />;
}
