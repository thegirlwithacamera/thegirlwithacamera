'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from './links.module.css';

type Status = 'idle' | 'loading' | 'done' | 'error';

// Inscription aux nouveautes du shop par email. Meme route que le reste du site
// (/api/newsletter, liste Resend). La mention de consentement est sous le
// champ, avec le lien de desinscription et la politique de confidentialite.
export default function EmailForm({ lang }: { lang: 'fr' | 'en' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang, source: 'links' }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return <p className={s.emailDone}>You are in. I will write when something new comes out.</p>;
  }

  return (
    <>
      <form className={s.form} onSubmit={onSubmit}>
        <input
          className={s.input}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Your email"
        />
        <button className={s.button} type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'error' && <p className={s.emailError}>Something went wrong. Try again.</p>}
      <p className={s.consent}>
        By subscribing, you agree to receive an email when I release something new in the shop. Your address is only
        used for that and is never shared. You can <Link href="/en/unsubscribe">unsubscribe</Link> at any time. <Link href="/en/privacy-policy">Privacy policy</Link>.
      </p>
    </>
  );
}
