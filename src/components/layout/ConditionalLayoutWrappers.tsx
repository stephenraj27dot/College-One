"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { FloatingContactWidget } from "./FloatingContactWidget";

export function ConditionalLayoutWrappers() {
  const pathname = usePathname();

  // Do not render Footer and Floating Widget on the admin dashboard
  if (pathname?.startsWith("/cg-secure-admin-desk")) {
    return null;
  }

  return (
    <>
      <FloatingContactWidget />
      <Footer />
    </>
  );
}
