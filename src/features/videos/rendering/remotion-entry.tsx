import { Composition, registerRoot } from "remotion";

import {
  quickListDurationFrames,
  quickListTimeline,
  type QuickListVideoProposal,
} from "@/features/videos/model/quick-list-video";
import { QuickListComposition } from "@/features/videos/rendering/quick-list-composition";

const example: QuickListVideoProposal = {
  title: "Three useful ideas",
  hook: {
    onScreenText: "3 things worth knowing",
    narration: "Here are three things worth knowing.",
  },
  points: [1, 2, 3].map((number) => ({
    heading: `Point ${number}`,
    body: "A concise and useful explanation.",
    narration: `Point ${number}. A concise and useful explanation.`,
  })) as QuickListVideoProposal["points"],
  cta: {
    onScreenText: "Save this list",
    narration: "Save this list for later.",
  },
  coverText: "3 things worth knowing",
  caption: "Three useful ideas.",
  hashtags: ["#tips"],
  musicMood: "Upbeat and curious",
  references: [],
};

function RemotionRoot() {
  return (
    <Composition
      component={QuickListComposition}
      defaultProps={{
        proposal: example,
        locale: "en-US",
        imageSources: [],
        audioSources: [],
      }}
      durationInFrames={quickListDurationFrames}
      fps={quickListTimeline.fps}
      height={quickListTimeline.height}
      id="QuickListVideo"
      width={quickListTimeline.width}
    />
  );
}

registerRoot(RemotionRoot);
