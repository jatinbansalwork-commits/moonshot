"use client";

import type { ReactNode } from "react";
import { Slide17Screen } from "@/components/slider/slide-screens/slide-17-screen";
import { Slide18Screen } from "@/components/slider/slide-screens/slide-18-screen";
import { Slide19Screen } from "@/components/slider/slide-screens/slide-19-screen";
import { Slide20DeckDayScreen } from "@/components/slider/slide-screens/slide-20-deck-day-screen";
import { Slide20PodClusterScreen } from "@/components/slider/slide-screens/slide-20-pod-cluster-screen";
import { Slide20TeamListScreen } from "@/components/slider/slide-screens/slide-20-team-list-screen";
import { Slide21Screen } from "@/components/slider/slide-screens/slide-21-screen";
import { Slide22Screen } from "@/components/slider/slide-screens/slide-22-screen";
import { Slide23Screen } from "@/components/slider/slide-screens/slide-23-screen";
import { Slide24Screen } from "@/components/slider/slide-screens/slide-24-screen";
import { Slide25MobileScreen } from "@/components/slider/slide-screens/slide-25-mobile-screen";
import { Slide39Screen } from "@/components/slider/slide-screens/slide-39-screen";
import { Slide40Screen } from "@/components/slider/slide-screens/slide-40-screen";
import { Slide41Screen } from "@/components/slider/slide-screens/slide-41-screen";
import { Slide44Screen } from "@/components/slider/slide-screens/slide-44-screen";
import { Slide45Screen } from "@/components/slider/slide-screens/slide-45-screen";
import type { SlideScopedEmbedVariant } from "@/types/slide-content";

export function renderSaltmineSlideScreen(variant: SlideScopedEmbedVariant): ReactNode {
  switch (variant) {
    case "slide-17":
      return <Slide17Screen />;
    case "slide-18":
      return <Slide18Screen />;
    case "slide-19":
      return <Slide19Screen />;
    case "slide-20-deck-day":
      return <Slide20DeckDayScreen />;
    case "slide-20-pod-cluster":
      return <Slide20PodClusterScreen />;
    case "slide-20-team-list":
      return <Slide20TeamListScreen />;
    case "slide-21":
      return <Slide21Screen />;
    case "slide-22":
      return <Slide22Screen />;
    case "slide-23":
      return <Slide23Screen />;
    case "slide-24":
      return <Slide24Screen />;
    case "slide-25-mobile":
      return <Slide25MobileScreen />;
    case "slide-39":
      return <Slide39Screen />;
    case "slide-40":
      return <Slide40Screen />;
    case "slide-41":
      return <Slide41Screen />;
    case "slide-44":
      return <Slide44Screen />;
    case "slide-45":
      return <Slide45Screen />;
    default:
      return null;
  }
}
