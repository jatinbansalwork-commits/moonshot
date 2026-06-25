import { KALASH_VIEW } from "@/lib/kalash-view-tokens";

const PROMO_BANNER_SRC =
  "https://vpocozyaql1wuw3p.public.blob.vercel-storage.com/A_deck/banner.svg";

interface PromoBannerProps {
  onBannerClick?: () => void;
}

/** Kalash Recommendation promo — label + 154px banner card. */
export function PromoBanner({ onBannerClick }: PromoBannerProps) {
  const { color, space } = KALASH_VIEW;

  return (
    <div
      style={{
        paddingTop: space.sectionY,
        paddingInline: space.headerGutterX,
      }}
    >
      <button
        type="button"
        className="relative h-[154px] w-full overflow-hidden rounded-2xl border-0 p-0 text-left"
        style={{
          background: "linear-gradient(to right, #F4EEE2, #F6D5AC)",
          cursor: onBannerClick ? "pointer" : "default",
        }}
        aria-label="Rewind your journey"
        onClick={onBannerClick}
        disabled={!onBannerClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PROMO_BANNER_SRC}
          alt=""
          className="absolute inset-0 size-full object-cover"
          aria-hidden
        />
      </button>
      <p
        className="text-[16px] font-medium leading-[22px]"
        style={{ color: color.label, marginTop: 20 }}
      >
        Kalash Recommendation
      </p>
    </div>
  );
}
