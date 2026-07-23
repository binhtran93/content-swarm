"use client";

import { Player, type PlayerRef } from "@remotion/player";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type { Project } from "@/features/projects/model/project";
import {
  buildChatStoryTimeline,
  chatStoryConfig,
  chatStoryRuntimeMs,
  parseChatStoryScript,
  type ChatStoryScript,
} from "@/features/tools/model/chat-story";
import { buildChatStoryPrompt } from "@/features/tools/prompts/chat-story-prompt";
import { ChatStoryComposition } from "@/features/tools/video/chat-story-composition";

import styles from "./chat-story-studio.module.css";

type RenderState = {
  jobId: string;
  status: "queued" | "rendering" | "completed" | "failed" | "cancelled";
  progress: number;
  error: string | null;
  fileName: string | null;
};

export function ChatStoryStudio({
  project,
  projectId,
}: {
  project: Pick<Project, "name" | "description" | "topics">;
  projectId: string;
}) {
  const [seed, setSeed] = useState("");
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [renderState, setRenderState] = useState<RenderState | null>(null);
  const parsedResponse = useMemo(() => {
    if (!response.trim())
      return { script: null, error: null } as {
        script: ChatStoryScript | null;
        error: string | null;
      };
    try {
      return { script: parseChatStoryScript(response), error: null };
    } catch (error) {
      return {
        script: null,
        error:
          error instanceof Error ? error.message : "Check the chat script.",
      };
    }
  }, [response]);
  const { script, error: scriptError } = parsedResponse;
  const prompt = seed.trim()
    ? buildChatStoryPrompt({ project, seed: seed.trim() })
    : "";

  useEffect(() => {
    if (!promptOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPromptOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [promptOpen]);

  useEffect(() => {
    if (!renderState || !["queued", "rendering"].includes(renderState.status))
      return;
    const interval = window.setInterval(async () => {
      try {
        const next = await requestJson<RenderState>(
          `/api/admin/projects/${projectId}/tools/chat-story-studio/renders/${renderState.jobId}`,
        );
        setRenderState(next);
      } catch {
        // The active render request reports actionable errors separately.
      }
    }, 700);
    return () => window.clearInterval(interval);
  }, [projectId, renderState]);

  async function copyPrompt() {
    setCopyError(null);
    try {
      if (!navigator.clipboard)
        throw new Error("Clipboard access is unavailable in this browser.");
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch (error) {
      setCopied(false);
      setCopyError(
        error instanceof Error
          ? error.message
          : "The prompt could not be copied.",
      );
    }
  }

  async function startRender() {
    if (!script) return;
    setRenderState(null);
    try {
      const created = await requestJson<RenderState>(
        `/api/admin/projects/${projectId}/tools/chat-story-studio/renders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ script }),
        },
      );
      setRenderState(created);
      void requestJson<RenderState>(
        `/api/admin/projects/${projectId}/tools/chat-story-studio/renders/${created.jobId}/process`,
        { method: "POST" },
      )
        .then(setRenderState)
        .catch((error) =>
          setRenderState((current) =>
            current
              ? {
                  ...current,
                  status: "failed",
                  error:
                    error instanceof Error
                      ? error.message
                      : "The video could not be rendered.",
                }
              : current,
          ),
        );
    } catch (error) {
      setRenderState({
        jobId: "",
        status: "failed",
        progress: 0,
        error:
          error instanceof Error
            ? error.message
            : "The video could not be rendered.",
        fileName: null,
      });
    }
  }

  async function cancelRender() {
    if (!renderState?.jobId) return;
    const next = await requestJson<RenderState>(
      `/api/admin/projects/${projectId}/tools/chat-story-studio/renders/${renderState.jobId}`,
      { method: "DELETE" },
    );
    setRenderState(next);
  }

  return (
    <div className={styles.studio}>
      {copyError ? (
        <div className="alert alert-error" role="alert">
          {copyError}
        </div>
      ) : null}

      <div className={styles.workspace}>
        <div className={`${styles.controls} space-y-5`}>
          <section className={`${styles.seedCard} card`}>
            <div className="card-body gap-4">
              <div>
                <span className={styles.step}>Step 1 · Story seed</span>
                <h2 className="mt-2 text-xl font-bold">
                  Start with one irresistible idea
                </h2>
                <p className="text-base-content/60 mt-1 text-sm leading-6">
                  Paste a Reddit premise or your own seed. The studio builds a
                  strict, original chat-story prompt around it.
                </p>
              </div>
              <label>
                <span className="label-text font-semibold">Story seed</span>
                <textarea
                  aria-label="Story seed"
                  autoFocus
                  className="textarea textarea-bordered mt-2 min-h-40 w-full text-base leading-7"
                  onChange={(event) => {
                    setSeed(event.target.value);
                    setCopied(false);
                  }}
                  placeholder="Example: A woman receives a message from her boyfriend’s number three days after his funeral…"
                  value={seed}
                />
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!prompt}
                  onClick={copyPrompt}
                  type="button"
                >
                  {copied ? "Copied" : "Copy prompt"}
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={!prompt}
                  onClick={() => setPromptOpen(true)}
                  type="button"
                >
                  View prompt
                </button>
                {prompt ? (
                  <span className="text-base-content/50 text-xs">
                    Includes your seed and strict JSON instructions
                  </span>
                ) : null}
              </div>
            </div>
          </section>

          <section className="card border-base-300 bg-base-100 border shadow-sm">
            <div className="card-body gap-4">
              <div>
                <span className={styles.step}>Step 2 · ChatGPT response</span>
                <h2 className="mt-1 text-lg font-bold">
                  Paste the generated JSON
                </h2>
                <p className="text-base-content/60 mt-1 text-sm">
                  Valid JSON appears in the player automatically.
                </p>
              </div>
              <textarea
                aria-label="ChatGPT JSON response"
                className={`${styles.jsonInput} textarea textarea-bordered w-full font-mono text-xs leading-5`}
                onChange={(event) => {
                  setResponse(event.target.value);
                  setRenderState(null);
                }}
                placeholder={
                  '{"title":"…","otherPerson":"Maya","messages":[{"from":"them","text":"…"},{"from":"me","text":"…"}]}'
                }
                value={response}
              />
              {scriptError ? (
                <div className="alert alert-error text-sm" role="alert">
                  {scriptError}
                </div>
              ) : script ? (
                <div className="alert alert-success text-sm" role="status">
                  Ready: {script.messages.length} messages ·{" "}
                  {formatTime(chatStoryRuntimeMs(script) / 1_000)}
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <aside className={`${styles.previewColumn} space-y-4`}>
          <section className={styles.phoneStage}>
            <ChatStoryPlayer script={script} />
          </section>
          <section className="card border-base-300 bg-base-100 border shadow-sm">
            <div className="card-body gap-4">
              <div>
                <span className={styles.step}>Step 3 · Export</span>
                <h2 className="mt-1 text-lg font-bold">Render TikTok MP4</h2>
                <p className="text-base-content/60 mt-1 text-sm">
                  1080 × 1920 · 30 FPS · H.264 with chat sounds
                </p>
              </div>
              {renderState ? (
                <RenderStatus
                  onCancel={cancelRender}
                  projectId={projectId}
                  state={renderState}
                />
              ) : null}
              <button
                className="btn btn-primary w-full"
                disabled={
                  !script ||
                  renderState?.status === "queued" ||
                  renderState?.status === "rendering"
                }
                onClick={startRender}
                type="button"
              >
                Export MP4
              </button>
            </div>
          </section>
        </aside>
      </div>

      {promptOpen ? (
        <div
          aria-labelledby="chat-story-prompt-title"
          aria-modal="true"
          className="modal modal-open"
          role="dialog"
        >
          <div className="modal-box flex max-h-[90vh] max-w-4xl flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={styles.step}>Generated prompt</span>
                <h2
                  className="mt-1 text-xl font-bold"
                  id="chat-story-prompt-title"
                >
                  Copy into ChatGPT
                </h2>
              </div>
              <button
                aria-label="Close prompt"
                autoFocus
                className="btn btn-circle btn-ghost btn-sm"
                onClick={() => setPromptOpen(false)}
                type="button"
              >
                ✕
              </button>
            </div>
            <textarea
              aria-label="Full chat story prompt"
              className={`${styles.prompt} textarea textarea-bordered bg-base-200 w-full flex-1 font-mono text-xs leading-5`}
              readOnly
              value={prompt}
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setPromptOpen(false)}
                type="button"
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={copyPrompt}
                type="button"
              >
                {copied ? "Copied" : "Copy prompt"}
              </button>
            </div>
          </div>
          <button
            aria-label="Close prompt"
            className="modal-backdrop"
            onClick={() => setPromptOpen(false)}
            type="button"
          />
        </div>
      ) : null}
    </div>
  );
}

function ChatStoryPlayer({ script }: { script: ChatStoryScript | null }) {
  const player = useRef<PlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => false,
  );
  const timeline = useMemo(
    () => (script ? buildChatStoryTimeline(script) : null),
    [script],
  );

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);
    const onTime = (event: { detail: { frame: number } }) =>
      setFrame(event.detail.frame);
    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);
    current.addEventListener("ended", onEnded);
    current.addEventListener("timeupdate", onTime);
    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
      current.removeEventListener("ended", onEnded);
      current.removeEventListener("timeupdate", onTime);
    };
  }, [script]);

  return (
    <>
      <div className={styles.playerShell}>
        {script && timeline ? (
          <Player
            acknowledgeRemotionLicense
            clickToPlay
            component={ChatStoryComposition}
            compositionHeight={chatStoryConfig.height}
            compositionWidth={chatStoryConfig.width}
            controls={false}
            durationInFrames={timeline.durationInFrames}
            fps={chatStoryConfig.fps}
            inputProps={{ reducedMotion, script }}
            key={script.title}
            moveToBeginningWhenEnded={false}
            numberOfSharedAudioTags={6}
            ref={player}
            spaceKeyToPlayOrPause
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <div className={styles.emptyPreview}>
            <div>
              <div className="text-4xl">💬</div>
              <p className="mt-3 font-semibold text-slate-700">
                Your chat story will play here
              </p>
              <p className="mt-1 text-sm">
                Paste a valid ChatGPT response to unlock preview and export.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.playerControls}>
        <button
          aria-label={playing ? "Pause chat story" : "Play chat story"}
          className="btn btn-circle btn-sm border-white/20 bg-white/10 text-white"
          disabled={!script}
          onClick={() => player.current?.toggle()}
          type="button"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          aria-label="Restart chat story"
          className="btn btn-circle btn-sm border-white/20 bg-white/10 text-white"
          disabled={!script}
          onClick={() => {
            player.current?.pause();
            player.current?.seekTo(0);
            setFrame(0);
          }}
          type="button"
        >
          ↺
        </button>
        <input
          aria-label="Chat story progress"
          className={styles.progress}
          disabled={!timeline}
          max={Math.max(1, (timeline?.durationInFrames ?? 1) - 1)}
          min="0"
          onChange={(event) => {
            const next = Number(event.target.value);
            player.current?.seekTo(next);
            setFrame(next);
          }}
          type="range"
          value={Math.min(frame, (timeline?.durationInFrames ?? 1) - 1)}
        />
        <span className="min-w-20 text-right text-xs tabular-nums">
          {formatTime(frame / chatStoryConfig.fps)} /{" "}
          {formatTime((timeline?.durationInFrames ?? 0) / chatStoryConfig.fps)}
        </span>
      </div>
    </>
  );
}

function RenderStatus({
  onCancel,
  projectId,
  state,
}: {
  onCancel: () => void;
  projectId: string;
  state: RenderState;
}) {
  const active = state.status === "queued" || state.status === "rendering";
  return (
    <div className="space-y-3" aria-live="polite">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold capitalize">{state.status}</span>
        <span>{Math.round(state.progress * 100)}%</span>
      </div>
      <div
        aria-label="Video render progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(state.progress * 100)}
        className={styles.renderProgress}
        role="progressbar"
      >
        <span style={{ width: `${state.progress * 100}%` }} />
      </div>
      {state.error ? (
        <div className="alert alert-error text-sm" role="alert">
          {state.error}
        </div>
      ) : null}
      {active ? (
        <button className="btn btn-outline btn-sm w-full" onClick={onCancel}>
          Cancel render
        </button>
      ) : null}
      {state.status === "completed" ? (
        <a
          className="btn btn-success w-full"
          download
          href={`/api/admin/projects/${projectId}/tools/chat-story-studio/renders/${state.jobId}/download`}
        >
          Download MP4
        </a>
      ) : null}
    </div>
  );
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new Error(body.error || "The request could not be completed.");
  return body;
}

function formatTime(seconds: number) {
  const rounded = Math.max(0, Math.round(seconds));
  return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, "0")}`;
}

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => undefined;
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}
