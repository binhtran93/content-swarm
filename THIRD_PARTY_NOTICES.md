# Third-party notices

The backoffice layout and visual conventions were adapted from the locally
licensed Nexus Next.js 2.3.0 template by Denish Navadiya and from daisyUI. The
Nexus source remains a local reference excluded from this repository's
production dependency graph. Adapted code has been simplified and is maintained
as ANMISOFT product code.

## Bundled media tools

The repository includes unmodified native executables and model files under
`vendor/media-tools`. Their inclusion does not change the license of ANMISOFT
source code that communicates with them as separate processes.

- **yt-dlp 2026.06.09** is distributed under the Unlicense. Its official
  PyInstaller macOS and Linux executables include third-party components and
  are distributed as combined works under GPLv3+. The corresponding official
  source release is committed under `vendor/media-tools/sources`.
- **FFmpeg 8.1.2** is distributed under GPLv3 for the committed builds because
  GPL and version-3 components are enabled. The GPLv3 license, FFmpeg source,
  build-script sources, exact executable configurations, and checksums are
  committed with the binaries. FFmpeg is a trademark of Fabrice Bellard,
  originator of the FFmpeg project.
- **LAME** is included in the FFmpeg builds for MP3 encoding and is licensed
  under the LGPL.
- **Real-ESRGAN 0.2.5.0** is licensed under the BSD 3-Clause License. Its
  copyright, license, source archive, executable, and required model are
  committed with the tool.

The yt-dlp and FFmpeg builds also contain compatible third-party libraries.
Their upstream notices and exact dependency revisions are retained in the
official source and build-script archives. See
`vendor/media-tools/README.md` for provenance.
