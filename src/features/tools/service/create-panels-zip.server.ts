import "server-only";

import { ZipArchive } from "archiver";
import { createWriteStream } from "node:fs";

export async function createPanelsZip({
  panels,
  target,
}: {
  panels: Array<{ source: string; fileName: string }>;
  target: string;
}) {
  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(target);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    output.on("close", resolve);
    output.on("error", reject);
    archive.on("error", reject);
    archive.pipe(output);
    for (const panel of panels) {
      archive.file(panel.source, { name: panel.fileName });
    }
    void archive.finalize();
  });
}
