// ─────────────────────────────────────────────────────────────
// Texte de fond des pages de catégorie, sous la grille des cas.
//
// C'est ce qui les positionne sur "photographe d'hôtel", "photographe de
// restaurant", "photographe de voyage" : une page de vignettes sans un mot
// ne se classe sur rien. Écrit le 08/09, raccourci de moitié le jour même :
// deux paragraphes suffisent au référencement, et sur une page qui montre
// trois photos, trois paragraphes prenaient le dessus sur les images. Ce qui
// touche à la licence et aux déplacements vit sur Services, pas ici.
//
// Règles tenues ici comme ailleurs : aucun prix, aucun matériel nommé,
// jamais "illimité" sans "organique", et la licence reste attachée à
// l'adresse photographiée.
// ─────────────────────────────────────────────────────────────

export type CategoryCopy = { title: string; body: string[]; meta: string };

export const CATEGORY_COPY: Record<string, Record<"fr" | "en", CategoryCopy>> = {
  hospitality: {
    fr: {
      title: "Photographe d'hôtel et de maison d'hôtes",
      meta: "Photographe d'hôtel et de maison d'hôtes. Chambres, espaces communs et équipe, en lumière naturelle, entre six et neuf heures du matin. Basée à Bruxelles, en déplacement partout dans le monde.",
      body: [
        "Je photographie des maisons qui reçoivent, en ville comme à la campagne : hôtels, maisons d'hôtes, chalets. Le travail se fait entre six et neuf heures du matin, quand le bâtiment est vide et que la lumière entre encore de biais dans les chambres.",
        "Chambres, salles de bain, espaces communs, petit déjeuner, et les gestes de ceux qui font tourner la maison. Rien n'est déplacé, rien n'est ajouté. Une chambre libre le matin suffit.",
      ],
    },
    en: {
      title: "Hotel and guesthouse photographer",
      meta: "Hotel and guesthouse photographer. Rooms, common spaces and team, in natural light, between six and nine in the morning. Based in Brussels, travelling worldwide.",
      body: [
        "I photograph houses that welcome people, in cities and out in the country: hotels, guesthouses, chalets. The work happens between six and nine in the morning, when the building is empty and the light still comes into the rooms at an angle.",
        "Rooms, bathrooms, common spaces, breakfast, and the gestures of the people who keep the house running. Nothing is moved, nothing is added. One room free in the morning is enough.",
      ],
    },
  },
  restaurants: {
    fr: {
      title: "Photographe de restaurant et de bar",
      meta: "Photographe de restaurant et de bar. La salle, la carte et le service photographiés en lumière existante, pendant que la table vit. Bruxelles, Liège, et partout ailleurs.",
      body: [
        "Je photographie des tables et des bars pendant le service, en lumière existante. Pas de flash braqué sur une assiette, pas de décor monté.",
        "La salle avant qu'elle se remplisse, les verres, les mains, les plats au moment où ils sortent de la cuisine. Une demi-journée suffit pour une adresse.",
      ],
    },
    en: {
      title: "Restaurant and bar photographer",
      meta: "Restaurant and bar photographer. The room, the menu and the service photographed in existing light, while the table is alive. Brussels, Liège, and anywhere else.",
      body: [
        "I photograph tables and bars during service, in the light that is there. No flash aimed at a plate, no set built for the occasion.",
        "The room before it fills up, the glasses, the hands, the dishes as they come out of the kitchen. Half a day is enough for one address.",
      ],
    },
  },
  travel: {
    fr: {
      title: "Photographe de voyage et de destination",
      meta: "Photographe de voyage et de destination pour les offices du tourisme, les régions et les compagnies de train. Les villes à cinq heures du matin, les marchés avant la foule.",
      body: [
        "Une ville regardée à cinq heures du matin, les marchés avant la foule, les rues avant qu'elles se remplissent. Le même regard que dans les maisons, sans mise en scène.",
        "Pour un office du tourisme, une région, une compagnie de train, ou une maison qui veut montrer où elle se trouve autant que ce qu'elle est. Photo et film sur le même passage.",
      ],
    },
    en: {
      title: "Travel and destination photographer",
      meta: "Travel and destination photographer for tourism boards, regions and rail companies. Cities at five in the morning, markets before the crowd.",
      body: [
        "A city at five in the morning, the markets before the crowd, the streets before they fill. The same way of looking as inside the houses, with nothing staged.",
        "For a tourism board, a region, a rail company, or a house that wants to show where it stands as much as what it is. Stills and film on the same visit.",
      ],
    },
  },
};
