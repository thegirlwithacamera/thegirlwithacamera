import { NextResponse } from "next/server";
import { latestInstagramTiles } from "@/lib/instagram";

// Les cinq derniers posts du compte, servis a la bande de l'accueil.
// L'accueil est une page statique (elle lit public/images avec fs au build),
// donc elle ne peut pas aller chercher le flux elle-meme sans devenir une
// page a la demande, ou public/ n'existe pas. Le flux passe donc par cette
// route, generee au build et rafraichie toutes les heures. Un appel Meta par
// heure au maximum, quel que soit le trafic.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const tiles = await latestInstagramTiles(5);
  return NextResponse.json({ tiles });
}
