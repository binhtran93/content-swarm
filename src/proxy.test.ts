import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { proxy } from "./proxy";

afterEach(() => {
  delete process.env.PUBLIC_DISABLED_PROJECTS;
  delete process.env.PUBLIC_PROJECT_ID;
  delete process.env.PUBLIC_ROUTE_MODE;
});

function request(pathname: string) {
  return new NextRequest(`https://example.com${pathname}`);
}

describe("public project route guard", () => {
  it.each([
    ["subiq", "/subiq"],
    ["subiq", "/subiq/blog/article"],
    ["subiq", "/subiq/sitemap.xml"],
    ["jlens", "/jlens/vi-VN/privacy"],
    ["skylens", "/skylens/en-US/terms"],
    ["urge-zero", "/urge-zero/de-DE/support"],
  ])("returns 404 when %s disables %s", (projectId, pathname) => {
    process.env.PUBLIC_ROUTE_MODE = "project";
    process.env.PUBLIC_DISABLED_PROJECTS = projectId;

    const response = proxy(request(pathname));

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it.each(["privacy", "support", "terms"])(
    "keeps the default SubIQ %s page available when SubIQ is disabled",
    (page) => {
      process.env.PUBLIC_ROUTE_MODE = "project";
      process.env.PUBLIC_DISABLED_PROJECTS = "subiq";

      const response = proxy(request(`/subiq/${page}`));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    },
  );

  it.each([
    ["jlens", "/jlens/privacy"],
    ["skylens", "/skylens/support"],
    ["urge-zero", "/urge-zero/terms"],
  ])("keeps required page %s available at %s", (projectId, pathname) => {
    process.env.PUBLIC_ROUTE_MODE = "project";
    process.env.PUBLIC_DISABLED_PROJECTS = projectId;

    expect(proxy(request(pathname)).status).toBe(200);
  });

  it.each([
    "/subiq/mascot-hi.webp",
    "/subiq/app-store.svg",
    "/subiq/favicon.png",
  ])("keeps required project asset %s available when disabled", (pathname) => {
    process.env.PUBLIC_ROUTE_MODE = "project";
    process.env.PUBLIC_DISABLED_PROJECTS = "subiq";

    expect(proxy(request(pathname)).status).toBe(200);
  });

  it("leaves SubIQ routes enabled in project mode by default", () => {
    process.env.PUBLIC_ROUTE_MODE = "project";

    const response = proxy(request("/subiq"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("blocks direct prefixed routes in dedicated root mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "subiq";

    expect(proxy(request("/subiq/blog/article")).status).toBe(404);
  });

  it("blocks JLens prefixed pages but permits its assets in JLens root mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "jlens";

    expect(proxy(request("/jlens/privacy")).status).toBe(404);
    expect(proxy(request("/jlens/ring.png")).status).toBe(200);
  });

  it.each([
    "/subiq/mascot-hi.webp",
    "/subiq/app-store.svg",
    "/subiq/font.woff2",
    "/subiq/robots.txt",
  ])("allows shared project asset %s in dedicated root mode", (pathname) => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "subiq";

    expect(proxy(request(pathname)).status).toBe(200);
  });

  it("still blocks the prefixed sitemap in dedicated root mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "subiq";

    expect(proxy(request("/subiq/sitemap.xml")).status).toBe(404);
  });

  it("blocks every prefixed project page in dedicated root mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "subiq";

    expect(proxy(request("/jlens/privacy")).status).toBe(404);
    expect(proxy(request("/skylens/privacy")).status).toBe(404);
  });

  it.each([
    ["jlens", "/support", "/jlens/support"],
    ["jlens", "/vi-VN/support", "/jlens/vi-VN/support"],
    ["jlens", "/blog/jewelry-care", "/jlens/blog/jewelry-care"],
    ["jlens", "/new-page", "/jlens/new-page"],
    ["jlens", "/sitemap.xml", "/jlens/sitemap.xml"],
    ["jlens", "/og.png", "/jlens/og.png"],
    ["subiq", "/blog/article", "/subiq/blog/article"],
    ["subiq", "/vi-VN/support", "/subiq/vi-VN/support"],
    ["urge-zero", "/vi-VN/support", "/urge-zero/vi-VN/support"],
    ["urge-zero", "/support", "/urge-zero/support"],
    ["urge-zero", "/privacy", "/urge-zero/privacy"],
    ["urge-zero", "/og.png", "/urge-zero/og.png"],
  ])("maps %s dedicated route %s to %s", (projectId, pathname, destination) => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = projectId;

    expect(proxy(request(pathname)).headers.get("x-middleware-rewrite")).toBe(
      `https://example.com${destination}`,
    );
  });

  it.each(["/", "/robots.txt", "/login", "/admin", "/api/auth/session"])(
    "preserves root-owned route %s",
    (pathname) => {
      process.env.PUBLIC_ROUTE_MODE = "root";
      process.env.PUBLIC_PROJECT_ID = "jlens";

      const response = proxy(request(pathname));

      expect(response.status).toBe(200);
      expect(response.headers.get("x-middleware-next")).toBe("1");
    },
  );

  it("fails closed for an unknown dedicated project", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "skylens";

    expect(() => proxy(request("/support"))).toThrow("Unknown public project");
  });

  it("never blocks unrelated routes", () => {
    process.env.PUBLIC_DISABLED_PROJECTS = "subiq";

    const response = proxy(request("/login"));

    expect(response.status).toBe(200);
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("does not treat a longer first segment as a registered project", () => {
    process.env.PUBLIC_DISABLED_PROJECTS = "subiq";

    expect(proxy(request("/subiquery")).status).toBe(200);
  });
});
