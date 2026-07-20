"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useSyncExternalStore } from "react";

const subscribeToClient = () => () => undefined;

export function isCanonicalAnalyticsHostname(
  canonicalOrigin: string,
  hostname: string,
): boolean {
  try {
    return (
      new URL(canonicalOrigin).hostname.toLowerCase() === hostname.toLowerCase()
    );
  } catch {
    return false;
  }
}

export function SiteAnalytics({
  enabled,
  canonicalOrigin,
  measurementId,
}: {
  enabled: boolean;
  canonicalOrigin: string;
  measurementId?: string;
}) {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const isCanonicalHostname =
    isClient &&
    isCanonicalAnalyticsHostname(canonicalOrigin, window.location.hostname);

  if (!enabled || !measurementId || !isCanonicalHostname) return null;
  return <GoogleAnalytics gaId={measurementId} />;
}
