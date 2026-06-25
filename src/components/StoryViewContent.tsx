"use client";

import { motion } from "framer-motion";
import { RetroAnimatedText } from "@/components/RetroAnimatedText";
import type { FlashbackStory } from "@/lib/flashback-stories";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface StoryViewContentProps {
  story: FlashbackStory;
}

function StorySubtitle({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <p className="mt-[42px] text-center font-sans text-base leading-6 text-[#212B36]">
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </p>
  );
}

/** Single flashback story frame — isolated from timer index elsewhere. */
export function StoryViewContent({ story }: StoryViewContentProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      key={story.id}
      className="flex w-full flex-col items-center justify-center"
      aria-label={`Flashback story: ${story.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", damping: 28, stiffness: 320 }
      }
    >
      <p className="w-full text-center font-sans text-[32px] font-bold leading-[48px] tracking-tight text-[#01656B]">
        {story.greeting}
      </p>

      <div className="flex w-full flex-col items-center justify-center">
        {story.hero.kind === "retro-text" ? (
          <RetroAnimatedText text={story.hero.text} />
        ) : (
          <p className="py-6 text-center font-sans text-[72px] font-black leading-none tracking-tight text-[#01656B]">
            {story.hero.text}
          </p>
        )}
        <StorySubtitle text={story.subtitle} />
      </div>
    </motion.div>
  );
}
