"use client";
import dynamic from 'next/dynamic';

const VendorStatusPageComponent = dynamic(
  () => import('@/components/vendor/VendorStatusPage'),
  { ssr: false }
);

export default function VendorStatusPage() {
  return <VendorStatusPageComponent />;
}
