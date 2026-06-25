"use client";

import { motion } from "framer-motion";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { springClipReveal } from "@/lib/spring";

interface ClipRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function ClipReveal({
  children,
  delay = 0,
}: ClipRevealProps) {
  const mounted = useIsMounted();

  return (
    <span className="inline-block overflow-hidden pb-[0.14em] align-bottom">
      {mounted ? (
        <motion.span
          className="inline-block will-change-transform"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{
            y: { ...springClipReveal, delay: delay + 0.2 },
          }}
        >
          {children}
        </motion.span>
      ) : (
        <span className="inline-block">{children}</span>
      )}
    </span>
  );
}
