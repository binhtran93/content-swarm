# Local TikTok video creator

The backoffice supports one intentionally fixed video format: a vertical
three-point listicle with a hook, three numbered scenes, and a call to action.
The same Remotion composition powers the browser preview and the final MP4, so
the reviewed storyboard matches the rendered result.

## User flow

1. Open a Project and select **Videos**.
2. Select **New video**.
3. Enter a topic, choose whether to use Project context, optionally upload up
   to three JPEG or PNG images, and select the language and narration options.
4. Select **Generate storyboard**. Gemini creates the hook, three points,
   caption, hashtags, music mood, and grounded source links.
5. Edit the hook, points, and call to action while checking the live Remotion
   preview.
6. Select **Render video**. Google Cloud Text-to-Speech creates narration when
   enabled, and Remotion renders the final 1080 × 1920 MP4 and cover image on
   the Mac running the application.
7. Play or download the result, copy the posting pack, or reveal the MP4 in
   Finder. Posting to TikTok remains a manual step.

## Local configuration

No rendering mode variable is required. Videos render on whichever machine is
running the application when **Render video** is selected.

The output directory can optionally be changed:

```dotenv
# Defaults to <repository>/.local-videos
VIDEO_WORKSPACE_DIR=/absolute/path/to/video-workspace
```

The normal Firebase Admin configuration is also used to authenticate Google
Cloud Text-to-Speech. Enable the Text-to-Speech API in the same Google Cloud
project and grant the configured service account permission to use it. If
narration is disabled, no Text-to-Speech request is made.

Run the application with `npm run dev`. Rendering is synchronous and can take
several minutes on the first run because Remotion must download or prepare a
compatible browser and bundle the composition.

## Services and cost

- Remotion's local renderer is open source and does not require a rendering
  service subscription.
- Gemini storyboard generation uses the project's existing AI provider and is
  billed according to that provider configuration.
- Google Cloud Text-to-Speech is usage-based and may include a free monthly
  allowance depending on the selected voice and current Google Cloud terms.
- Local disk storage and Mac compute have no third-party usage charge. Video
  artifacts are not uploaded or backed up by ANMISOFT.

Do not select **Render video** on the hosted deployment. The output paths stored
in Firestore refer to the renderer's local filesystem.
