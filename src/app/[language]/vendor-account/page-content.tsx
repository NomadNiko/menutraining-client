"use client";

import dynamic from 'next/dynamic';

const VendorAccountPageComponent = dynamic(
  () => import('@/components/vendor/vendor-account-page'),
  { ssr: false }
);

export default function VendorAccountPageContent() {
  return <VendorAccountPageComponent />;
}