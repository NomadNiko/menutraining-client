"use client";
import dynamic from 'next/dynamic';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { VendorOnboardingSection } from '@/components/dashboard/VendorOnboardingSection';

// Dynamically import components with loading states
const ProfileSection = dynamic(
  () => import('@/components/dashboard/ProfileSection').then(mod => mod.ProfileSection),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

const TicketsSection = dynamic(
  () => import('@/components/dashboard/TicketsSection').then(mod => mod.TicketsSection),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

const ReceiptsSection = dynamic(
  () => import('@/components/dashboard/ReceiptsSection').then(mod => mod.ReceiptsSection),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

const ServiceDeskPageComponent = dynamic(
  () => import('@/components/service-desk/ServiceDeskPage'),
  {
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    ),
    ssr: false
  }
);

export default function DashboardPageContent() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <ProfileSection />
      <TicketsSection />
      <ReceiptsSection />
      <ServiceDeskPageComponent />
      <VendorOnboardingSection />
    </Container>
  );
}