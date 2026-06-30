"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, Mail, Sparkles, Trash2 } from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CARD_CLASS = "bg-white border border-zinc-200 shadow-sm rounded-xl p-4";
const FIELD_CLASS = `w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`;

type EmailGroup = {
  category: string;
  domain: string;
  emails: string[];
};

function tokenizeRawInput(raw: string): string[] {
  return raw
    .split(/[\s,;\t\n\r]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

function extractDomainLabel(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase().replace(/^www\./, "") ?? "";
  const labels = domain.split(".");
  const registrableLabel = labels.length >= 2 ? labels[labels.length - 2] : labels[0];
  if (!registrableLabel) return "Unknown";

  if (registrableLabel.length <= 3) {
    return registrableLabel.toUpperCase();
  }

  return registrableLabel.charAt(0).toUpperCase() + registrableLabel.slice(1).toLowerCase();
}

function parseAndGroupEmails(rawInput: string): EmailGroup[] {
  const seen = new Set<string>();
  const bucketMap = new Map<string, EmailGroup>();

  for (const token of tokenizeRawInput(rawInput)) {
    const normalized = token.toLowerCase();
    if (!isValidEmail(normalized) || seen.has(normalized)) continue;

    seen.add(normalized);
    const category = extractDomainLabel(normalized);
    const domain = normalized.split("@")[1] ?? "";
    const existing = bucketMap.get(category);

    if (existing) {
      existing.emails.push(normalized);
    } else {
      bucketMap.set(category, { category, domain, emails: [normalized] });
    }
  }

  return Array.from(bucketMap.values())
    .map((group) => ({
      ...group,
      emails: [...group.emails].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

export default function EmailHelperPage() {
  const [rawInput, setRawInput] = useState("");
  const [copiedCategory, setCopiedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groups = useMemo(() => parseAndGroupEmails(rawInput), [rawInput]);
  const totalEmails = useMemo(
    () => groups.reduce((sum, group) => sum + group.emails.length, 0),
    [groups],
  );

  useEffect(() => {
    if (groups.length === 0) {
      setSelectedCategory("");
      return;
    }

    setSelectedCategory((current) =>
      groups.some((group) => group.category === current)
        ? current
        : groups[0].category,
    );
  }, [groups]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleClear = useCallback(() => {
    setRawInput("");
    setSubject("");
    setBody("");
    setSelectedCategory("");
    setCopiedCategory(null);
  }, []);

  const handleCopy = useCallback(async (category: string, emails: string[]) => {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopiedCategory(category);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedCategory(null), 2000);
    } catch {
      setCopiedCategory(null);
    }
  }, []);

  const handleSendGroupEmail = useCallback(() => {
    const groupEmails =
      groups.find((group) => group.category === selectedCategory)?.emails ?? [];
    if (groupEmails.length === 0) return;

    // mailto: URLs have browser length limits (~2,000 chars); large BCC lists may truncate.
    const bccList = groupEmails.join(",");
    window.location.href = `mailto:?bcc=${bccList}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [body, groups, selectedCategory, subject]);

  const selectedGroupEmails =
    groups.find((group) => group.category === selectedCategory)?.emails ?? [];
  const canSend = selectedCategory.length > 0 && selectedGroupEmails.length > 0;

  return (
    <main className="grid min-h-screen grid-cols-1 gap-6 bg-zinc-50 p-6 text-zinc-900 lg:grid-cols-3">
      <section className={CARD_CLASS}>
        <header className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
            <Sparkles className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-900">
              Raw Ingestion
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Paste messy spreadsheet rows. Emails are cleaned, validated, and
              deduplicated instantly.
            </p>
          </div>
        </header>

        <label htmlFor="raw-email-input" className="sr-only">
          Paste raw email data
        </label>
        <textarea
          id="raw-email-input"
          rows={12}
          value={rawInput}
          onChange={(event) => setRawInput(event.target.value)}
          placeholder="Paste emails from Google Sheets — commas, tabs, and new lines all work."
          className={`${FIELD_CLASS} resize-y font-mono`}
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-600" aria-live="polite">
            <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
              {totalEmails} email{totalEmails === 1 ? "" : "s"}
            </span>
            <span className="mx-2 text-zinc-300" aria-hidden>
              ·
            </span>
            <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
              {groups.length} categor{groups.length === 1 ? "y" : "ies"}
            </span>
          </p>

          <button
            type="button"
            onClick={handleClear}
            className={`inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Clear
          </button>
        </div>
      </section>

      <section className={CARD_CLASS}>
        <header className="mb-4">
          <h2 className="text-base font-semibold text-zinc-900">
            Categorized Buckets
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Copy-ready groups organised by company domain.
          </p>
        </header>

        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {groups.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
              Valid email groups will appear here after you paste data on the
              left.
            </p>
          ) : (
            groups.map((group) => {
              const isCopied = copiedCategory === group.category;

              return (
                <article
                  key={group.category}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {group.category}
                    </h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">
                      {group.emails.length}
                    </span>
                  </div>

                  <ul className="mb-3 max-h-32 space-y-1 overflow-y-auto text-sm text-zinc-600">
                    {group.emails.map((email) => (
                      <li key={email} className="truncate font-mono text-xs">
                        {email}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => handleCopy(group.category, group.emails)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 ${FOCUS_RING}`}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-emerald-600" aria-hidden />
                    ) : (
                      <Clipboard className="h-4 w-4" aria-hidden />
                    )}
                    {isCopied ? "Copied!" : "Copy All Emails"}
                  </button>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className={CARD_CLASS}>
        <header className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
            <Mail className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Quick-Compose Mailto
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Launch your email client with recipients in BCC for privacy.
            </p>
          </div>
        </header>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSendGroupEmail();
          }}
        >
          <div>
            <label
              htmlFor="email-category"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Company category
            </label>
            <select
              id="email-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              disabled={groups.length === 0}
              className={FIELD_CLASS}
            >
              {groups.length === 0 ? (
                <option value="">No categories yet</option>
              ) : (
                groups.map((group) => (
                  <option key={group.category} value={group.category}>
                    {group.category} ({group.emails.length})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="email-subject"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Email subject line
            </label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label
              htmlFor="email-body"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Message body
            </label>
            <textarea
              id="email-body"
              rows={8}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your outreach message..."
              className={`${FIELD_CLASS} resize-y`}
            />
          </div>

          <button
            type="submit"
            disabled={!canSend}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 ${FOCUS_RING}`}
          >
            <Mail className="h-4 w-4" aria-hidden />
            Send Group Email
          </button>
        </form>
      </section>
    </main>
  );
}
