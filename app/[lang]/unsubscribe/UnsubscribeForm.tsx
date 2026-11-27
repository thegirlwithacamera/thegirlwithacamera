'use client';

import { useState } from 'react';
import s from '../links/links.module.css';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') return <p className={s.emailDone}>Done. You are unsubscribed.</p>;

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
          {status === 'loading' ? '...' : 'Unsubscribe'}
        </button>
      </form>
      {status === 'error' && <p className={s.emailError}>Something went wrong. Try again.</p>}
    </>
  );
}
