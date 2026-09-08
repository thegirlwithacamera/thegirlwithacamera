// ─────────────────────────────────────────────────────────────
// Texte de fond des pages de catégorie, sous la grille des cas.
//
// C'est ce qui les positionne sur "photographe d'hôtel", "photographe de
// restaurant", "photographe de voyage" : une page de vignettes sans un mot
// ne se classe sur rien. Écrit le 08/09.
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
        "Je photographie des maisons qui reçoivent : hôtels de ville, maisons d'hôtes, chalets, adresses de campagne. Le travail commence la veille au soir et se termine le lendemain en fin de matinée, parce que c'est entre six et neuf heures que le bâtiment est vide et que la lumière entre encore de biais dans les chambres.",
        "Sur place, je photographie les chambres et les salles de bain, les espaces communs, l'escalier et les couloirs, le petit déjeuner, et les gestes de ceux qui font tourner la maison. Rien n'est déplacé, rien n'est ajouté. Une chambre libre le matin suffit, et votre équipe peut rester dans le cadre, c'est souvent ce qui fait l'image.",
        "Vous recevez une sélection éditée, prête pour votre site, vos plateformes de réservation et vos réseaux. La licence couvre l'usage organique sans limite de durée pour l'adresse photographiée. Basée à Bruxelles, je me déplace en Belgique et partout dans le monde, et plusieurs adresses d'un même groupe se regroupent volontiers sur un seul déplacement.",
      ],
    },
    en: {
      title: "Hotel and guesthouse photographer",
      meta: "Hotel and guesthouse photographer. Rooms, common spaces and team, in natural light, between six and nine in the morning. Based in Brussels, travelling worldwide.",
      body: [
        "I photograph houses that welcome people: city hotels, guesthouses, chalets, addresses out in the countryside. The work starts the evening before and ends late the next morning, because it is between six and nine that the building is empty and the light still comes into the rooms at an angle.",
        "On location I photograph the rooms and the bathrooms, the common spaces, the staircase and the corridors, breakfast, and the gestures of the people who keep the house running. Nothing is moved, nothing is added. One room free in the morning is enough, and your team can stay in the frame, that is often what makes the picture.",
        "You receive an edited selection, ready for your website, your booking platforms and your social channels. The licence covers organic use with no time limit for the address photographed. Based in Brussels, I travel across Belgium and worldwide, and several addresses in the same group are happily covered on one trip.",
      ],
    },
  },
  restaurants: {
    fr: {
      title: "Photographe de restaurant et de bar",
      meta: "Photographe de restaurant et de bar. La salle, la carte et le service photographiés en lumière existante, pendant que la table vit. Bruxelles, Liège, et partout ailleurs.",
      body: [
        "Je photographie des tables et des bars pendant le service, en lumière existante. Pas de flash braqué sur une assiette, pas de décor monté : la salle telle qu'elle est à l'heure où elle se remplit, les verres, les mains, ce qui sort de la cuisine.",
        "Une demi-journée suffit pour une adresse. On cale l'heure sur votre lumière et sur votre service : le milieu d'après-midi pour la salle vide, le début du service pour l'ambiance, la cuisine quand elle envoie. Les plats sont photographiés au moment où ils sortent, pas reconstitués une heure plus tard.",
        "Vous recevez une sélection éditée pour votre carte, votre site, votre fiche Google et vos réseaux, avec l'usage organique sans limite de durée pour l'adresse photographiée. Je travaille à Bruxelles, à Liège et partout ailleurs. Un hôtel qui tient une table peut réunir la maison et le restaurant sur le même passage.",
      ],
    },
    en: {
      title: "Restaurant and bar photographer",
      meta: "Restaurant and bar photographer. The room, the menu and the service photographed in existing light, while the table is alive. Brussels, Liège, and anywhere else.",
      body: [
        "I photograph tables and bars during service, in the light that is there. No flash aimed at a plate, no set built for the occasion: the room as it is at the hour it fills up, the glasses, the hands, what comes out of the kitchen.",
        "Half a day is enough for one address. We set the hour around your light and your service: mid afternoon for the empty room, the start of service for the atmosphere, the kitchen when it is sending. Dishes are photographed as they come out, not rebuilt an hour later.",
        "You receive an edited selection for your menu, your website, your Google listing and your social channels, with organic use and no time limit for the address photographed. I work in Brussels, in Liège and anywhere else. A hotel with a restaurant can cover the house and the table on the same visit.",
      ],
    },
  },
  travel: {
    fr: {
      title: "Photographe de voyage et de destination",
      meta: "Photographe de voyage et de destination pour les offices du tourisme, les régions et les compagnies de train. Les villes à cinq heures du matin, les marchés avant la foule.",
      body: [
        "Une ville regardée à cinq heures du matin, les marchés avant la foule, les rues avant qu'elles se remplissent. C'est le même regard que dans les maisons : la lumière du lieu, les gens qui y vivent, rien de mis en scène.",
        "Ce travail s'achète comme le reste. Un office du tourisme, une région, une compagnie de train, ou une maison qui veut montrer où elle se trouve autant que ce qu'elle est. Je repère, je marche, je reviens deux ou trois fois au même endroit à des heures différentes, et je rends une série qui tient debout toute seule, pas une collection de cartes postales.",
        "Sur place, la photo et le film se tournent ensemble : une série d'images et un film court de la ville, livrés pour vos canaux, avec l'usage organique sans limite de durée. Basée à Bruxelles, je voyage en train dès que c'est possible, et autrement quand ça ne l'est pas.",
      ],
    },
    en: {
      title: "Travel and destination photographer",
      meta: "Travel and destination photographer for tourism boards, regions and rail companies. Cities at five in the morning, markets before the crowd.",
      body: [
        "A city at five in the morning, the markets before the crowd, the streets before they fill. It is the same way of looking as inside the houses: the light of the place, the people who live there, nothing staged.",
        "This work is bought like the rest. A tourism board, a region, a rail company, or a house that wants to show where it stands as much as what it is. I scout, I walk, I come back to the same corner two or three times at different hours, and I deliver a series that holds together on its own, not a set of postcards.",
        "On location, stills and film are shot together: a series of images and a short city film, delivered for your channels, with organic use and no time limit. Based in Brussels, I travel by train whenever I can, and otherwise when I cannot.",
      ],
    },
  },
};
