export type Book = {
  title: string;
  slug: string;
  cover: string;
  coverW: number;
  coverH: number;
  year: number | null; // [VERIFY WITH NIKHIL] — not publicly listed anywhere in his shop
  description: string;
  price: number;
  format: string | null;
  pages: number | null;
  bestseller?: boolean;
  award?: string;
  previewImages: string[]; // inner spreads — none available yet, placeholder until supplied
  purchaseUrl: string; // live dm2buy product page — interim checkout until the in-site Razorpay flow ships
};

// Sourced directly from nikhil.dm2buy.com (his live storefront) — prices in INR,
// descriptions are his own verbatim copy. Do not invent facts not present there.
export const BOOKS: Book[] = [
  {
    title: "Akela",
    slug: "akela",
    cover: "/covers/cutout/akela.png",
    coverW: 514,
    coverH: 656,
    year: null,
    description: "what the f*ck is a banana? — a dialogue describing a banana to an alien. Featured at Serendipity Arts Festival 2023.",
    price: 399,
    format: null,
    pages: null,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/9371775a52c9f86a4eb8787cb2b89b6e",
  },
  {
    title: "Turning to the Sun",
    slug: "turning-to-the-sun",
    cover: "/covers/cutout/turning-to-the-sun.png",
    coverW: 513,
    coverH: 653,
    year: null,
    description:
      "Written under trees, across waterfalls, sitting on dewy grass, and always under the gold of the sun. Poems about the brief moments of clarity gifted by the world on a 6-month backpacking journey. “A physical actual real thing you can hold, hug, lay under the sun with and read without feeling the urge to scroll every 10 seconds.”",
    price: 350,
    format: "Handbook size",
    pages: null,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/1TNDod7IwKByXKOh74wIOZ",
  },
  {
    title: "Lonely Blue Dot",
    slug: "lonely-blue-dot",
    cover: "/covers/cutout/lonely-blue-dot.png",
    coverW: 513,
    coverH: 653,
    year: null,
    description: "Poems about life under our great blue blanket.",
    price: 450,
    format: "Novel size / Zine size",
    pages: null,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/21kztqicMbfpED1SYY4qKc",
  },
  {
    title: "Everything Happens for a Season",
    slug: "everything-happens-for-a-season",
    cover: "/covers/cutout/everything-happens-for-a-season.png",
    coverW: 515,
    coverH: 653,
    year: null,
    description:
      "A collection of poems and personal essays. A quest to move forward by looking back — family, friendships, the dew on grass, the chatter of birds, living and dying, and dying to live. Contains the essay “Vidya Devi,” republished on Blahcksheep.",
    price: 350,
    format: "Zine size",
    pages: 24,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/7KIdgF0ReEH2o2Hhl3tZvR",
  },
  {
    title: "This Should've Been a Tweet",
    slug: "this-shouldve-been-a-tweet",
    cover: "/covers/cutout/this-shouldve-been-a-tweet.png",
    coverW: 662,
    coverH: 481,
    year: null,
    description: "A real life shitpost made with the care imparted for one's labour of love.",
    price: 350,
    format: "Zine size / Chiclet size",
    pages: null,
    bestseller: true,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/2nyIe1ZYEp6PGpKo9gvLOM",
  },
  {
    title: "mumbai minimal",
    slug: "mumbai-minimal",
    cover: "/covers/cutout/mumbai-minimal.png",
    coverW: 513,
    coverH: 653,
    year: null,
    description:
      "Mumbai, where every street is spilling out to the footpaths and every local train is bursting at its seams. No corner unlittered, no wall unspat at. But if you look hard enough, you'll find the soft edges: a minimal view of a maximalist melting pot.",
    price: 399,
    format: null,
    pages: null,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/6QDE3PurJ49C4Wmkv6cLvN",
  },
  {
    title: "Insert Feelings Here",
    slug: "insert-feelings-here",
    cover: "/covers/cutout/insert-feelings-here.png",
    coverW: 510,
    coverH: 652,
    year: null,
    description:
      "Love never looks the same twice. Every reader sees a different poem, and attaches it to a different face. Insert Feelings Here is yours to colour, yours to write on and shape however you want.",
    price: 399,
    format: null,
    pages: null,
    award: "Bazinega Poetry Award 2024",
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/1129da681cca982cda91a991ede792bc",
  },
];
