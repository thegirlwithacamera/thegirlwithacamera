import Image from "next/image";
import Link from "next/link";
import s from "./Band.module.css";

// Grande bande photo pleine largeur, un mot au centre et un bouton, sur le
// modèle des portes d'adriana-maria.com (16/09). Sert à l'accueil. Le mot
// reste dans le serif du site, pas en capitales espacées : c'est ce qui
// empêche la page de ressembler à une copie.
export default function Band({
  href,
  image,
  word,
  button,
  position = "50% 50%",
}: {
  href: string;
  image: string;
  word: string;
  button: string;
  position?: string;
}) {
  return (
    <section className={s.band}>
      <Image src={image} alt="" fill sizes="100vw" quality={78} style={{ objectPosition: position }} />
      <span className={s.veil} aria-hidden="true" />
      <div className={s.inner}>
        <h2 className={s.word}>{word}</h2>
        <Link href={href} className={s.button}>{button}</Link>
      </div>
    </section>
  );
}
