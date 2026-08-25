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
    coverW: 633,
    coverH: 808,
    year: null,
    description: "what the f*ck is a banana? — a dialogue describing a banana to an alien. Featured at Serendipity Arts Festival 2023.",
    price: 399,
    format: null,
    pages: null,
    previewImages: [
      "/previews/akela/01.jpg",
      "/previews/akela/02.jpg",
      "/previews/akela/03.jpg",
      "/previews/akela/04.jpg",
      "/previews/akela/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/cd0951b3bc94e77f1a2990bfa18231dd",
  },
  {
    title: "Turning to the Sun",
    slug: "turning-to-the-sun",
    cover: "/covers/cutout/turning-to-the-sun-v2.png",
    coverW: 633,
    coverH: 808,
    year: null,
    description:
      "Written under trees, across waterfalls, sitting on dewy grass, and always under the gold of the sun. Poems about the brief moments of clarity gifted by the world on a 6-month backpacking journey. “A physical actual real thing you can hold, hug, lay under the sun with and read without feeling the urge to scroll every 10 seconds.”",
    price: 350,
    format: "Handbook size",
    pages: null,
    previewImages: [
      "/previews/turning-to-the-sun/01.jpg",
      "/previews/turning-to-the-sun/02.jpg",
      "/previews/turning-to-the-sun/03.jpg",
      "/previews/turning-to-the-sun/04.jpg",
      "/previews/turning-to-the-sun/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/a555e9085caea7eaae9469076f162254",
  },
  {
    title: "Lonely Blue Dot",
    slug: "lonely-blue-dot",
    cover: "/covers/cutout/lonely-blue-dot.png",
    coverW: 1145,
    coverH: 1400,
    year: null,
    description: "Poems about life under our great blue blanket.",
    price: 399,
    format: "Novel size / Zine size",
    pages: null,
    previewImages: [
      "/previews/lonely-blue-dot/01.jpg",
      "/previews/lonely-blue-dot/02.jpg",
      "/previews/lonely-blue-dot/03.jpg",
      "/previews/lonely-blue-dot/04.jpg",
      "/previews/lonely-blue-dot/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/2a473b0523ca48b45db48e20c977ee7c",
  },
  {
    title: "Everything Happens for a Season",
    slug: "everything-happens-for-a-season",
    cover: "/covers/cutout/everything-happens-for-a-season.png",
    coverW: 633,
    coverH: 808,
    year: null,
    description:
      "A collection of poems and personal essays. A quest to move forward by looking back — family, friendships, the dew on grass, the chatter of birds, living and dying, and dying to live. Contains the essay “Vidya Devi,” republished on Blahcksheep.",
    price: 350,
    format: "Zine size",
    pages: 24,
    previewImages: [
      "/previews/everything-happens-for-a-season/01.jpg",
      "/previews/everything-happens-for-a-season/02.jpg",
      "/previews/everything-happens-for-a-season/03.jpg",
      "/previews/everything-happens-for-a-season/04.jpg",
      "/previews/everything-happens-for-a-season/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/7149beab96f6a719ae4d124e788fcc3d",
  },
  {
    title: "This Should've Been a Tweet",
    slug: "this-shouldve-been-a-tweet",
    cover: "/covers/cutout/this-shouldve-been-a-tweet.png",
    coverW: 570,
    coverH: 449,
    year: null,
    description: "A real life shitpost made with the care imparted for one's labour of love.",
    price: 350,
    format: "Zine size / Chiclet size",
    pages: null,
    bestseller: true,
    previewImages: [
      "/previews/this-shouldve-been-a-tweet/01.jpg",
      "/previews/this-shouldve-been-a-tweet/02.jpg",
      "/previews/this-shouldve-been-a-tweet/03.jpg",
      "/previews/this-shouldve-been-a-tweet/04.jpg",
      "/previews/this-shouldve-been-a-tweet/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/b8e596ceb45d24dffe58cc23e78f895d",
  },
  {
    title: "mumbai minimal",
    slug: "mumbai-minimal",
    cover: "/covers/cutout/mumbai-minimal.png",
    coverW: 898,
    coverH: 1143,
    year: null,
    description:
      "Mumbai, where every street is spilling out to the footpaths and every local train is bursting at its seams. No corner unlittered, no wall unspat at. But if you look hard enough, you'll find the soft edges: a minimal view of a maximalist melting pot.",
    price: 399,
    format: null,
    pages: null,
    previewImages: [
      "/previews/mumbai-minimal/01.jpg",
      "/previews/mumbai-minimal/02.jpg",
      "/previews/mumbai-minimal/03.jpg",
      "/previews/mumbai-minimal/04.jpg",
      "/previews/mumbai-minimal/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/98d54275f3052d5a8feb8137515d906d",
  },
  {
    title: "Insert Feelings Here",
    slug: "insert-feelings-here",
    cover: "/covers/cutout/insert-feelings-here.png",
    coverW: 898,
    coverH: 1143,
    year: null,
    description:
      "Love never looks the same twice. Every reader sees a different poem, and attaches it to a different face. Insert Feelings Here is yours to colour, yours to write on and shape however you want.",
    price: 399,
    format: null,
    pages: null,
    award: "Bazinega Poetry Award 2024",
    previewImages: [
      "/previews/insert-feelings-here/01.jpg",
      "/previews/insert-feelings-here/02.jpg",
      "/previews/insert-feelings-here/03.jpg",
      "/previews/insert-feelings-here/04.jpg",
      "/previews/insert-feelings-here/05.jpg",
    ],
    purchaseUrl: "https://nikhil.dm2buy.com/product/6c5c287fc6106edb0fc2b38710d24aff",
  },
  {
    title: "Productive",
    slug: "productive",
    cover: "/covers/cutout/productive.png",
    coverW: 770,
    coverH: 808,
    year: null,
    description: "A comic on \"productivity\".",
    price: 349,
    format: null,
    pages: null,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/79927c8e67d83fbafa109383d38c8411",
  },
  {
    title: "Swing",
    slug: "swing",
    cover: "/covers/cutout/swing.png",
    coverW: 808,
    coverH: 651,
    year: null,
    description: "A comic about being on a perpetual swing.",
    price: 349,
    format: null,
    pages: null,
    previewImages: [],
    purchaseUrl: "https://nikhil.dm2buy.com/product/fc05123ef1f91b5d5ca5a96b8182c6c6",
  },
];
