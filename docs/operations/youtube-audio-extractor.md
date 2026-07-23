# Local YouTube Audio Extractor

The Project backoffice includes an owner-only **Tools → YouTube Audio
Extractor** workflow. Paste one public YouTube video URL and the server extracts
its best available audio as an untagged, high-quality MP3.

Use the tool only for content you own or are authorized to download. It does not
support playlist pages, private videos, members-only videos, cookies, or other
authenticated content. A video URL containing a playlist query still processes
only that video.

## Bundled native tools

Pinned yt-dlp, FFmpeg, and FFprobe executables are committed under
`vendor/media-tools/youtube-audio` for:

- Apple silicon macOS (`darwin-arm64`)
- x64 Linux (`linux-x64`)

No separate tool installation or self-update step is used. Other platforms fail
closed with an unavailable message.

## Processing and storage

Extraction runs synchronously and has no application-defined duration limit.
The deployment host may still impose request-duration, bandwidth, or disk-space
limits.

Completed MP3 files are stored temporarily in the Project-scoped local media
workspace. The download URL can be claimed once. Its files are deleted when the
stream closes; abandoned extraction directories are removed after 24 hours
during later requests. `MEDIA_TOOLS_WORKSPACE_DIR` overrides the default
`.local-tools` location.
