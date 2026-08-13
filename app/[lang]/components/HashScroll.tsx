"use client";

import { useEffect } from "react";

// Défilement fiable vers l'ancre (#travailler-avec-moi) quand on arrive
// depuis une autre page. Le scroll natif du navigateur rate la cible ici
// car le hero se charge apres coup et decale la mise en page ; on re-scrolle
// une fois le layout stabilise. Sans dependance, React seul.
export default function HashScroll() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const t1 = setTimeout(scrollToTarget, 120);
    const t2 = setTimeout(scrollToTarget, 550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
