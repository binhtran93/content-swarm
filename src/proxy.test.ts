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
    ["subiq", "/subiq/mascot-hi.webp"],
    ["jlens", "/jlens/privacy"],
    ["skylens", "/skylens/terms"],
    ["urge-zero", "/urge-zero/support"],
  ])("returns 404 when %s disables %s", (projectId, pathname) => {
    process.env.PUBLIC_ROUTE_MODE = "project";
    process.env.PUBLIC_DISABLED_PROJECTS = projectId;

    const response = proxy(request(pathname));

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
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

  it("does not block another project's routes in dedicated root mode", () => {
    process.env.PUBLIC_ROUTE_MODE = "root";
    process.env.PUBLIC_PROJECT_ID = "subiq";

    expect(proxy(request("/jlens/privacy")).status).toBe(200);
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
