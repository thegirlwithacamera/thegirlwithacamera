import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">
              THE GIRL WITH A CAMERA
            </h3>
            <p className="text-[#a3a3a3] text-sm leading-relaxed">
              Photographe & Créatrice de contenu<br />
              Basée à Paris
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4">NAVIGATION</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/portfolio" className="text-[#a3a3a3] hover:text-white transition-colors">
                  Portfolio Photos
                </Link>
              </li>
              <li>
                <Link href="/creation" className="text-[#a3a3a3] hover:text-white transition-colors">
                  Création de contenu
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#a3a3a3] hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-[#a3a3a3] hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#a3a3a3] hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm tracking-wide mb-4">SUIVEZ-MOI</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.instagram.com/sandrinecppns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#a3a3a3] hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#262626] mt-8 pt-8 text-center text-[#a3a3a3] text-sm">
          <p>&copy; {new Date().getFullYear()} The Girl With A Camera. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
