export type PostType = "journal" | "lieu" | "technique";

export type Block =
  | { type: "text"; content: string }
  | { type: "image"; src: string; caption?: string };

export interface Post {
  slug: string;
  type: PostType;
  date: string;
  cover: string;
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  body: { fr: Block[]; en: Block[] };
}

export const posts: Post[] = [
  {
    slug: "mestieri-comment-une-serie-nait",
    type: "journal",
    date: "2026-04-01",
    cover: "/images/series/mestieri/cover.jpg",
    title: {
      fr: "Mestieri : comment une série naît d'un marché",
      en: "Mestieri: how a series grows from a market",
    },
    excerpt: {
      fr: "Je ne savais pas que j'allais faire une série. Je voulais juste me promener dans Palerme avec le Ricoh.",
      en: "I didn't know I was going to make a series. I just wanted to walk around Palermo with the Ricoh.",
    },
    body: {
      fr: [
        {
          type: "text",
          content:
            "Je ne savais pas que j'allais faire une série. Je voulais juste me promener dans Palerme avec le Ricoh, sans plan, sans liste de spots à cocher. C'est le marché de Ballarò qui a tout déclenché.",
        },
        {
          type: "text",
          content:
            "Il y avait ce poissonnier. Tablier orange, bottes vertes, une cigarette dans le dos de la main gauche. Il regardait ailleurs. Pas posé — juste absent à lui-même, absorbé par quelque chose qu'on ne voit pas sur la photo. J'ai appuyé.",
        },
        {
          type: "image",
          src: "/images/series/mestieri/cover.jpg",
          caption: "Ballarò, Palerme, mars 2026",
        },
        {
          type: "text",
          content:
            "Après ça j'ai commencé à chercher les mains. Les gestes. Les corps qui travaillent sans se regarder travailler. Il y a quelque chose de très propre là-dedans — une forme de dignité qui n'a pas besoin d'être racontée.",
        },
        {
          type: "text",
          content:
            "Mestieri c'est ça. Pas un reportage social, pas un hommage au petit commerce. Juste des gens qui font, et moi qui essaie de ne pas être dans le chemin.",
        },
      ],
      en: [
        {
          type: "text",
          content:
            "I didn't know I was going to make a series. I just wanted to walk around Palermo with the Ricoh, no plan, no list of spots to tick off. It was the Ballarò market that started everything.",
        },
        {
          type: "text",
          content:
            "There was this fishmonger. Orange apron, green boots, a cigarette held behind his left hand. He was looking elsewhere. Not posing — just absent from himself, absorbed in something you can't see in the photograph. I pressed the shutter.",
        },
        {
          type: "image",
          src: "/images/series/mestieri/cover.jpg",
          caption: "Ballarò, Palermo, March 2026",
        },
        {
          type: "text",
          content:
            "After that I started looking for hands. Gestures. Bodies at work that don't watch themselves work. There's something very clean about that — a form of dignity that doesn't need to be narrated.",
        },
        {
          type: "text",
          content:
            "Mestieri is that. Not a social report, not a tribute to small commerce. Just people doing, and me trying to stay out of the way.",
        },
      ],
    },
  },
  {
    slug: "palerme-6-jours",
    type: "lieu",
    date: "2026-03-20",
    cover: "/images/series/workers/cover.jpg",
    title: {
      fr: "Palerme, 6 jours",
      en: "Palermo, 6 days",
    },
    excerpt: {
      fr: "Ce que personne ne dit sur Palerme c'est que la lumière y est violente. Pas belle — violente.",
      en: "What nobody tells you about Palermo is that the light there is violent. Not beautiful — violent.",
    },
    body: {
      fr: [
        {
          type: "text",
          content:
            "Ce que personne ne dit sur Palerme c'est que la lumière y est violente. Pas belle — violente. Elle entre dans les ruelles comme une intrusion. Les ombres sont dures, les visages surexposés si tu n'es pas au bon endroit au bon moment.",
        },
        {
          type: "text",
          content:
            "J'ai passé les deux premiers jours à me battre contre elle. Ensuite j'ai arrêté d'essayer de la contrôler et j'ai commencé à la suivre.",
        },
        {
          type: "text",
          content:
            "Ballarò le matin tôt, avant que les touristes arrivent. Le port l'après-midi, quand la lumière rasante rend tout un peu cinématographique sans effort. Les marchés qui ferment, les camions qui repartent, les hommes qui restent debout à ne rien faire avec une certaine autorité.",
        },
        {
          type: "image",
          src: "/images/series/workers/cover.jpg",
          caption: "Palerme, mars 2026",
        },
        {
          type: "text",
          content:
            "Je suis revenue avec 340 photos. J'en ai gardé 18. C'est un bon ratio pour moi — ça veut dire que j'ai shooté vite et sélectionné lentement, ce qui est dans l'ordre des choses.",
        },
      ],
      en: [
        {
          type: "text",
          content:
            "What nobody tells you about Palermo is that the light there is violent. Not beautiful — violent. It enters the alleyways like an intrusion. Shadows are hard, faces blown out if you're not in the right place at the right time.",
        },
        {
          type: "text",
          content:
            "I spent the first two days fighting it. Then I stopped trying to control it and started following it instead.",
        },
        {
          type: "text",
          content:
            "Ballarò early in the morning, before the tourists arrive. The harbour in the afternoon, when the raking light makes everything cinematic without trying. Markets closing, trucks pulling away, men standing around doing nothing with a certain authority.",
        },
        {
          type: "image",
          src: "/images/series/workers/cover.jpg",
          caption: "Palermo, March 2026",
        },
        {
          type: "text",
          content:
            "I came back with 340 photos. I kept 18. That's a good ratio for me — it means I shot fast and selected slowly, which is the right order of things.",
        },
      ],
    },
  },
  {
    slug: "ricoh-gr-iii-un-an-apres",
    type: "technique",
    date: "2026-02-10",
    cover: "/images/galerie/R0010544.JPG",
    title: {
      fr: "Ricoh GR IIIx, un an après",
      en: "Ricoh GR IIIx, one year in",
    },
    excerpt: {
      fr: "Je n'écris pas souvent sur le matériel parce que je pense qu'on en parle trop. Mais le GR mérite une exception.",
      en: "I don't write about gear often because I think we talk about it too much. But the GR deserves an exception.",
    },
    body: {
      fr: [
        {
          type: "text",
          content:
            "Je n'écris pas souvent sur le matériel parce que je pense qu'on en parle trop. La plupart des articles gear sont du SEO déguisé en opinion. Mais le GR IIIx mérite une exception, parce que ça fait maintenant un an que c'est le seul appareil dans ma poche et que ça a changé quelque chose dans ma façon de shooter.",
        },
        {
          type: "text",
          content:
            "Ce qui change avec le GR c'est la relation à la distance. 40mm c'est plus long que ce à quoi j'étais habituée (je venais du 28mm), ça oblige à s'approcher différemment. Moins de contexte dans le cadre, plus de sujet. Au début c'est frustrant. Après quelques mois c'est libérateur.",
        },
        {
          type: "image",
          src: "/images/galerie/R0010544.JPG",
          caption: "Bruxelles, 2025",
        },
        {
          type: "text",
          content:
            "Ce que je n'attendais pas c'est l'effet que ça aurait sur ma présence. Un appareil compact sans viseur te force à regarder l'écran ou à shooter à l'instinct. J'ai choisi l'instinct. Je rate plus de photos. Je réussis aussi des photos que je n'aurais jamais tentées avec un reflex sur l'épaule.",
        },
        {
          type: "text",
          content:
            "Est-ce que je recommande le GR ? À des gens qui shootent en street et qui veulent se simplifier la vie : oui, sans hésiter. À quelqu'un qui cherche de la polyvalence : non. C'est un outil avec un point de vue, pas une solution universelle.",
        },
      ],
      en: [
        {
          type: "text",
          content:
            "I don't write about gear often because I think we talk about it too much. Most gear articles are SEO dressed up as opinion. But the GR IIIx deserves an exception, because it's been a year since it became the only camera in my pocket, and it's changed something in how I shoot.",
        },
        {
          type: "text",
          content:
            "What changes with the GR is your relationship to distance. 40mm is longer than what I was used to (I came from 28mm), which forces you to approach things differently. Less context in the frame, more subject. At first it's frustrating. After a few months it's liberating.",
        },
        {
          type: "image",
          src: "/images/galerie/R0010544.JPG",
          caption: "Brussels, 2025",
        },
        {
          type: "text",
          content:
            "What I didn't expect was the effect it would have on my presence. A compact camera with no viewfinder forces you to look at the screen or shoot on instinct. I chose instinct. I miss more shots. I also get shots I never would have attempted with a DSLR on my shoulder.",
        },
        {
          type: "text",
          content:
            "Do I recommend the GR? To people who shoot street and want to simplify their life: yes, without hesitation. To someone looking for versatility: no. It's a tool with a point of view, not a universal solution.",
        },
      ],
    },
  },
];

export const postTypeLabel: Record<PostType, { fr: string; en: string }> = {
  journal: { fr: "Journal de création", en: "Creative journal" },
  lieu: { fr: "Carnet de lieu", en: "Field notes" },
  technique: { fr: "Technique & gear", en: "Technique & gear" },
};

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string, lang: "fr" | "en"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
