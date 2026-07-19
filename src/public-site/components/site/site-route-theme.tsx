"use client";

import { useLayoutEffect } from "react";

const ROUTE_PROGRESS_PROPERTY = "--route-progress-color";

export function SiteRouteTheme({ progressColor }: { progressColor: string }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue(ROUTE_PROGRESS_PROPERTY);
    root.style.setProperty(ROUTE_PROGRESS_PROPERTY, progressColor);

    return () => {
      if (
        root.style.getPropertyValue(ROUTE_PROGRESS_PROPERTY) !== progressColor
      )
        return;
      if (previous) root.style.setProperty(ROUTE_PROGRESS_PROPERTY, previous);
      else root.style.removeProperty(ROUTE_PROGRESS_PROPERTY);
    };
  }, [progressColor]);

  return null;
}
