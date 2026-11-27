'use client';

import s from "./media-kit.module.css";

// Pour envoyer le media kit en piece jointe : le navigateur l'enregistre en PDF.
export default function PrintButton() {
  return (
    <button type="button" className={s.print} onClick={() => window.print()}>
      Save as PDF
    </button>
  );
}
