import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve("src");
const forbidden = [
  /@\/platform\/firebase\/.*\.server/,
  /@\/features\/[^/]+\/server\//,
];
const forbiddenPublicImports = [
  /@\/backoffice\//,
  /@\/features\/[^/]+\/backoffice\//,
  /@\/features\/[^/]+\/prompts\//,
  /@\/features\/[^/]+\/publishing\//,
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? sourceFiles(target)
        : /\.(ts|tsx)$/.test(entry.name)
          ? [target]
          : [];
    }),
  );
  return nested.flat();
}

const violations = [];
for (const file of await sourceFiles(sourceRoot)) {
  const source = await readFile(file, "utf8");
  const isClient = /^\s*["']use client["'];/m.test(source);
  const isPublicSurface = file.includes(`${path.sep}public-site${path.sep}`);
  const isSharedPublicComponent = file.includes(
    `${path.sep}public-site${path.sep}components${path.sep}`,
  );
  if (
    (isClient || isPublicSurface) &&
    forbidden.some((rule) => rule.test(source))
  ) {
    violations.push(path.relative(process.cwd(), file));
  }
  if (
    isPublicSurface &&
    forbiddenPublicImports.some((rule) => rule.test(source))
  ) {
    violations.push(path.relative(process.cwd(), file));
  }
  if (isSharedPublicComponent && /@\/public-site\/sites\//.test(source)) {
    violations.push(path.relative(process.cwd(), file));
  }
}

if (violations.length > 0) {
  throw new Error(`Server boundary violation:\n${violations.join("\n")}`);
}
