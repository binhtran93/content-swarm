"use client";

import { useState } from "react";

import type { Project } from "@/features/projects/model/project";
import {
  buildShortVideoScriptPrompt,
  buildStickmanStoryboardPrompt,
} from "@/features/tools/prompts/short-video-storyboard-prompts";

type CopyTarget = "script" | "storyboard";

export function PromptStudio({
  project,
}: {
  project: Pick<Project, "name" | "description" | "topics">;
}) {
  const [source, setSource] = useState("");
  const [scriptResponse, setScriptResponse] = useState("");
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const scriptPrompt = source.trim()
    ? buildShortVideoScriptPrompt({ project, source })
    : "";
  const storyboardPrompt = scriptResponse.trim()
    ? buildStickmanStoryboardPrompt({ project, script: scriptResponse })
    : "";

  async function copyPrompt(target: CopyTarget, prompt: string) {
    setCopyError(null);
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard access is unavailable in this browser.");
      }
      await navigator.clipboard.writeText(prompt);
      setCopied(target);
    } catch (error) {
      setCopied(null);
      setCopyError(
        error instanceof Error
          ? error.message
          : "The prompt could not be copied.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="alert alert-info">
        <span>
          This tool does not call AI or save your work. A copied prompt includes
          {` ${project.name}'s `}private Project context and the text you enter;
          review it before sharing it with another AI service.
        </span>
      </div>

      {copyError ? (
        <div className="alert alert-error" role="alert">
          <span>{copyError}</span>
        </div>
      ) : null}

      <details
        className="collapse-arrow border-base-300 bg-base-100 collapse border shadow-sm"
        open
      >
        <summary className="collapse-title text-lg font-semibold">
          Short Video Storyboard
        </summary>
        <div className="collapse-content space-y-8">
          <section aria-labelledby="script-prompt-heading">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase">
                Step 1
              </p>
              <h2
                className="mt-1 text-lg font-semibold"
                id="script-prompt-heading"
              >
                Turn a source story into a short-video script
              </h2>
              <p className="text-base-content/60 mt-1 text-sm leading-6">
                Paste a post or story from any source. The generated prompt asks
                a creative AI director for a faithful script with at least 10
                visually distinct scenes.
              </p>
            </div>

            <label className="form-control mt-5 block">
              <span className="label-text font-medium">
                Source story or post
              </span>
              <textarea
                aria-label="Source story or post"
                className="textarea textarea-bordered mt-2 min-h-44 w-full"
                onChange={(event) => {
                  setSource(event.target.value);
                  setCopied(null);
                }}
                placeholder="Paste the complete source material here…"
                value={source}
              />
            </label>

            <PromptOutput
              copyLabel="Copy script prompt"
              copied={copied === "script"}
              heading="Full script prompt"
              onCopy={() => copyPrompt("script", scriptPrompt)}
              prompt={scriptPrompt}
            />
          </section>

          <div className="divider" />

          <section aria-labelledby="storyboard-prompt-heading">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase">
                Step 2
              </p>
              <h2
                className="mt-1 text-lg font-semibold"
                id="storyboard-prompt-heading"
              >
                Turn the script into a stickman storyboard
              </h2>
              <p className="text-base-content/60 mt-1 text-sm leading-6">
                Paste the AI response from Step 1. The generated prompt locks
                the art style and produces splitter-friendly 9:16 panels.
              </p>
            </div>

            <label className="form-control mt-5 block">
              <span className="label-text font-medium">
                AI scene-script response
              </span>
              <textarea
                aria-label="AI scene-script response"
                className="textarea textarea-bordered mt-2 min-h-44 w-full"
                onChange={(event) => {
                  setScriptResponse(event.target.value);
                  setCopied(null);
                }}
                placeholder="Paste the complete SCENE / VOICEOVER / ON_IMAGE_CAPTION / VISUAL response here…"
                value={scriptResponse}
              />
            </label>

            <PromptOutput
              copyLabel="Copy storyboard prompt"
              copied={copied === "storyboard"}
              heading="Full storyboard image prompt"
              onCopy={() => copyPrompt("storyboard", storyboardPrompt)}
              prompt={storyboardPrompt}
            />
          </section>
        </div>
      </details>
    </div>
  );
}

function PromptOutput({
  copyLabel,
  copied,
  heading,
  onCopy,
  prompt,
}: {
  copyLabel: string;
  copied: boolean;
  heading: string;
  onCopy: () => void;
  prompt: string;
}) {
  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium">{heading}</h3>
        <button
          className="btn btn-primary btn-sm"
          disabled={!prompt}
          onClick={onCopy}
          type="button"
        >
          {copied ? "Copied" : copyLabel}
        </button>
      </div>
      <textarea
        aria-label={heading}
        className="textarea textarea-bordered bg-base-200 mt-2 min-h-72 w-full font-mono text-xs leading-5"
        placeholder="Enter the required text above to build this prompt."
        readOnly
        value={prompt}
      />
    </div>
  );
}
