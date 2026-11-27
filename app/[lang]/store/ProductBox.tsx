import s from './ProductBox.module.css';

interface Props {
  front: string;
  spine: string;
  alt: string;
  /** Couleur du dos. */
  color: string;
  /** Couleur des cotes sans visuel (droite, dessus, dessous). Par defaut : color. */
  edge?: string;
  /** Epaisseur, en fraction de la largeur de la face (0.15 = boitier, 0.07 = livre). */
  depth?: number;
  /** Decalage du mouvement, pour que deux produits ne bougent pas en meme temps. */
  delay?: number;
}

// Produit en vrai 3D (CSS) : face avant + tranche. Il oscille doucement tout
// seul, en continu, sans dependre de la souris.
export default function ProductBox({ front, spine, alt, color, edge, depth = 0.15, delay = 0 }: Props) {
  return (
    <div
      className={s.scene}
      style={{
        ['--box-color' as string]: color,
        ['--box-edge' as string]: edge ?? color,
        ['--depth' as string]: depth,
        ['--delay' as string]: `${delay}s`,
      }}
    >
      <div className={s.shadow} aria-hidden />
      <div className={s.box}>
        <img className={s.front} src={front} alt={alt} draggable={false} />
        <img className={s.spine} src={spine} alt="" aria-hidden draggable={false} />
        <span className={s.back} aria-hidden />
        <span className={s.right} aria-hidden />
        <span className={s.top} aria-hidden />
        <span className={s.bottom} aria-hidden />
        <span className={s.sheen} aria-hidden />
      </div>
    </div>
  );
}
