import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getPublicRouteMode,
  isPublicProjectDisabled,
} from "@/public-site/config/public-url";
import { getPublicProjectIdFromPathname } from "@/public-site/config/public-projects";

const publicAssetPattern =
  /\.(?:avif|gif|ico|jpe?g|mp4|otf|png|svg|ttf|txt|webm|webp|woff2?)$/i;

export function proxy(request: NextRequest) {
  const projectId = getPublicProjectIdFromPathname(request.nextUrl.pathname);
  if (!projectId) return NextResponse.next();

  const prefixedRouteIsUnavailable = isPublicProjectDisabled(projectId);

  const isDedicatedProjectPagePrefix =
    getPublicRouteMode() === "root" &&
    process.env.PUBLIC_PROJECT_ID === projectId &&
    !publicAssetPattern.test(request.nextUrl.pathname);

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
