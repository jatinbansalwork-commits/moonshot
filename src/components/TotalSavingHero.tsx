import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

interface TotalSavingHeroProps {
  label?: string;
  amount?: string;
}

/** Total savings hero — label + large INR amount. */
export function TotalSavingHero({
  label = "Total Saving",
  amount = "₹6,177.4",
}: TotalSavingHeroProps) {
  const { color, space } = KALASH_VIEW;

  return (
    <div
      style={{
        paddingTop: space.sectionMajor,
        paddingInline: space.headerGutterX,
      }}
    >
      <p
        className="text-[16px] font-medium leading-[22px]"
        style={{ color: color.label, letterSpacing: "0.2px" }}
      >
        {label}
      </p>
      <p
        className="mt-1 font-bold"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 40,
          lineHeight: "60px",
          letterSpacing: "0.5px",
          color: color.text,
          paddingBottom: space.sectionY,
        }}
      >
        {amount}
      </p>
      <div className="mt-0 border-t border-neutral-200/40" aria-hidden />
    </div>
  );
}
