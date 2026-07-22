"use client";

import { useActionState, useState } from "react";

import { ErrorToast } from "@/backoffice/components/ui/error-toast";
import { defaultLocale, supportedLocales } from "@/config/supported-locales";
import {
  generateVideoStoryboardAction,
  renderVideoAction,
  type VideoCreatorActionState,
} from "@/features/videos/backoffice/video-actions.server";
import { QuickListVideoPreview } from "@/features/videos/backoffice/quick-list-video-preview";
import type { QuickListVideoProposal } from "@/features/videos/model/quick-list-video";

export function VideoCreator({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [generation, generateAction, generating] = useActionState<
    VideoCreatorActionState,
    FormData
  >(generateVideoStoryboardAction, null);
  const [rendering, renderAction, renderingPending] = useActionState<
    VideoCreatorActionState,
    FormData
  >(renderVideoAction, null);
  const [editedProposal, setEditedProposal] =
    useState<QuickListVideoProposal | null>(null);
  const [locale, setLocale] = useState(defaultLocale);

  const proposal = editedProposal ?? generation?.proposal ?? null;

  if (!proposal || !generation?.videoId) {
    return (
      <form action={generateAction} className="space-y-6">
        <ErrorToast message={generation?.error} />
        <input name="projectId" type="hidden" value={projectId} />
        <section className="card border-base-300 bg-base-100 border shadow-sm">
          <div className="card-body gap-5 p-5 sm:p-7">
            <div>
              <h2 className="card-title">Three-point TikTok video</h2>
              <p className="text-base-content/60 mt-1 text-sm">
                Enter one idea. ANMISOFT creates a hook, three useful points,
                narration, and a posting pack.
              </p>
            </div>
            <label className="fieldset">
              <span className="fieldset-legend">Video idea</span>
              <textarea
                className="textarea min-h-32 w-full"
                maxLength={2000}
                name="prompt"
                placeholder="Example: Three mistakes people make when identifying jewelry"
                required
              />
            </label>
            <div className="grid gap-5 md:grid-cols-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Content context</legend>
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    className="radio radio-primary radio-sm"
                    defaultChecked
                    name="sourceMode"
                    type="radio"
                    value="project"
                  />
                  Use {projectName} context
                </label>
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    className="radio radio-primary radio-sm"
                    name="sourceMode"
                    type="radio"
                    value="free-topic"
                  />
                  Free topic
                </label>
              </fieldset>
              <label className="fieldset">
                <span className="fieldset-legend">Language</span>
                <select
                  className="select w-full"
                  name="locale"
                  onChange={(event) => setLocale(event.target.value)}
                  value={locale}
                >
                  {supportedLocales.map((item) => (
                    <option key={item.locale} value={item.locale}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="fieldset">
              <span className="fieldset-legend">Optional images</span>
              <input
                accept="image/jpeg,image/png"
                className="file-input w-full"
                multiple
                name="images"
                type="file"
              />
              <span className="label text-base-content/55">
                Up to three JPEG or PNG images, 5 MB each.
              </span>
            </label>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  className="toggle toggle-primary"
                  defaultChecked
                  name="narrationEnabled"
                  type="checkbox"
                />
                Generate voice narration
              </label>
              <label className="fieldset">
                <span className="fieldset-legend">Voice</span>
                <select className="select w-full" name="voiceGender">
                  <option value="NEUTRAL">Automatic</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-primary min-w-44"
                disabled={generating}
                type="submit"
              >
                {generating ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : null}
                {generating ? "Generating…" : "Generate storyboard"}
              </button>
            </div>
          </div>
        </section>
      </form>
    );
  }

  const imageSources = (generation.assets ?? []).map(
    (_, index) =>
      `/api/admin/projects/${projectId}/videos/${generation.videoId}/artifact?kind=input&index=${index}`,
  );
  const updatePoint = (
    index: number,
    field: "heading" | "body" | "narration",
    value: string,
  ) =>
    setEditedProposal({
      ...proposal,
      points: proposal.points.map((point, pointIndex) =>
        pointIndex === index ? { ...point, [field]: value } : point,
      ) as QuickListVideoProposal["points"],
    });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <form action={renderAction} className="space-y-5">
        <ErrorToast message={rendering?.error} />
        <input name="projectId" type="hidden" value={projectId} />
        <input name="videoId" type="hidden" value={generation.videoId} />
        <input name="proposal" type="hidden" value={JSON.stringify(proposal)} />
        <section className="card border-base-300 bg-base-100 border shadow-sm">
          <div className="card-body gap-5 p-5 sm:p-7">
            <div>
              <h2 className="card-title">Review storyboard</h2>
              <p className="text-base-content/60 mt-1 text-sm">
                This proposal is not saved until you explicitly render it.
              </p>
            </div>
            <label className="fieldset">
              <span className="fieldset-legend">Hook</span>
              <input
                className="input w-full"
                maxLength={80}
                onChange={(event) =>
                  setEditedProposal({
                    ...proposal,
                    hook: {
                      ...proposal.hook,
                      onScreenText: event.target.value,
                    },
                  })
                }
                value={proposal.hook.onScreenText}
              />
              <textarea
                className="textarea mt-2 w-full"
                maxLength={140}
                onChange={(event) =>
                  setEditedProposal({
                    ...proposal,
                    hook: { ...proposal.hook, narration: event.target.value },
                  })
                }
                value={proposal.hook.narration}
              />
            </label>
            {proposal.points.map((point, index) => (
              <fieldset
                className="border-base-300 rounded-box grid gap-3 border p-4"
                key={index}
              >
                <legend className="px-2 font-semibold">
                  Point {index + 1}
                </legend>
                <input
                  className="input w-full"
                  maxLength={55}
                  onChange={(event) =>
                    updatePoint(index, "heading", event.target.value)
                  }
                  value={point.heading}
                />
                <textarea
                  className="textarea w-full"
                  maxLength={130}
                  onChange={(event) =>
                    updatePoint(index, "body", event.target.value)
                  }
                  value={point.body}
                />
                <textarea
                  className="textarea w-full"
                  maxLength={180}
                  onChange={(event) =>
                    updatePoint(index, "narration", event.target.value)
                  }
                  value={point.narration}
                />
              </fieldset>
            ))}
            <label className="fieldset">
              <span className="fieldset-legend">Call to action</span>
              <input
                className="input w-full"
                maxLength={65}
                onChange={(event) =>
                  setEditedProposal({
                    ...proposal,
                    cta: { ...proposal.cta, onScreenText: event.target.value },
                  })
                }
                value={proposal.cta.onScreenText}
              />
              <textarea
                className="textarea mt-2 w-full"
                maxLength={140}
                onChange={(event) =>
                  setEditedProposal({
                    ...proposal,
                    cta: { ...proposal.cta, narration: event.target.value },
                  })
                }
                value={proposal.cta.narration}
              />
            </label>
            <div className="flex justify-end">
              <button
                className="btn btn-primary min-w-40"
                disabled={renderingPending}
                type="submit"
              >
                {renderingPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : null}
                {renderingPending ? "Rendering on Mac…" : "Render video"}
              </button>
            </div>
          </div>
        </section>
      </form>
      <aside className="mx-auto w-full max-w-[360px] min-w-0 xl:sticky xl:top-6 xl:mx-0 xl:self-start">
        <QuickListVideoPreview
          imageSources={imageSources}
          locale={locale}
          proposal={proposal}
        />
        <p className="text-base-content/55 mt-3 text-center text-xs">
          Preview audio is muted. Narration is generated during rendering.
        </p>
      </aside>
    </div>
  );
}
