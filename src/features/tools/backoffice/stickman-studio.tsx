"use client";

import { useMemo, useState } from "react";

import type { Project } from "@/features/projects/model/project";
import { parseStickmanStoryboardScript } from "@/features/tools/model/stickman-storyboard-script";
import {
  buildShortVideoDescriptionPrompt,
  buildShortVideoScriptPrompt,
  buildStickmanStoryboardPrompt,
} from "@/features/tools/prompts/short-video-storyboard-prompts";

type CopyTarget = "script" | "storyboard" | "description";

export function StickmanStudio({
  project,
}: {
  project: Pick<
    Project,
    "projectId" | "name" | "description" | "voiceTone" | "topics"
  >;
}) {
  const [source, setSource] = useState("");
  const [scriptResponse, setScriptResponse] = useState("");
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  const scriptPrompt = source.trim()
    ? buildShortVideoScriptPrompt({ project, source })
    : "";
  const parsedScript = useMemo(() => {
    if (!scriptResponse.trim()) return null;
    try {
      return parseStickmanStoryboardScript(scriptResponse);
    } catch {
      return null;
    }
  }, [scriptResponse]);
  const storyboardPrompt = parsedScript
    ? buildStickmanStoryboardPrompt({ project, script: parsedScript })
    : "";
  const descriptionPrompt = parsedScript
    ? buildShortVideoDescriptionPrompt({
        project,
        source,
        script: parsedScript,
      })
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
                Turn a source story into storyboard JSON
              </h2>
              <p className="text-base-content/60 mt-1 text-sm leading-6">
                Paste a post or story from any source. The generated prompt asks
                a creative AI director for faithful captions and visuals.
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
              copyLabel="Copy JSON prompt"
              copied={copied === "script"}
              heading="Full JSON-generation prompt"
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
                Paste the JSON response from Step 1. The generated prompt sends
                only the illustrated story scenes to the image AI. Storyboard
                Splitter adds the Project CTA separately.
              </p>
            </div>

            <label className="form-control mt-5 block">
              <span className="label-text font-medium">AI JSON response</span>
              <textarea
                aria-label="AI JSON response"
                className="textarea textarea-bordered mt-2 min-h-44 w-full"
                onChange={(event) => {
                  setScriptResponse(event.target.value);
                  setCopied(null);
                }}
                placeholder="Paste the complete JSON code block here…"
                value={scriptResponse}
              />
            </label>

            {!parsedScript && scriptResponse.trim() ? (
              <div className="alert alert-error mt-4" role="alert">
                <span>
                  Paste the complete JSON code block returned by the Step 1
                  prompt
                </span>
              </div>
            ) : null}

            <PromptOutput
              copyLabel="Copy storyboard prompt"
              copied={copied === "storyboard"}
              heading="Full storyboard image prompt"
              onCopy={() => copyPrompt("storyboard", storyboardPrompt)}
              prompt={storyboardPrompt}
            />
          </section>

          <div className="divider" />

          <section aria-labelledby="description-prompt-heading">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase">
                Step 3
              </p>
              <h2
                className="mt-1 text-lg font-semibold"
                id="description-prompt-heading"
              >
                Write the social-video description
              </h2>
              <p className="text-base-content/60 mt-1 text-sm leading-6">
                This prompt combines the original source, the exact Step 2
                storyboard, Project context, and saved voice and tone. Copy it
                directly into ChatGPT to create the final post description.
              </p>
            </div>

            <PromptOutput
              copyLabel="Copy description prompt"
              copied={copied === "description"}
              heading="Full video-description prompt"
              onCopy={() => copyPrompt("description", descriptionPrompt)}
              prompt={descriptionPrompt}
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
