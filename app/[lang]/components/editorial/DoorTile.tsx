import Image from "next/image";
import Link from "next/link";
import s from "./DoorTile.module.css";

// Grande tuile paysage avec un mot en italique : Film, À propos.
export default function DoorTile({
  href,
  cover,
  word,
  coverPosition,
}: {
  href: string;
  cover?: string;
  word: string;
  coverPosition?: string;
}) {
  return (
    <Link href={href} className={s.door}>
      {cover && (
        <Image
          src={cover}
          alt=""
          width={1066}
          height={1600}
          sizes="(max-width: 767px) 100vw, 600px"
          quality={72}
          style={{ objectPosition: coverPosition ?? "50% 40%" }}
        />
      )}
      <span className={s.veil} />
      <span className={s.word}>{word}</span>
    </Link>
  );
}
