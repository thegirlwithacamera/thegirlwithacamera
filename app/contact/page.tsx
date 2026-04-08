export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Contact
          </h1>
          <p className="text-[#737373] text-lg max-w-2xl mx-auto">
            Un projet ? Une collaboration ? N'hésitez pas à me contacter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold mb-6">
              Parlons de votre projet
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm tracking-wide mb-2">
                  EMAIL
                </h3>
                <a
                  href="mailto:hello@thegirlwithacamera.com"
                  className="text-[#525252] hover:text-black transition-colors"
                >
                  hello@thegirlwithacamera.com
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-sm tracking-wide mb-2">
                  RÉSEAUX SOCIAUX
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.instagram.com/sandrinecppns/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#525252] hover:text-black transition-colors"
                    >
                      Instagram @sandrinecppns
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-sm tracking-wide mb-2">
                  LOCALISATION
                </h3>
                <p className="text-[#525252]">Paris, France</p>
                <p className="text-[#737373] text-sm mt-1">
                  Déplacements possibles
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white"
                  placeholder="Votre projet"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors bg-white resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-3 bg-black text-white text-sm font-medium tracking-wide hover:bg-[#333] transition-colors"
              >
                ENVOYER
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
