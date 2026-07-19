"use client";

import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

export function ThemedTopLoader({
  dedicatedSubiq,
}: {
  dedicatedSubiq: boolean;
}) {
  const pathname = usePathname();
  const isSubiq =
    dedicatedSubiq || pathname === "/subiq" || pathname.startsWith("/subiq/");
  const color = isSubiq ? "#2e7d32" : "#167bff";

  return (
    <NextTopLoader
      color={color}
      height={3}
      shadow={`0 0 8px ${color}73`}
      showSpinner={false}
      zIndex={9999}
    />
  );
}
