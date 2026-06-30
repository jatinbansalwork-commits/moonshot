"use client";

import Link from "next/link";
import { FOCUS_RING } from "@/lib/a11y";
import { getSlideDeckIndex } from "@/lib/slide-content";
import {
  SALTMINE_DEV_FLOW_GROUPS,
  SALTMINE_DEV_UTILITIES,
  type SaltmineDevFlow,
} from "@/lib/saltmine-dev-flows";

function deckHref(slideId: string | undefined): string | null {
  if (!slideId) return null;
  const index = getSlideDeckIndex(slideId);
  if (index === undefined) return null;
  return `/?slide=${index}`;
}

function FlowCard({ flow }: { flow: SaltmineDevFlow }) {
  const inDeck = deckHref(flow.deckSlideId);

  return (
    <article className="rounded-xl border border-[#DFE3E8] bg-white p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <h3 className="m-0 text-[15px] font-semibold text-[#1C252E]">{flow.label}</h3>
        {flow.tags?.length ? (
          <ul className="m-0 flex list-none flex-wrap gap-1 p-0" aria-label="Tags">
            {flow.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-[#E8F2FF] px-2 py-0.5 text-[10px] font-semibold text-[#006FEC]"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <p className="m-0 mb-3 text-[13px] leading-relaxed text-[#637381]">{flow.description}</p>
      {(flow.screenFile || flow.configFile) && (
        <p className="m-0 mb-3 text-[11px] leading-relaxed text-[#919EAB]">
          {flow.screenFile ? (
            <>
              <code className="rounded bg-[#F4F6F8] px-1 py-0.5 font-mono text-[10px] text-[#1C252E]">
                {flow.screenFile}
              </code>
            </>
          ) : null}
          {flow.configFile ? (
            <>
              {flow.screenFile ? " · " : null}
              <code className="rounded bg-[#F4F6F8] px-1 py-0.5 font-mono text-[10px] text-[#1C252E]">
                {flow.configFile}
              </code>
            </>
          ) : null}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {flow.devPath ? (
          <Link
            href={flow.devPath}
            className={`inline-flex min-h-9 items-center rounded-lg bg-[#006FEC] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#0056C7] ${FOCUS_RING}`}
          >
            Open dev preview
          </Link>
        ) : null}
        {inDeck ? (
          <Link
            href={inDeck}
            className={`inline-flex min-h-9 items-center rounded-lg border border-[#DFE3E8] bg-white px-3 text-[12px] font-semibold text-[#1C252E] transition-colors hover:border-[#006FEC]/40 hover:bg-[#F4F8FF] ${FOCUS_RING}`}
          >
            View in deck
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function SaltmineFlowsDevSheet() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-[#EEF2F6] px-6 py-10">
      <header className="mb-10">
        <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#637381]">
          Saltmine Sync
        </p>
        <h1 className="m-0 mt-1 text-2xl font-bold tracking-tight text-[#1C252E]">
          Dev sheet — all flows
        </h1>
        <p className="m-0 mt-3 max-w-2xl text-[14px] leading-relaxed text-[#637381]">
          Isolated previews for every Saltmine surface in the deck. Each screen lives in its own
          file under{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">slide-screens/</code> so
          edits to one slide do not affect others.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {SALTMINE_DEV_FLOW_GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`flow-group-${group.id}`}>
            <h2
              id={`flow-group-${group.id}`}
              className="m-0 text-[17px] font-bold text-[#1C252E]"
            >
              {group.title}
            </h2>
            <p className="m-0 mt-1 mb-4 text-[13px] leading-relaxed text-[#637381]">
              {group.description}
            </p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {group.flows.map((flow) => (
                <li key={flow.id}>
                  <FlowCard flow={flow} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="flow-utilities">
          <h2 id="flow-utilities" className="m-0 text-[17px] font-bold text-[#1C252E]">
            Shared data & copy
          </h2>
          <p className="m-0 mt-1 mb-4 text-[13px] leading-relaxed text-[#637381]">
            Central files that feed multiple flows.
          </p>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {SALTMINE_DEV_UTILITIES.map((item) => (
              <li key={item.label}>
                <article className="rounded-xl border border-[#DFE3E8] bg-white p-4 shadow-sm">
                  <h3 className="m-0 text-[15px] font-semibold text-[#1C252E]">{item.label}</h3>
                  <p className="m-0 mt-1 mb-2 text-[13px] leading-relaxed text-[#637381]">
                    {item.description}
                  </p>
                  {item.file ? (
                    <p className="m-0 mb-3">
                      <code className="rounded bg-[#F4F6F8] px-1.5 py-0.5 font-mono text-[10px] text-[#1C252E]">
                        {item.file}
                      </code>
                    </p>
                  ) : null}
                  <Link
                    href={item.href}
                    className={`inline-flex min-h-9 items-center rounded-lg border border-[#DFE3E8] bg-white px-3 text-[12px] font-semibold text-[#1C252E] transition-colors hover:border-[#006FEC]/40 hover:bg-[#F4F8FF] ${FOCUS_RING}`}
                  >
                    Open
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
