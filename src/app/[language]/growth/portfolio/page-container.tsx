"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from "@/services/auth/use-auth";
import PortfolioPageContent from "./page-content";

export default function PortfolioPageContainer() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  useEffect(() => {
    // Optionally restrict access if needed
    if (isLoaded && !user) {
      // router.replace('/sign-in');
      // return;
    }
  }, [user, isLoaded, router]);

  return <PortfolioPageContent />;
}