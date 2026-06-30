"use client";

import {
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  Car,
  Check,
  Clock,
  DoorOpen,
  LampDesk,
  ListOrdered,
  MapPin,
  Monitor,
  Repeat,
  ShieldCheck,
  Users,
} from "lucide-react";
import { FOCUS_RING } from "@/lib/a11y";
import type { FuturePlanFlowId } from "@/lib/future-plan-flow-content";
import { SALTMINE, SALTMINE_HAIRLINE } from "@/lib/saltmine-onboarding-tokens";
import {
  FutureUiBadge,
  FutureUiBanner,
  FutureUiCard,
  FutureUiRow,
} from "@/components/slider/slide-screens/future-ui-primitives";

const TEXT_2XS = "text-[8px] leading-[11px]";
const TEXT_MICRO = "text-[7px] leading-[10px]";

export function FuturePlanStepPanel({
  flowId,
  stepId,
}: {
  flowId: FuturePlanFlowId;
  stepId: string;
}) {
  switch (flowId) {
    case "last-minute":
      return <LastMinuteStepPanel stepId={stepId} />;
    case "safety-booking":
      return <SafetyBookingStepPanel stepId={stepId} />;
    case "cab-booking":
      return <CabBookingStepPanel stepId={stepId} />;
    case "false-booking":
      return <FalseBookingStepPanel stepId={stepId} />;
    case "recurring":
      return <RecurringStepPanel stepId={stepId} />;
    case "commute":
      return <CommuteStepPanel stepId={stepId} />;
    case "waitlist":
      return <WaitlistStepPanel stepId={stepId} />;
    default:
      return null;
  }
}

