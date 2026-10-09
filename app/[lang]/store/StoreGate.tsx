'use client';

import { useEffect, useState } from 'react';
import s from './gate.module.css';

// Porte d'entree de la boutique : l'email est demande avant de parcourir
// le store (inscription newsletter via /api/newsletter, Resend dedoublonne
// les contacts existants). Le passage est memorise par navigateur.

const KEY = 'tgwac-store-gate';

const texts = {
  fr: {
    eyebrow: 'The Girl With A Camera',
    title: 'Entre, c’est ouvert.',
    body:
      'Laisse ton email pour entrer dans la boutique. Tu recevras les nouveaux presets et guides en avant-première, et rien d’autre.',
    placeholder: 'ton@email.com',
    cta: 'Entrer',
    sending: 'Un instant…',
    note: 'Pas de spam, désinscription en un clic. Déjà inscrite ? Le même email rouvre la porte.',
    error: 'Cet email n’a pas l’air valide, réessaie.',
    failed: 'Petit souci de connexion, réessaie.',
  },
  en: {
    eyebrow: 'The Girl With A Camera',
    title: 'Come in.',
    body:
      'Leave your email to enter the store. You will get new presets and guides first, and nothing else.',
    placeholder: 'you@email.com',
    cta: 'Enter',
    sending: 'One second…',
    note: 'No spam, one-click unsubscribe. Already subscribed? The same email opens the door.',
    error: 'That email does not look right, try again.',
    failed: 'Small connection issue, try again.',
  },
} as const;

export default function StoreGate({ lang }: { lang: 'fr' | 'en' }) {
  const t = texts[lang];
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error' | 'failed'>('idle');

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      // stockage indisponible : on ne bloque pas la visite
    }
  }, []);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error');
      return;
    }
    setState('sending');
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang }),
      });
      if (!r.ok) throw new Error(String(r.status));
      try {
        localStorage.setItem(KEY, '1');
      } catch {
        // tant pis, la porte restera fermee a la prochaine visite
      }
      setOpen(false);
    } catch {
      setState('failed');
    }
  };

  return (
    <div className={s.veil} role="dialog" aria-modal="true" aria-label={t.title}>
      <div className={s.card}>
        <p className={s.eyebrow}>{t.eyebrow}</p>
        <h2 className={s.title}>{t.title}</h2>
        <p className={s.body}>{t.body}</p>
        <form className={s.form} onSubmit={submit}>
          <input
            className={s.input}
            type="email"
            required
            autoFocus
            placeholder={t.placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === 'error') setState('idle');
            }}
            aria-label="Email"
          />
          <button className={s.cta} type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? t.sending : t.cta}
          </button>
        </form>
        {state === 'error' && <p className={s.error}>{t.error}</p>}
        {state === 'failed' && <p className={s.error}>{t.failed}</p>}
        <p className={s.note}>{t.note}</p>
      </div>
    </div>
  );
}
