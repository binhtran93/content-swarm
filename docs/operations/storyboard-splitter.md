# Local Storyboard Splitter

The Project backoffice includes a local-only **Tools → Storyboard Splitter**
workflow. It detects bordered panels in a PNG or JPEG contact sheet, crops them
with Sharp, enhances them with Real-ESRGAN, and provides individual PNG and ZIP
downloads.

After upload, the job pauses in **review**. Move a red rectangle by dragging
inside it or resize it with the white edge or corner handles. The red rectangle
is the exact final crop. Changes save automatically; **Cut and enhance** starts
the native enhancement step.
Completed jobs keep the editor enabled. Adjusting a completed job and choosing
**Cut and enhance again** replaces its enhanced panels and ZIP.

## Bundled native tool

The required Apple silicon macOS Real-ESRGAN executable and x4 animation model
are committed under `vendor/media-tools/realesrgan/darwin-arm64`. No separate
tool installation is required.

Generated jobs default to `.local-tools`. Override the location when the
repository disk is unsuitable:

```dotenv
MEDIA_TOOLS_WORKSPACE_DIR=/absolute/path/to/local-tool-workspace
```

Generated workspaces are ignored by Git and are not uploaded to Firebase.

## Verification

Run the native smoke test after setup:

```bash
npm run tools:smoke
```

The smoke test creates a temporary four-panel sheet, detects and crops it,
enhances the crops at 4×, verifies the output, and removes its temporary files.

## Input expectations

- PNG or JPEG, no larger than 25 MB or 40 million decoded pixels.
- Clear dark rectangular borders around each top-level panel.
- Reading order is top-to-bottom and left-to-right.

Nested rectangles are suppressed. Manual crop correction is not part of the
current workflow. Real-ESRGAN can improve illustrated edges but cannot recover
missing detail reliably and may alter tiny unreadable text.
