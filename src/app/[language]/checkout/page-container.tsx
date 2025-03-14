"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import CheckoutPageContent from "./page-content";

export default function CheckoutPageContainer() {
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

  return <CheckoutPageContent />;
}