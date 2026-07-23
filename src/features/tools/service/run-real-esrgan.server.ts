import "server-only";

import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

import {
  getLocalMediaToolsCapability,
  mediaToolsInstallationRoot,
} from "@/features/tools/service/local-tool-workspace.server";
import { ToolServiceError } from "@/features/tools/service/tool-service-error";

const executeFile = promisify(execFile);

export async function runRealEsrgan({
  inputDirectory,
  outputDirectory,
}: {
  inputDirectory: string;
  outputDirectory: string;
}) {
  const capability = await getLocalMediaToolsCapability();
  if (!capability.available) {
    throw new ToolServiceError("disabled", capability.message);
  }

  const installation = mediaToolsInstallationRoot();
  try {
    await executeFile(
      path.join(installation, "realesrgan-ncnn-vulkan"),
      [
        "-i",
        inputDirectory,
        "-o",
        outputDirectory,
        "-n",
        "realesr-animevideov3",
        "-s",
        "4",
        "-f",
        "png",
        "-m",
        path.join(installation, "models"),
      ],
      {
        cwd: installation,
        maxBuffer: 2 * 1024 * 1024,
        timeout: 15 * 60 * 1000,
      },
    );
  } catch {
    throw new ToolServiceError(
      "failed",
      "AI enhancement failed. The original crops were kept for diagnostics.",
    );
  }
}
