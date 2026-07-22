"use client";

import { Player } from "@remotion/player";

import {
  quickListDurationFrames,
  quickListTimeline,
  type QuickListVideoProposal,
} from "@/features/videos/model/quick-list-video";
import { QuickListComposition } from "@/features/videos/rendering/quick-list-composition";

export function QuickListVideoPreview({
  proposal,
  locale,
  imageSources,
}: {
  proposal: QuickListVideoProposal;
  locale: string;
  imageSources: string[];
}) {
  return (
    <Player
      acknowledgeRemotionLicense
      className="overflow-hidden rounded-2xl"
      clickToPlay
      component={QuickListComposition}
      controls
      durationInFrames={quickListDurationFrames}
      fps={quickListTimeline.fps}
      inputProps={{ proposal, locale, imageSources, audioSources: [] }}
      style={{
        aspectRatio: `${quickListTimeline.width} / ${quickListTimeline.height}`,
        backgroundColor: "#09090b",
        height: "auto",
        maxWidth: "100%",
        width: "100%",
      }}
      compositionHeight={quickListTimeline.height}
      compositionWidth={quickListTimeline.width}
    />
  );
}
