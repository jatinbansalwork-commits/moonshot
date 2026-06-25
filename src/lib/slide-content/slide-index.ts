import type { SlideDefinition } from "@/types/slide-content";

const INDEX_ENTRIES = [
  { id: "entry-kalash", label: "Saltmine - Sync", slideIndex: 5 },
  { id: "entry-about", label: "Project 2", slideIndex: 1 },
  { id: "entry-slide-6", label: "Project 4", slideIndex: 6 },
] as const;

export const indexSlide: SlideDefinition = {
  id: "index",
  label: "Work",
  blocks: [
    {
      id: "index-entries",
      type: "list",
      items: INDEX_ENTRIES.map((entry) => ({ ...entry })),
    },
  ],
};
