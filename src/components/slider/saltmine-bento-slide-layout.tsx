interface BentoMetricCellProps {
  value?: string;
  label: string;
  className?: string;
  labelClassName?: string;
  topContent?: React.ReactNode;
  align?: "left" | "center";
}

function BentoMetricCell({
  value,
  label,
  className = "",
  labelClassName = "",
  topContent,
  align = "left",
}: BentoMetricCellProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`flex min-h-0 flex-col justify-between bg-[#AECDFF] p-6 ${
        isCentered ? "items-center text-center" : "items-start text-left"
      } ${className}`.trim()}
      data-cursor-surface="light"
    >
      <div className={isCentered ? "flex flex-col items-center" : undefined}>
        {topContent ??
          (value ? (
            <span className="index-slide-about-body text-[72px] font-normal leading-none tracking-tight text-black">
              {value}
            </span>
          ) : null)}
      </div>
      <p
        className={`index-slide-about-title m-0 text-[18px] font-normal leading-snug tracking-tight text-black ${labelClassName}`.trim()}
      >
        {label}
      </p>
    </div>
  );
}

/** Slide 8 — Saltmine project metrics bento grid. */
export function SaltmineBentoSlideLayout() {
  return (
    <div
      className="grid h-full w-full select-none grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.35fr)] grid-rows-3 gap-4 bg-[#F2F0F6] p-[50px] text-black antialiased"
      data-cursor-surface="light"
    >
      <BentoMetricCell
        value="1"
        label="Designer"
        className="col-start-1 row-start-1 rounded-[28px]"
      />
      <BentoMetricCell
        value="2"
        label="Product Manager"
        className="col-start-2 row-start-1 rounded-[28px]"
      />
      <BentoMetricCell
        value="1"
        label="Usability audit"
        className="col-start-3 row-start-1 rounded-[28px]"
      />

      <BentoMetricCell
        value="2"
        label="Months"
        className="col-span-2 col-start-1 row-start-2 rounded-[28px]"
      />
      <BentoMetricCell
        label="Touch Points"
        className="col-start-3 row-start-2 rounded-[28px]"
        topContent={
          <div className="flex items-center gap-3" aria-hidden>
            <span className="text-[40px] leading-none">📱</span>
            <span className="text-[40px] leading-none">💻</span>
          </div>
        }
      />

      <BentoMetricCell
        value="16"
        label="Customer & stakeholder interview"
        className="col-span-2 col-start-1 row-start-3 rounded-[28px]"
      />
      <BentoMetricCell
        value="5"
        label="Usability tests"
        className="col-start-3 row-start-3 rounded-[28px]"
      />

      <div
        className="col-start-4 row-span-3 row-start-1 flex min-h-0 flex-col justify-between rounded-[28px] bg-[#AECDFF] p-6"
        data-cursor-surface="light"
      >
        <div>
          <span className="index-slide-about-body block text-[72px] font-normal leading-none tracking-tight text-black">
            2
          </span>
          <p className="index-slide-about-title m-0 mt-2 text-[18px] font-normal leading-snug tracking-tight text-black">
            MVP Prototype
          </p>
        </div>
        <span className="text-[80px] leading-none" aria-hidden>
          🎮
        </span>
      </div>
    </div>
  );
}
