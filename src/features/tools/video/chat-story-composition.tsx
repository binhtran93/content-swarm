import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import {
  buildChatStoryTimeline,
  getOutgoingDraftText,
  type ChatStoryScript,
} from "@/features/tools/model/chat-story";

const soundData = {
  typing:
    "data:audio/wav;base64,UklGRvQCAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YdACAAAAACcAkgAmAbwBKAJAAugBFgHY/1H+uPxN+1T6BfqF+t77+f2fAH8DNwZhCKMJugmICBsGqwKb/mr6pPbS82PyoPKd9DH4AP16AvIHswwUEJQRfhBeDZcIwAKS/NH2MvJI72/uw+8Y8wX47/0bBMQJOQ7rEIYR9w9uDFwHYQE7+6v1YvHo7ovuVvAR9Eb5T/9vBeIK/Q4+EV0RVg9rCxYGAADq+ZX0qvCj7sLuA/Ee9ZH6sQC6Bu8Lqg91ERgRng5VCsUEn/6k+JLzCfB67hXvx/E89uX7EQL7B+gMPRCREbgQzg0vCW4DQP1p96Lygu9s7oLvovJp90D9bgMvCc4NuBCRET0Q6Az7BxEC5fs89sfxFe967gnwkvOk+J/+xQRVCp4OGBF1EaoP7wu6BrEAkfoe9QPxwu6j7qrwlfTq+QAAFgZrC1YPXRE+Ef0O4gpvBU//RvkR9Fbwi+7o7mLxq/U7+2EBXAduDPcPhhHrEDkOxAkbBO/9BfgY88Pvb+5I7zLy0faS/MAClwheDX4QlBF+EF4NlwjAApL80fYy8kjvb+7D7xjzBfjv/RsExAk5DusQhhH3D24MXAdhATv7q/Vi8ejui+5W8BH0RvlP/28F4gr9Dj4RXRFWD2sLFgYAAOr5lfSq8KPuwu4D8R71kfqxALoG7wuqD3URGBGeDlUKxQSf/qT4kvMJ8HruFe/H8Tz25fsRAvsH6Aw9EJERuBDODS8JbgNA/Wn3ovKC72zut+/48rz3Y/03A38ImQwMD5cPNg4iC8kGuwGd/BH4oPSt8mvy1POu9pP6AP9mAzwHDAqKC5ELLgqbBzQEbAC+/Jv5YvdN9nP2wvcC+uL8AAD3AmwFGAfQB4sHXwZ9BCwCvP96/a37hfoc+nL6b/vm/KH+YQDvARsDywPxA5gD2ALVAbgAqv/O/jr++P0G/lT+y/5Q/8n/IwBSAFYANQA=",
  incoming:
    "data:audio/wav;base64,UklGRvQCAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YdACAAAAAD8A0QBJATQBWADh/lr9fvzg/KT+WQEQBLAFZAX+Ah7/D/tX+CX41fq2/y4FRwlcCsUHJAJK+5z1Q/NW9WP7fwPhCtMOtA2fB3j+W/WL70jvOvXl/vMI6A9dEdAM1gOH+XbxbO528Yf51gPQDF0R6A/zCOX+OvVI7x/vzPRZ/ngIqg9xES8NXwQM+sfxbu4p8QX5SwNuDEQRIhBrCXP/q/V27/nuYPTM/fsHZw+AEYsN5wSR+hzyde7f8IT4wAIIDCgRWBDhCQAAH/ao79ju+PNA/XwHIQ+LEeQNbwUZ+3XygO6Z8AX4NAKgCwcRihBVCo0Alfbe77zukvO1/PsG1w6SETkO9AWh+9Hyj+5W8Ij3pwE0C+EQuBDGChsBDfcY8KPuMPMq/HkGig6UEYoOeQYq/DDzo+4Y8A33GwHGCrgQ4RA0C6cBiPdW8I/u0fKh+/QFOQ6SEdcO+wa1/JLzvO7e75X2jQBVCooQBxGgCzQCBfiZ8IDudfIZ+28F5A2LESEPfAdA/fjz2O6o7x/2AADhCVgQKBEIDMAChPjf8HXuHPKR+ucEiw2AEWcP+wfM/WD0+e5276v1c/9rCSIQRBFuDEsDBfkp8W7ux/EM+l8ELw1xEaoPeAhZ/sz0H+9I7zr15f7zCOgPXRHQDNYDh/l28WzudvGH+dYD0AxdEegP8wjl/jr1SO8f78z0Wf54CKoPcREvDV8EDPrH8W7uKfEF+UsDbgxEESIQawlz/6v1q+9m79D06P17B0AO+A8xDFoEP/sF9BfxVPPT+TwCoAmCDasMiQcAALf4J/TH85T3HP4NBQYKZwvbCGUD//zg97j1JfeD+zYBQAbwCHoIKwVFAIf7ivg7+JD6mv7hAvAFzwZVBSkCeP6N+1X6G/t2/XoAFQNuBC4EjwJAABn+0vy//ML9YP/4AAACMwKjAaYAqv8K/+r+NP+q/wcAIgA=",
  outgoing:
    "data:audio/wav;base64,UklGRvQCAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YdACAAAAADMAtgBNAawBjgHRAIX/7/16/Jv7sfvm/Bv/5wGpBLAGYQdmBsoDAADP+y74BPb49Tv4ePzbATwHWwsvDSMMRAhFAmL7IPX08PHvffI4+AAA+wc5Dl0RuBBuDG8FQP2r9VbwbO5W8Kv1QP1vBW4MuBBdETkO+wcAAAX4x/Gj7kjvkvOR+sACVQqqD5QRqg9VCsACkfqS80jvo+7H8QX4AAD7BzkOXRG4EG4MbwVA/av1VvBs7lbwq/VA/W8Fbgy4EF0ROQ77BwAABfjH8aPuSO+S85H6wAJVCqoPlBGqD1UKwAKR+pLzSO+j7sfxBfgAAPsHOQ5dEbgQbgxvBUD9q/VW8GzuVvCr9UD9bwVuDLgQXRE5DvsHAAAF+Mfxo+5I75LzkfrAAlUKqg+UEaoPVQrAApH6kvNI76Pux/EF+AAA+wc5Dl0RuBBuDG8FQP2r9VbwbO5W8Kv1QP1vBW4MuBBdETkO+wcAAAX4x/Gj7kjvkvOR+sACVQqqD5QRqg9VCsACkfqS80jvo+7H8QX4AAD7BzkOXRG4EG4MbwVA/av1VvBs7lbwq/VA/W8Fbgy4EF0ROQ77BwAABfjH8aPuSO+S85H6wAJVCqoPlBGqD1UKwAKR+pLzSO+j7sfxBfgAAPsHOQ5dEbgQbgxvBUD9q/VW8GzuVvCr9UD9bwVuDLgQXRE5DvsHAAAF+Mfxo+5I75LzkfrAAlUKqg+UEaoPVQrAApH6kvNI76Pux/EF+AAA4QfeDbYQ4g+nCwYFfv2z9hryn/B+8jj3sv17BBkKYA2sDQULFgYAAB36sfWh80z0dPdV/NIBtwb8Cf0KmAkzBp4B4PwC+c72q/aJ+On7AADkA8EGCAiGB3AFTwLe/t777vlp+VP6YvwS/8QB4gMEBf4E6QMYAgAAG/7N/FD8qPyr/Q3/cgCNAScCMwLDAQkBPgCY/zn/Kv9Z/6X/5v8=",
  reveal:
    "data:audio/wav;base64,UklGRsQFAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YaAFAAAAAE4A4QD6ABwAk/5g/Zn9j/9gAlcE9AP9AN38//lh+kD+tAOZB2EHtwLx++f2yvYe/DQEfAoZCz0F3/tB9PvyOvnUA9wM9Q56CLT8MPIe76v1egLkDXkRNAuf/tHyce7480cAbgyTEdAM1ABg9HrudfIS/sYKZxE5DgYDH/bJ7inx5fvzCPUQZw8rBQX4X+8Y8Mn5+wY9EFgQPAcM+jfwSO/G9+cERQ8HES8JKvxP8bzu5PXAAg8OcRH+Cln+ovJ17iv0jQCgDJQRoAyNACv0de6i8ln+/gpxEQ8OwALk9bzuT/Eq/C8JBxFFD+cExvdI7zfwDPo8B1gQPRD7Bsn5GPBf7wX4KwVnD/UQ8wjl+ynxye4f9gYDOQ5nEcYKEv518nruYPTUANAMkxFuDEcA+PNx7tHyn/40C3kR5A16Aqv1r+528W/8awkYESEPowSI9zPvVvBO+nwHcRAiELoGh/n773bvRPhvBYkP4RC2CKH7A/HY7ln2SwNiDl0RjgrM/UjygO6V9BsBAA2SETwMAADE827uAPPl/msLgBG4DTQCcvWj7p7xtfynCSgR/Q5fBEr3H+938JH6vAeKEAUQeQZG+d7vj++E+LIFqg/NEHgIXfvf8OjulfaRA4oOURFVCob9HPKH7sz0YQEvDY8RCAy5/5Lzbe4w8yz/oAuGEYsN7gE69Znux/H6/OEJNxHXDhsEDfcL75nw1fr7B6EQ6A83BgX5w++o78T49AXJD7gQOggZ+7vw+e7R9tYDsQ5EERwKQP3x8Y/uAvWnAV4NixHVC3P/YPNs7mDzc//VC4sRXg2nAQL1j+7x8UD9HApEEbEO1gPR9vnuu/AZ+zoIuBDJD/QFxPio78PvBfk3BugPoRD7B9X6mfAL7w33GwTXDjcR4Qn6/Mfxme469e4Biw2GEaALLP8w823ukvO5/wgMjxEvDWEBzPSH7hzyhv1VClERig6RA5X26O7f8F37eAjNEKoPsgWE+I/v3u9G+XkGBRCKELwHkfp38B/vSvdfBP0OKBGnCbX8nvGj7nL1NAK4DYARawvl/gDzbu7E8wAAPAySEQANGwGV9IDuSPLM/Y4KXRFiDksDWfbY7gPxofu2COEQiQ9vBUT4du/774f5ugYiEHEQfAdO+lbwM++I96MEIQ8YEWsJb/x28a/uq/V6AuQNeRE0C5/+0fJx7vjzRwBuDJMR0AzUAGD0eu518hL+xgpnETkOBgMf9snuKfHl+/MI9RBnDysFBfhf7xjwyfn7Bj0QWBA8Bwz6N/BI78b35wRFDwcRLwkq/E/xvO7k9cACDw5xEf4KWf6i8nXuK/SNAKAMlBGgDI0AK/R17qLyWf7+CnERDw7AAuT1vO5P8Sr8LwkHEUUP5wTG90jvN/AM+jwHWBA9EPsGyfkY8F/vBfgrBWcP9RDzCOX7KfHJ7h/2BgM5DmcRxgoS/nXyeu5g9NQA0AyTEW4MRwD483Hu0fKf/jQLeRHkDXoCq/Wv7nbxb/xrCRgRIQ+jBIj3M+9W8E76fAdxECIQugaH+fvvdu9E+G8FiQ/hELYIofsD8djuWfZLA2IOXRGOCsz9SPKA7pX0GwEADZIRPAwAAMTzbu4A8+X+awuAEbgNNAJy9aPunvG1/KcJKBH9Dl8ESvcf73fwkfq8B4oQBRB5Bkb53u+P74T4sgWqD80QeAhd+9/w6O6V9pEDig5REVUKjv118i/vW/VLATIMBhDUCsH/IPXX8Bz1Tv+XCT0O1gqFAab3u/JW9cX9KgdEDGQK0gL2+cT0/fW0/P0EMAqLCaYD/Pvd9gP3HfwgAxcIXAgDBKz98PhX+Pv7oQEPBugG6wP4/uj65flK/IoALQRDBWcD2f+w/Jv7Af3g/4QCggOCAkoAN/5i/RH+qP8jAboBSQFKAG3/Jv9t/+H/GgA=",
} as const;

