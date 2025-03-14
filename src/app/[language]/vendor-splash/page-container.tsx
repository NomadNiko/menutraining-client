"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import VendorSplashPageContent from "./page-content";

export default function VendorSplashPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace('/sign-in');
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return null;
  }

  return <VendorSplashPageContent />;
}