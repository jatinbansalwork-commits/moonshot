"use client";

import { useCallback, useId, useRef, useState, type DragEvent } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { FOCUS_RING } from "@/lib/a11y";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"] as const;

type CompanyGroup = {
  company: string;
  emails: string[];
};

function isAcceptedFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

function isValidEmail(value: string): boolean {
  return value.includes("@") && value.includes(".");
}

function companyLabelFromEmail(email: string): string {
  const domain = email.split("@")[1]?.split(".")[0] ?? "";
  if (!domain) return "Unknown";

  return domain.length <= 3
    ? domain.toUpperCase()
    : domain.charAt(0).toUpperCase() + domain.slice(1);
}

function categorizeEmails(rawRows: unknown[][]): CompanyGroup[] {
  const uniqueEmails = new Set<string>();
  const categorizedData: Record<string, string[]> = {};

  rawRows.forEach((row) => {
    row.forEach((cell) => {
      const email = String(cell).trim().toLowerCase();
      if (isValidEmail(email)) {
        uniqueEmails.add(email);
      }
    });
  });

  Array.from(uniqueEmails).forEach((email) => {
    const company = companyLabelFromEmail(email);
    if (!categorizedData[company]) {
      categorizedData[company] = [];
    }
    categorizedData[company].push(email);
  });

  return Object.entries(categorizedData)
    .map(([company, emails]) => ({
      company,
      emails: [...emails].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.company.localeCompare(b.company));
}

function processSpreadsheetFile(file: File): Promise<CompanyGroup[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        if (!data) {
          reject(new Error("Could not read file."));
          return;
        }

        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error("Spreadsheet has no sheets."));
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
          header: 1,
        });

        resolve(categorizeEmails(rawRows));
      } catch {
        reject(new Error("Could not parse spreadsheet."));
      }
    };

    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsBinaryString(file);
  });
}

export default function CleanerPage() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [groups, setGroups] = useState<CompanyGroup[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const totalEmails =
    groups?.reduce((sum, group) => sum + group.emails.length, 0) ?? 0;

  const handleFile = useCallback(async (file: File) => {
    if (!isAcceptedFile(file)) {
      setError("Please upload a .csv, .xls, or .xlsx file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processSpreadsheetFile(file);
      setGroups(result);
      setFileName(file.name);
    } catch (readError) {
      setGroups(null);
      setFileName(null);
      setError(
        readError instanceof Error
          ? readError.message
          : "Something went wrong while processing the file.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleFile(file);
      event.target.value = "";
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  const handleReset = useCallback(() => {
    setGroups(null);
    setFileName(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const showUpload = groups === null;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Spreadsheet Email Cleaner
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Upload a spreadsheet to deduplicate emails and group them by company.
          </p>
        </header>

        {showUpload ? (
          <div className="mx-auto max-w-xl">
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="sr-only"
              onChange={handleInputChange}
              disabled={isProcessing}
            />

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload spreadsheet file"
              aria-describedby={`${inputId}-hint`}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center transition-colors hover:bg-zinc-50 ${FOCUS_RING} ${
                isDragging ? "border-zinc-500 bg-zinc-50" : ""
              } ${isProcessing ? "pointer-events-none opacity-70" : ""}`}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                {isProcessing ? (
                  <FileSpreadsheet className="h-5 w-5 animate-pulse" aria-hidden />
                ) : (
                  <Upload className="h-5 w-5" aria-hidden />
                )}
              </div>

              <p className="text-base font-medium text-zinc-900">
                {isProcessing
                  ? "Processing spreadsheet..."
                  : "Drop your spreadsheet here"}
              </p>
              <p id={`${inputId}-hint`} className="mt-2 text-sm text-zinc-500">
                or click to browse — accepts .csv, .xls, and .xlsx
              </p>
            </div>

            {error ? (
              <p className="mt-4 text-center text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-900">{fileName}</p>
                <p className="mt-1 text-sm text-zinc-500" aria-live="polite">
                  {totalEmails} unique email{totalEmails === 1 ? "" : "s"} across{" "}
                  {groups.length} compan{groups.length === 1 ? "y" : "ies"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className={`rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                Upload another file
              </button>
            </div>

            {groups.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-500">
                No valid email addresses were found in this spreadsheet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <article
                    key={group.company}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold text-zinc-900">
                        {group.company}
                      </h2>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        {group.emails.length}
                      </span>
                    </div>

                    <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-zinc-600">
                      {group.emails.map((email) => (
                        <li key={email} className="truncate font-mono text-xs">
                          {email}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
