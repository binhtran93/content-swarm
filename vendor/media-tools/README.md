# Bundled media tools

These native tools are deliberately committed so a checkout does not need a
separate installation command. Do not enable self-updates or replace a binary
without updating this manifest, the source archives, licenses, and
`SHA256SUMS`.

## YouTube audio

### yt-dlp

- Version: `2026.06.09`
- macOS: official universal `yt-dlp_macos` release executable, used on arm64
- Linux: official x64 `yt-dlp_linux` release executable
- Release:
  `https://github.com/yt-dlp/yt-dlp/releases/tag/2026.06.09`
- Source: `sources/yt-dlp-2026.06.09.tar.gz`
- Self-update: disabled by application policy; no `-U` argument is used

### FFmpeg and FFprobe

- FFmpeg libraries: `8.1.2`
- macOS arm64 provider:
  `https://ffmpeg.martin-riedl.de/`
- macOS build script: `sources/martin-riedl-ffmpeg-build-script-main.tar.gz`
- Linux x64 provider:
  `https://github.com/BtbN/FFmpeg-Builds/releases/tag/latest`
- Linux build revision: `8c736b2d6fe5da2a10a8896d01e53bfb0ca4f665`
- Linux build script: `sources/BtbN-FFmpeg-Builds-8c736b2.tar.gz`
- FFmpeg source: `sources/ffmpeg-8.1.2.tar.xz`
- License: GPLv3; the full text is in
  `youtube-audio/ffmpeg-linux-LICENSE.txt`

Both builds include `libmp3lame`. The binaries retain their exact configure
arguments; run `ffmpeg -version` to inspect them. The Linux build uses shared
FFmpeg libraries committed beside the executable, and the application supplies
that directory through `LD_LIBRARY_PATH`.

## Storyboard Splitter

- Real-ESRGAN release: `0.2.5.0`
- Platform: universal macOS executable, used on Apple silicon
- Required model: `realesr-animevideov3-x4`
- Release:
  `https://github.com/xinntao/Real-ESRGAN/releases/tag/v0.2.5.0`
- Source: `sources/Real-ESRGAN-v0.2.5.0.tar.gz`
- License: `realesrgan/LICENSE`

Unused models, sample images, and the demo video from the upstream archive are
intentionally omitted.
