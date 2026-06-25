interface SaltmineVisionCardProps {
  children: React.ReactNode;
}

export function SaltmineVisionCard({ children }: SaltmineVisionCardProps) {
  return (
    <div className="w-full max-w-[420px] rounded-[32px] bg-white px-8 py-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
}

export const SALTMINE_VISION_CARD_COPY =
  "Direction that could add value into Saltmine's long-term product vision";
