export interface SampleClaim {
  text: string;
  sourceUrl: string;
  category: string;
}

export const sampleClaims2026: SampleClaim[] = [
  // Real news with accessible source URLs
  {
    text: "Bulgaria adopted the Euro as its currency on January 1, 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Bulgaria_and_the_euro",
    category: "Finance",
  },
  {
    text: "The United States captured Venezuelan President Nicolas Maduro in January 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Nicol%C3%A1s_Maduro",
    category: "World",
  },
  {
    text: "Turkmenistan legalized cryptocurrency mining in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Cryptocurrency_in_Turkmenistan",
    category: "Crypto",
  },
  {
    text: "The 2026 Winter Olympics were held in Milan-Cortina, Italy",
    sourceUrl: "https://en.wikipedia.org/wiki/2026_Winter_Olympics",
    category: "Sports",
  },
  {
    text: "The Super Bowl LX was played in February 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Super_Bowl_LX",
    category: "Sports",
  },
  {
    text: "Zohran Mamdani became mayor of New York City in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Zohran_Mamdani",
    category: "Politics",
  },
  {
    text: "Apple released iPhone 17 in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/IPhone_17",
    category: "Tech",
  },
  {
    text: "NVIDIA became the most valuable company in the world in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Nvidia",
    category: "Tech",
  },
  {
    text: "The James Webb Space Telescope discovered signs of water on an exoplanet",
    sourceUrl: "https://en.wikipedia.org/wiki/James_Webb_Space_Telescope",
    category: "Science",
  },
  {
    text: "Bitcoin reached a new all-time high above $100,000 in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/Bitcoin",
    category: "Crypto",
  },
  {
    text: "The International Space Station was deorbited in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/International_Space_Station",
    category: "Science",
  },
  {
    text: "GPT-5 was released by OpenAI in 2026",
    sourceUrl: "https://en.wikipedia.org/wiki/GPT-5",
    category: "AI",
  },
];

export function getRandomClaim(): SampleClaim {
  const randomIndex = Math.floor(Math.random() * sampleClaims2026.length);
  return sampleClaims2026[randomIndex];
}

export function getRandomClaims(count: number): SampleClaim[] {
  const shuffled = [...sampleClaims2026].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getClaimsByCategory(category: string): SampleClaim[] {
  return sampleClaims2026.filter(
    (claim) => claim.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(): string[] {
  return [...new Set(sampleClaims2026.map((claim) => claim.category))];
}
