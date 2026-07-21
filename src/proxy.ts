import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getDedicatedPublicProjectId,
  getPublicRouteMode,
  isPublicProjectDisabled,
} from "@/public-site/config/public-url";
import { getPublicProjectIdFromPathname } from "@/public-site/config/public-projects";

const publicAssetPattern =
  /\.(?:avif|gif|ico|jpe?g|mp4|otf|png|svg|ttf|txt|webm|webp|woff2?)$/i;

function isRootOwnedRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/robots.txt" ||
    pathname === "/login" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/")
  );
}

export function proxy(request: NextRequest) {
  const routeMode = getPublicRouteMode();
  const dedicatedProjectId =
    routeMode === "root" ? getDedicatedPublicProjectId() : undefined;
  const pathname = request.nextUrl.pathname;
  const projectId = getPublicProjectIdFromPathname(pathname);

  if (!projectId) {
    if (!dedicatedProjectId || isRootOwnedRoute(pathname)) {
      return NextResponse.next();
    }

    const destination = request.nextUrl.clone();
    destination.pathname = `/${dedicatedProjectId}${pathname}`;
    return NextResponse.rewrite(destination);
  }

  const prefixedRouteIsUnavailable = isPublicProjectDisabled(projectId);

  const isDedicatedProjectPagePrefix =
    routeMode === "root" && !publicAssetPattern.test(pathname);

  if (!prefixedRouteIsUnavailable && !isDedicatedProjectPagePrefix) {
    return NextResponse.next();
  }

  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
