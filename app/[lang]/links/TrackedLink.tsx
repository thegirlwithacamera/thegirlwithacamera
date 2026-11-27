'use client';

import Link from 'next/link';

interface Props {
  id: string;
  href: string;
  className?: string;
  external?: boolean;
  /** Nom lu par les lecteurs d'ecran quand le lien ne contient qu'une icone. */
  label?: string;
  children: React.ReactNode;
}

// Adresse du compteur (Worker Cloudflare, voir workers/links). Tant qu'elle
// n'est pas renseignee, le lien marche normalement et rien n'est compte.
const COUNTER = process.env.NEXT_PUBLIC_LINKS_COUNTER_URL ?? "https://tgwac-links.thegirlwithacamera.workers.dev";

// Lien qui signale son clic au compteur. Aucun cookie, aucune donnee sur le
// visiteur : seul le nom du lien et, s'il existe, le parametre ?from= de la
// page (ex. ?from=dm pour le bouton de la machine a commentaires) partent.
export default function TrackedLink({ id, href, className, external, label, children }: Props) {
  const onClick = () => {
    if (!COUNTER) return;
    try {
      const from = new URLSearchParams(window.location.search).get('from') ?? '';
      const url = `${COUNTER}/hit?l=${encodeURIComponent(id)}&from=${encodeURIComponent(from.slice(0, 20))}`;
      if (navigator.sendBeacon) navigator.sendBeacon(url);
      else fetch(url, { method: 'POST', keepalive: true, mode: 'no-cors' });
    } catch {
      // le compteur ne doit jamais empecher le lien de s'ouvrir
    }
  };

  if (external) {
    return (
      <a href={href} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
