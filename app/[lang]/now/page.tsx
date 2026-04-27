import { notFound } from "next/navigation";

// /now page removed by design.
// File kept for git history; renders a 404 to fully hide the route.
export default function NowPage() {
  notFound();
}
