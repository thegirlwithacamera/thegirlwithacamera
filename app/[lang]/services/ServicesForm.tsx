"use client";

import { useState } from "react";

// Formulaire de la page Services. Il poste sur /api/contact, la route qui
// existait déjà et qui envoie par Resend. Il remplace le simple mailto :
// un lien mailto donne un mail vide, ce formulaire donne un brief.
//
// Champs volontairement courts. Chaque champ ajouté est un visiteur perdu,
// et le budget reste facultatif : on ne fait pas fuir une maison qui ne sait
// pas encore ce qu'elle veut dépenser.

type Lang = "fr" | "en";

const T = {
  fr: {
    name: "Nom",
    email: "E-mail",
    company: "Établissement",
    type: "Type de lieu",
    city: "Ville et dates envisagées",
    budget: "Budget",
    message: "Ce que vous voulez montrer",
    send: "Envoyer",
    sending: "Envoi...",
    ok: "Message reçu. Je réponds sous quelques jours.",
    err: "L'envoi a échoué. Écrivez-moi à hello@thegirlwithacamera.com.",
    types: [
      ["hospitality", "Hôtel ou maison d'hôtes"],
      ["restaurant", "Restaurant ou bar"],
      ["brand", "Marque"],
      ["editorial", "Éditorial ou documentaire"],
      ["press", "Presse"],
      ["other", "Autre"],
    ],
    budgets: [
      ["tbd", "À discuter"],
      ["under-2k", "Moins de 2 000 €"],
      ["2-5k", "2 000 à 5 000 €"],
      ["5-15k", "5 000 à 15 000 €"],
      ["15k+", "Plus de 15 000 €"],
    ],
  },
  en: {
    name: "Name",
    email: "Email",
    company: "Establishment",
    type: "Type of place",
    city: "City and possible dates",
    budget: "Budget",
    message: "What you want to show",
    send: "Send",
    sending: "Sending...",
    ok: "Message received. I answer within a few days.",
    err: "Sending failed. Write to hello@thegirlwithacamera.com.",
    types: [
      ["hospitality", "Hotel or guesthouse"],
      ["restaurant", "Restaurant or bar"],
      ["brand", "Brand"],
      ["editorial", "Editorial or documentary"],
      ["press", "Press"],
      ["other", "Other"],
    ],
    budgets: [
      ["tbd", "To be discussed"],
      ["under-2k", "Under €2,000"],
      ["2-5k", "€2,000 to €5,000"],
      ["5-15k", "€5,000 to €15,000"],
      ["15k+", "Over €15,000"],
    ],
  },
} as const;

export default function ServicesForm({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          type: data.get("type"),
          budget: data.get("budget"),
          deadline: data.get("deadline"),
          message: data.get("message"),
          lang,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("ok");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return <p className="form-note">{t.ok}</p>;
  }

  return (
    <form className="services-form" onSubmit={onSubmit}>
      <label>
        <span>{t.name}</span>
        <input name="name" type="text" required maxLength={200} />
      </label>
      <label>
        <span>{t.email}</span>
        <input name="email" type="email" required />
      </label>
      <label>
        <span>{t.company}</span>
        <input name="company" type="text" maxLength={200} />
      </label>
      <label>
        <span>{t.type}</span>
        <select name="type" defaultValue="hospitality">
          {t.types.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label>
        <span>{t.city}</span>
        <input name="deadline" type="text" maxLength={200} />
      </label>
      <label>
        <span>{t.budget}</span>
        <select name="budget" defaultValue="tbd">
          {t.budgets.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className="is-full">
        <span>{t.message}</span>
        <textarea name="message" required rows={5} maxLength={5000} />
      </label>
      <div className="is-full form-actions">
        <button type="submit" disabled={state === "sending"}>
          {state === "sending" ? t.sending : t.send}
        </button>
        {state === "error" && <p className="form-note is-error">{t.err}</p>}
      </div>
    </form>
  );
}
