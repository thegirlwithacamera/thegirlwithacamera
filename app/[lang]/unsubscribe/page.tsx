import type { Metadata } from "next";
import UnsubscribeForm from "./UnsubscribeForm";
import s from "../links/links.module.css";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.eyebrow}>The Girl With A Camera</p>
        <h1 className={s.name}>Unsubscribe</h1>
        <p className={s.role}>Enter your email and you will not hear from me again.</p>
      </header>
      <UnsubscribeForm />
    </main>
  );
}
