"use client";
import dynamic from 'next/dynamic';

const ServiceAdminPageComponent = dynamic(
  () => import('@/components/service-desk/ServiceAdminPage'),
  { ssr: false }
);

export default function ServiceAdminPageContent() {
  return <ServiceAdminPageComponent />;
}