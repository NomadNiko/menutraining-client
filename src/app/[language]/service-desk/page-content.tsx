"use client";
import dynamic from 'next/dynamic';

const ServiceDeskPageComponent = dynamic(
  () => import('@/components/service-desk/ServiceDeskPage'),
  { ssr: false }
);

export default function ServiceDeskPageContent() {
  return <ServiceDeskPageComponent />;
}