export function ChatStoryComposition({
  reducedMotion = false,
  script,
}: {
  reducedMotion?: boolean;
  script: ChatStoryScript;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeline = buildChatStoryTimeline(script);
  const revealed = timeline.messages.filter(
    (message) => frame >= message.revealFrame,
  );
  const typing = timeline.messages.find(
    (message) =>
      frame >= message.typingStartFrame && frame < message.revealFrame,
  );
  const outgoingDraft =
    typing?.senderId === "right"
      ? getOutgoingDraftText({ frame, message: typing })
      : "";
  const visibleMessages = revealed.slice(-9);
  const participants = Object.fromEntries(
    script.participants.map((participant) => [participant.id, participant]),
  );

  return (
    <AbsoluteFill
      style={{
        background: "#f5f6f8",
        color: "#111827",
        fontFamily:
          "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "rgba(255,255,255,.96)",
          borderBottom: "2px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(17,24,39,.06)",
          display: "flex",
          height: 176,
          padding: "36px 44px 24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ color: "#0877ff", fontSize: 48, marginRight: 28 }}>‹</div>
        <Avatar name={script.participants[0].displayName} size={88} />
        <div style={{ marginLeft: 24 }}>
          <div style={{ fontSize: 38, fontWeight: 750, lineHeight: 1.1 }}>
            {script.participants[0].displayName}
          </div>
          <div style={{ color: "#6b7280", fontSize: 24, marginTop: 8 }}>
            Active now
          </div>
        </div>
        <div
          style={{
            color: "#0877ff",
            fontSize: 38,
            letterSpacing: 16,
            marginLeft: "auto",
          }}
        >
          ◦ ◦
        </div>
      </div>

      <div
        style={{
          bottom: 150,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          left: 34,
          position: "absolute",
          right: 34,
        }}
      >
        {visibleMessages.map((message, visibleIndex) => {
          const absoluteIndex =
            revealed.length - visibleMessages.length + visibleIndex;
          const previous = timeline.messages[absoluteIndex - 1];
          const next = timeline.messages[absoluteIndex + 1];
          const firstInGroup = previous?.senderId !== message.senderId;
          const lastInGroup =
            next?.senderId !== message.senderId || next.revealFrame > frame;
          return (
            <MessageBubble
              firstInGroup={firstInGroup}
              frame={frame}
              key={message.id}
              lastInGroup={lastInGroup}
              message={message}
              name={participants[message.senderId].displayName}
              reducedMotion={reducedMotion}
            />
          );
        })}
        {typing?.senderId === "left" ? (
          <TypingIndicator
            name={participants[typing.senderId].displayName}
            reducedMotion={reducedMotion}
          />
        ) : null}
      </div>

      <div
        style={{
          alignItems: "center",
          background: "#fff",
          borderTop: "2px solid #e5e7eb",
          bottom: 0,
          color: outgoingDraft ? "#111827" : "#9ca3af",
          display: "flex",
          fontSize: 28,
          gap: 20,
          height: 116,
          left: 0,
          padding: "18px 30px 30px",
          position: "absolute",
          right: 0,
        }}
      >
        <span style={{ color: "#0877ff", fontSize: 42 }}>＋</span>
        <div
          style={{
            background: "#f1f3f5",
            borderRadius: 40,
            color: outgoingDraft ? "#111827" : "#9ca3af",
            flex: 1,
            minHeight: 66,
            overflow: "hidden",
            padding: "16px 28px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {outgoingDraft || "Message"}
          {outgoingDraft ? (
            <span
              style={{
                background: "#0877ff",
                display: "inline-block",
                height: 31,
                marginLeft: 3,
                opacity:
                  reducedMotion || Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                transform: "translateY(5px)",
                width: 3,
              }}
            />
          ) : null}
        </div>
        <span
          style={{
            alignItems: "center",
            background: outgoingDraft ? "#0877ff" : "transparent",
            borderRadius: "50%",
            color: outgoingDraft ? "#fff" : "#0877ff",
            display: "flex",
            fontSize: outgoingDraft ? 24 : 28,
            height: 52,
            justifyContent: "center",
            transform: outgoingDraft ? "scale(1)" : "scale(.9)",
            width: 52,
          }}
        >
          {outgoingDraft ? "➤" : "●"}
        </span>
      </div>

      {timeline.messages.flatMap((message) => [
        <Sequence
          durationInFrames={Math.max(2, Math.round(fps * 0.08))}
          from={message.typingStartFrame}
          key={`${message.id}-typing`}
        >
          <Audio src={soundData.typing} volume={0.16} />
        </Sequence>,
        <Sequence
          durationInFrames={Math.max(2, Math.round(fps * 0.2))}
          from={message.revealFrame}
          key={`${message.id}-message`}
        >
          <Audio
            src={soundData[message.sound]}
            volume={message.sound === "reveal" ? 0.38 : 0.24}
          />
        </Sequence>,
      ])}
    </AbsoluteFill>
  );
}

function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(145deg, #7c3aed, #ec4899)",
        borderRadius: "50%",
        color: "white",
        display: "flex",
        fontSize: size * 0.4,
        fontWeight: 800,
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function MessageBubble({
  firstInGroup,
  frame,
  lastInGroup,
  message,
  name,
  reducedMotion,
}: {
  firstInGroup: boolean;
  frame: number;
  lastInGroup: boolean;
  message: ReturnType<typeof buildChatStoryTimeline>["messages"][number];
  name: string;
  reducedMotion: boolean;
}) {
  const { fps } = useVideoConfig();
  const outgoing = message.senderId === "right";
  const entrance = reducedMotion
    ? 1
    : spring({
        fps,
        frame: Math.max(0, frame - message.revealFrame),
        config: { damping: 18, stiffness: 210, mass: 0.7 },
        durationInFrames: 12,
      });

  return (
    <div
      style={{
        alignItems: "flex-end",
        display: "flex",
        gap: 14,
        justifyContent: outgoing ? "flex-end" : "flex-start",
        minHeight: 44,
        opacity: interpolate(entrance, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(entrance, [0, 1], [34, 0])}px) scale(${interpolate(entrance, [0, 1], [0.96, 1])})`,
        transformOrigin: outgoing ? "bottom right" : "bottom left",
      }}
    >
      {!outgoing ? (
        lastInGroup ? (
          <Avatar name={name} size={54} />
        ) : (
          <div style={{ width: 54 }} />
        )
      ) : null}
      <div
        style={{
          background: outgoing ? "#0877ff" : "#e4e6eb",
          borderRadius: bubbleRadius(outgoing, firstInGroup, lastInGroup),
          color: outgoing ? "#fff" : "#111827",
          fontSize: 34,
          fontWeight: 520,
          lineHeight: 1.28,
          maxWidth: "76%",
          overflowWrap: "anywhere",
          padding: "18px 25px",
        }}
      >
        {message.text}
      </div>
      {outgoing && lastInGroup ? (
        <div style={{ color: "#6b7280", fontSize: 19, marginBottom: 5 }}>
          Read
        </div>
      ) : null}
    </div>
  );
}

function bubbleRadius(
  outgoing: boolean,
  firstInGroup: boolean,
  lastInGroup: boolean,
) {
  if (outgoing) {
    return `${firstInGroup ? 28 : 10}px 28px ${lastInGroup ? 28 : 10}px 28px`;
  }
  return `28px ${firstInGroup ? 28 : 10}px 28px ${lastInGroup ? 28 : 10}px`;
}

function TypingIndicator({
  name,
  reducedMotion,
}: {
  name: string;
  reducedMotion: boolean;
}) {
  const frame = useCurrentFrame();
  const dots = [0, 1, 2];
  return (
    <div
      style={{
        alignItems: "flex-end",
        display: "flex",
        gap: 14,
        justifyContent: "flex-start",
      }}
    >
      <Avatar name={name} size={54} />
      <div
        style={{
          background: "#e4e6eb",
          borderRadius: 28,
          display: "flex",
          gap: 9,
          padding: "20px 25px",
        }}
      >
        {dots.map((dot) => (
          <span
            key={dot}
            style={{
              background: "#73777f",
              borderRadius: "50%",
              display: "block",
              height: 11,
              opacity: 0.4 + ((frame + dot * 3) % 9) / 15,
              transform: `translateY(${reducedMotion ? 0 : Math.sin((frame + dot * 4) / 2) * 5}px)`,
              width: 11,
            }}
          />
        ))}
      </div>
    </div>
  );
}