function LastMinuteStepPanel({ stepId }: { stepId: string }) {
  if (stepId === "entry") {
    return (
      <FutureUiCard title="How you got here">
        <FutureUiRow icon={Calendar} label="Today's timeline" detail="Tap · Coming in today?" status="Entry" statusTone="brand" />
        <p className={`m-0 mt-1.5 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          Last-minute lane opens at 07:00 and closes at 10:00 for same-day arrivals.
        </p>
      </FutureUiCard>
    );
  }
  if (stepId === "inventory") {
    return (
      <FutureUiCard title="Ranked availability">
        <div className="flex flex-col gap-1.5">
          <FutureUiRow icon={LampDesk} label="Desk · Floor 3" detail="Open plan" status="Full" statusTone="danger" />
          <FutureUiRow icon={DoorOpen} label="Pod B" detail="4 seats · until 12:00" status="1 left" statusTone="warning" />
          <FutureUiRow icon={Car} label="Parking B2" detail="Basement" status="Full" statusTone="danger" />
          <FutureUiRow icon={Car} label="Cab pickup" detail="Corporate fleet" status="Full" statusTone="danger" />
        </div>
      </FutureUiCard>
    );
  }
  if (stepId === "waitlist") {
    return (
      <>
        <FutureUiBanner tone="warning">Pod B held while you wait for Desk 4B</FutureUiBanner>
        <FutureUiCard title="Waitlist queue">
          <FutureUiRow icon={ListOrdered} label="Desk 4B" detail="Position #2 · auto-assign on release" status="#2" statusTone="brand" />
          <FutureUiRow icon={Clock} label="Est. release" detail="09:45 if no check-in" status="Soon" statusTone="warning" />
          <FutureUiRow icon={Users} label="Notify pod" detail="Design pod · inbound alert" status="Ready" />
        </FutureUiCard>
      </>
    );
  }
  return (
    <FutureUiCard title="Day plan summary">
      <FutureUiRow icon={DoorOpen} label="Pod B" detail="09:30–12:00 · confirmed" status="Booked" statusTone="success" />
      <FutureUiRow icon={ListOrdered} label="Desk waitlist" detail="#2 · Desk 4B" status="Active" statusTone="brand" />
      <FutureUiRow icon={MapPin} label="Teammates" detail="Design pod notified" status="Sent" statusTone="success" />
    </FutureUiCard>
  );
}

function SafetyBookingStepPanel({ stepId }: { stepId: string }) {
  if (stepId === "reminder") {
    return (
      <FutureUiCard title="Today's trip">
        <FutureUiBanner tone="warning">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" aria-hidden />
            Confirm by 09:30 or desk and cab auto-release
          </span>
        </FutureUiBanner>
        <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Booked 08:15 · safety hold" status="Held" statusTone="brand" />
        <FutureUiRow icon={Car} label="Cab pickup" detail="08:15 · linked to desk" status="Held" statusTone="brand" />
      </FutureUiCard>
    );
  }
  if (stepId === "checkin") {
    return (
      <FutureUiCard title="Check in">
        <p className={`m-0 mb-2 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          Confirm you are on your way — waitlist will not receive your desk while in transit.
        </p>
        <FutureUiRow icon={MapPin} label="Your ETA" detail="~09:10 based on commute" status="On track" statusTone="success" />
      </FutureUiCard>
    );
  }
  if (stepId === "strikes") {
    return (
      <FutureUiCard title="Strike pattern">
        <FutureUiRow icon={ShieldCheck} label="Reliability" detail="Release early to earn priority" status="Good" statusTone="success" />
        <div className="mt-2 rounded-[8px] border px-2 py-1.5" style={{ borderColor: SALTMINE_HAIRLINE }}>
          <p className={`m-0 mb-1 font-semibold ${TEXT_MICRO}`} style={{ color: SALTMINE.text }}>
            Missed check-ins (90 days)
          </p>
          <div className="flex items-center gap-1" aria-label="2 of 3 strikes">
            <span className="h-2 w-6 rounded-full bg-[#DC2626]" aria-hidden />
            <span className="h-2 w-6 rounded-full bg-[#DC2626]" aria-hidden />
            <span className="h-2 w-6 rounded-full bg-[#DFE3E8]" aria-hidden />
          </div>
        </div>
      </FutureUiCard>
    );
  }
  return (
    <FutureUiCard title="Confirmed">
      <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Checked in 08:52" status="Secure" statusTone="success" />
      <FutureUiRow icon={Clock} label="Valid until" detail="18:00 today" status="Active" />
    </FutureUiCard>
  );
}

function CabBookingStepPanel({ stepId }: { stepId: string }) {
  const steps = [
    { id: "desk", label: "Desk 4B", done: stepId !== "desk" },
    { id: "cab", label: "Move 08:15", done: stepId === "confirm" },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-1">
        {steps.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1.5 rounded-[6px] px-1.5 py-1"
            style={{
              backgroundColor: item.done ? "rgba(34, 197, 94, 0.08)" : item.id === stepId ? "rgba(0, 111, 236, 0.06)" : "transparent",
              border: item.id === stepId ? `1px solid ${SALTMINE.primary}` : `1px solid transparent`,
            }}
          >
            {item.done ? <Check className="h-3 w-3 text-[#15803D]" aria-hidden /> : null}
            <span className={`font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {stepId === "cab" || stepId === "confirm" ? (
        <FutureUiCard title="Pickup options">
          <FutureUiRow icon={Car} label="08:15" detail="Suggested · matches first meeting" status="Selected" statusTone="brand" />
          <FutureUiRow icon={MapPin} label="Route" detail="Home → Saltmine HQ" />
        </FutureUiCard>
      ) : null}
    </div>
  );
}

function FalseBookingStepPanel({ stepId }: { stepId: string }) {
  if (stepId === "signal") {
    return (
      <>
        <FutureUiBanner tone="warning">
          Calendar · 10:00 stand-up changed to remote
        </FutureUiBanner>
        <FutureUiCard title="Tentative hold">
          <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Auto-releases in 3h 20m" status="Tentative" statusTone="warning" />
        </FutureUiCard>
      </>
    );
  }
  if (stepId === "confirm") {
    return (
      <FutureUiCard title="Release desk">
        <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Tentative hold" status="Release" statusTone="warning" />
        <FutureUiRow icon={Users} label="Waitlist" detail="1 colleague can use it" status="Ready" statusTone="brand" />
      </FutureUiCard>
    );
  }
  return (
    <FutureUiCard title="Released">
      <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Returned to pool" status="Free" statusTone="success" />
      <FutureUiRow icon={Users} label="Waitlist" detail="1 colleague notified" status="Sent" statusTone="brand" />
    </FutureUiCard>
  );
}

function RecurringStepPanel({ stepId }: { stepId: string }) {
  if (stepId === "pattern") {
    return (
      <FutureUiCard title="Weekly pattern">
        <div className="mb-2 flex flex-wrap gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
            const active = day === "Tue" || day === "Thu";
            return (
              <span
                key={day}
                className={`min-h-6 min-w-[34px] rounded-[6px] border px-1.5 text-center font-semibold leading-6 ${TEXT_2XS}`}
                style={{
                  borderColor: active ? SALTMINE.primary : SALTMINE_HAIRLINE,
                  backgroundColor: active ? "rgba(0, 111, 236, 0.1)" : "#fff",
                  color: active ? SALTMINE.primary : SALTMINE.textMuted,
                }}
              >
                {day}
              </span>
            );
          })}
        </div>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" defaultChecked className={`h-3 w-3 rounded border ${FOCUS_RING}`} readOnly />
          <span className={`font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            Skip holidays and OOO weeks
          </span>
        </label>
      </FutureUiCard>
    );
  }
  if (stepId === "resources") {
    return (
      <FutureUiCard title="Linked resources">
        <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Every Tue & Thu" status="Primary" statusTone="brand" />
        <FutureUiRow icon={Car} label="Parking B2-14" detail="Same pattern" status="Linked" statusTone="success" />
      </FutureUiCard>
    );
  }
  if (stepId === "preview") {
    return (
      <FutureUiCard title="Series preview">
        {[
          { date: "Tue 1 Jul", note: "Booked" },
          { date: "Thu 3 Jul", note: "Booked" },
          { date: "Tue 8 Jul", note: "Skipped — bank holiday" },
        ].map((item) => (
          <div key={item.date} className="flex items-center justify-between py-0.5">
            <span className={`font-medium ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
              {item.date}
            </span>
            <span className={TEXT_MICRO} style={{ color: SALTMINE.textMuted }}>
              {item.note}
            </span>
          </div>
        ))}
      </FutureUiCard>
    );
  }
  return (
    <FutureUiCard title="Ready to save">
      <FutureUiRow icon={Repeat} label="Pattern" detail="Tue & Thu until 31 Aug" status="12 dates" statusTone="brand" />
      <FutureUiRow icon={CalendarDays} label="Notifications" detail="Weekly summary before each week" />
    </FutureUiCard>
  );
}

function CommuteStepPanel({ stepId }: { stepId: string }) {
  if (stepId === "signal") {
    return (
      <FutureUiCard title="Signals we used">
        <FutureUiRow icon={Clock} label="Commute" detail="75 min door to door" status="High" statusTone="warning" />
        <FutureUiRow icon={Calendar} label="Morning density" detail="3 meetings before 12:00" status="Dense" statusTone="brand" />
      </FutureUiCard>
    );
  }
  if (stepId === "compare") {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        <FutureUiCard title="Office">
          <FutureUiBadge tone="warning">Tight</FutureUiBadge>
          <p className={`m-0 mt-1 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            Arrive ~10:15
          </p>
        </FutureUiCard>
        <section className="rounded-[10px] border-2 bg-white p-2" style={{ borderColor: SALTMINE.primary }}>
          <FutureUiBadge tone="success">Suggested</FutureUiBadge>
          <p className={`m-0 mt-1 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
            Remote · on time
          </p>
        </section>
      </div>
    );
  }
  if (stepId === "travel") {
    return (
      <FutureUiCard title="If you choose office later">
        <FutureUiRow icon={Car} label="Cab pickup" detail="08:15 · corporate account" status="Ready" statusTone="brand" />
        <FutureUiRow icon={Bell} label="ETA slip alert" detail="Warn pod if past 10:00" status="On" statusTone="success" />
      </FutureUiCard>
    );
  }
  return (
    <FutureUiCard title="Plan set">
      <FutureUiRow icon={Monitor} label="Remote AM" detail="Until 13:00" status="Active" statusTone="success" />
      <FutureUiRow icon={Building2} label="Office PM" detail="Optional — we will nudge" status="Open" />
    </FutureUiCard>
  );
}

function WaitlistStepPanel({ stepId }: { stepId: string }) {
  if (stepId === "join") {
    return (
      <FutureUiCard title="Preferred desk">
        <FutureUiRow icon={LampDesk} label="Desk 4B" detail="Floor 3 · taken until check-in" status="Join queue" statusTone="brand" />
        <p className={`m-0 mt-1.5 ${TEXT_2XS}`} style={{ color: SALTMINE.textMuted }}>
          3 people already waiting — fair queue, not first to refresh.
        </p>
      </FutureUiCard>
    );
  }
  if (stepId === "queue") {
    return (
      <>
        <FutureUiCard title="Queue">
          <div className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full font-bold text-[13px]"
              style={{ backgroundColor: "rgba(0, 111, 236, 0.12)", color: SALTMINE.primary }}
            >
              2
            </div>
            <p className={`m-0 font-semibold ${TEXT_2XS}`} style={{ color: SALTMINE.text }}>
              You are #2 for Desk 4B
            </p>
          </div>
        </FutureUiCard>
        <FutureUiCard title="Fallback while waiting">
          <FutureUiRow icon={LampDesk} label="Hot-desk zone C" detail="3 free now" status="Optional" statusTone="success" />
        </FutureUiCard>
      </>
    );
  }
  if (stepId === "offer") {
    return (
      <FutureUiBanner>
        <span className="flex items-center gap-1">
          <Bell className="h-3 w-3 shrink-0" aria-hidden />
          Missed check-in cleared · auto-assign in 4:58
        </span>
      </FutureUiBanner>
    );
  }
  return (
    <FutureUiCard title="Assigned">
      <FutureUiRow icon={LampDesk} label="Desk 4B" detail="From waitlist · 09:35" status="Yours" statusTone="success" />
      <FutureUiRow icon={LampDesk} label="Fallback Pod C" detail="Released — no double book" status="Freed" statusTone="brand" />
    </FutureUiCard>
  );
}
