# Local Storyboard Splitter

The Project backoffice includes a local-only **Tools → Storyboard Splitter**
workflow. It detects bordered panels in a PNG or JPEG contact sheet, crops them
with Sharp, enhances them with Real-ESRGAN, and provides individual PNG and ZIP
downloads.

## Setup

Install the native enhancer once on each Mac that runs the tool:

```bash
npm run tools:setup
```

Generated jobs default to `.local-tools`. Override the location when the
repository disk is unsuitable:

```dotenv
MEDIA_TOOLS_WORKSPACE_DIR=/absolute/path/to/local-tool-workspace
```

Both the generated workspace and downloaded native executable are ignored by
Git. They are not uploaded to Firebase or available on another deployment.

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
