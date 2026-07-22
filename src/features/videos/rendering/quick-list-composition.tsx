import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { QuickListVideoProposal } from "@/features/videos/model/quick-list-video";
import { quickListTimeline } from "@/features/videos/model/quick-list-video";

export type QuickListCompositionProps = {
  proposal: QuickListVideoProposal;
  locale: string;
  imageSources: string[];
  audioSources: string[];
};

const colors = {
  background: "#09090b",
  foreground: "#fafafa",
  muted: "#d4d4d8",
  primary: "#8b5cf6",
  accent: "#22d3ee",
};

function AnimatedBackdrop() {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 630], [-140, 170]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,.55), rgba(139,92,246,0) 66%)",
          borderRadius: "50%",
          filter: "blur(18px)",
          height: 900,
          left: -280,
          opacity: 0.78,
          position: "absolute",
          top: drift,
          width: 900,
        }}
      />
      <div
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,.38), rgba(34,211,238,0) 68%)",
          borderRadius: "50%",
          bottom: -240 + drift / 2,
          filter: "blur(22px)",
          height: 820,
          position: "absolute",
          right: -300,
          width: 820,
        }}
      />
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          inset: 0,
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          position: "absolute",
        }}
      />
    </AbsoluteFill>
  );
}

function Scene({
  children,
  caption,
  direction,
  progress,
}: {
  children: ReactNode;
  caption: string;
  direction: "ltr" | "rtl";
  progress: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const style: CSSProperties = {
    direction,
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Noto Sans", Arial, sans-serif',
    opacity: entrance,
    transform: `translateY(${interpolate(entrance, [0, 1], [70, 0])}px)`,
  };
  return (
    <AbsoluteFill
      style={{
        color: colors.foreground,
        justifyContent: "center",
        padding: "150px 105px 300px",
      }}
    >
      <div style={style}>{children}</div>
      <div
        style={{
          backgroundColor: "rgba(9,9,11,.82)",
          border: "2px solid rgba(255,255,255,.12)",
          borderRadius: 28,
          bottom: 205,
          direction,
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Noto Sans", Arial, sans-serif',
          fontSize: 39,
          fontWeight: 650,
          left: 90,
          lineHeight: 1.25,
          padding: "24px 32px",
          position: "absolute",
          right: 170,
          textAlign: "center",
        }}
      >
        {caption}
      </div>
      <div
        style={{
          backgroundColor: "rgba(255,255,255,.16)",
          borderRadius: 10,
          bottom: 135,
          height: 10,
          left: 90,
          overflow: "hidden",
          position: "absolute",
          right: 170,
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
            height: "100%",
            width: `${progress * 100}%`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

function HookScene({
  proposal,
  direction,
}: {
  proposal: QuickListVideoProposal;
  direction: "ltr" | "rtl";
}) {
  return (
    <Scene
      caption={proposal.hook.narration}
      direction={direction}
      progress={0.1}
    >
      <div
        style={{
          color: colors.accent,
          fontSize: 42,
          fontWeight: 800,
          letterSpacing: 4,
          marginBottom: 30,
          textTransform: "uppercase",
        }}
      >
        Quick list
      </div>
      <div style={{ fontSize: 94, fontWeight: 900, lineHeight: 0.98 }}>
        {proposal.hook.onScreenText}
      </div>
    </Scene>
  );
}

function PointScene({
  index,
  point,
  imageSource,
  direction,
}: {
  index: number;
  point: QuickListVideoProposal["points"][number];
  imageSource?: string;
  direction: "ltr" | "rtl";
}) {
  return (
    <Scene
      caption={point.narration}
      direction={direction}
      progress={(index + 1) / 4}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 28 }}>
        <div
          style={{
            alignItems: "center",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            borderRadius: 28,
            display: "flex",
            fontSize: 58,
            fontWeight: 900,
            height: 112,
            justifyContent: "center",
            width: 112,
          }}
        >
          {index + 1}
        </div>
        <div style={{ flex: 1, fontSize: 70, fontWeight: 900, lineHeight: 1 }}>
          {point.heading}
        </div>
      </div>
      {imageSource ? (
        <div
          style={{
            backgroundColor: "rgba(255,255,255,.08)",
            border: "2px solid rgba(255,255,255,.12)",
            borderRadius: 38,
            height: 650,
            marginTop: 44,
            overflow: "hidden",
          }}
        >
          <Img
            src={imageSource}
            style={{ height: "100%", objectFit: "cover", width: "100%" }}
          />
        </div>
      ) : (
        <div
          style={{
            borderLeft: `8px solid ${colors.accent}`,
            color: colors.muted,
            fontSize: 52,
            fontWeight: 650,
            lineHeight: 1.18,
            marginTop: 70,
            paddingLeft: 38,
          }}
        >
          {point.body}
        </div>
      )}
    </Scene>
  );
}

function CtaScene({
  proposal,
  direction,
}: {
  proposal: QuickListVideoProposal;
  direction: "ltr" | "rtl";
}) {
  return (
    <Scene caption={proposal.cta.narration} direction={direction} progress={1}>
      <div style={{ fontSize: 86, fontWeight: 900, lineHeight: 1.02 }}>
        {proposal.cta.onScreenText}
      </div>
      <div
        style={{
          color: colors.accent,
          fontSize: 38,
          fontWeight: 750,
          marginTop: 42,
        }}
      >
        Save this for later
      </div>
    </Scene>
  );
}

export function QuickListComposition({
  proposal,
  locale,
  imageSources,
  audioSources,
}: QuickListCompositionProps) {
  const direction = locale.startsWith("ar") ? "rtl" : "ltr";
  const pointStart = (index: number) =>
    quickListTimeline.hookFrames + quickListTimeline.pointFrames * index;
  const ctaStart = pointStart(3);
  return (
    <AbsoluteFill>
      <AnimatedBackdrop />
      <Sequence durationInFrames={quickListTimeline.hookFrames} from={0}>
        <HookScene direction={direction} proposal={proposal} />
        {audioSources[0] ? <Audio src={audioSources[0]} /> : null}
      </Sequence>
      {proposal.points.map((point, index) => (
        <Sequence
          durationInFrames={quickListTimeline.pointFrames}
          from={pointStart(index)}
          key={`${index}-${point.heading}`}
        >
          <PointScene
            direction={direction}
            imageSource={imageSources[index]}
            index={index}
            point={point}
          />
          {audioSources[index + 1] ? (
            <Audio src={audioSources[index + 1]} />
          ) : null}
        </Sequence>
      ))}
      <Sequence durationInFrames={quickListTimeline.ctaFrames} from={ctaStart}>
        <CtaScene direction={direction} proposal={proposal} />
        {audioSources[4] ? <Audio src={audioSources[4]} /> : null}
      </Sequence>
    </AbsoluteFill>
  );
}
