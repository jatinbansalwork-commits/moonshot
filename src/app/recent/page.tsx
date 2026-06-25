import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/** Legacy `/recent` alias — projects section removed. */
export default function RecentPage() {
  redirect(ROUTES.home);
}
