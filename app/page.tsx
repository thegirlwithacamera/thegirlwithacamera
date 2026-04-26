import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootPage() {
  // Use Accept-Language to send users to their preferred locale.
  const h = await headers();
  const accept = (h.get("accept-language") ?? "").toLowerCase();
  const target = accept.startsWith("fr") ? "/fr" : "/en";
  redirect(target);
}
