export type Writing = {
  slug: string;
  title: string;
  /** Shown beside the title in lists, e.g. the month it was published. */
  tag: string;
  /** The article's paragraphs, in order. The writings search matches against these too. */
  body: string[];
};

export const writings: Writing[] = [
  {
    slug: "working-with-framer-team",
    title: "Working with the Framer team",
    tag: "November 2026",
    body: [
      "Framer has been more than a tool I use every day. It’s where I learned to design, build and ship websites, for clients, for my own templates and for the products I’m building. Somewhere along the way, I went from using Framer to working with the team behind it.",
      "Most of that work happens before a release goes public. I get access to features while they’re still taking shape, use them on real projects, and share what works, what feels unclear and what could break once thousands of designers start relying on it. It’s a different way of looking at a product: instead of learning a finished feature, you help decide what finished should mean.",
      "Beta testing taught me to be precise. A note like “this feels off” rarely helps anyone, so I’ve learned to describe the exact steps, the expected result and what actually happened, along with why it matters to someone building a real site. The same goes for feature requests: the strongest ones start from a concrete problem I ran into, not from a solution I’d like to see.",
      "Some of the most valuable work has been finding bugs, including a few severe ones, before they reached users. Each report is a small investigation: reproduce the issue, narrow it down to the smallest case, and hand it over in a form the engineers can act on quickly.",
      "Alongside testing, I’ve created content and resources for upcoming updates so people can understand new features from the day they ship. In this article I’ll go through how that collaboration works, what I’ve learned from it, and what it taught me about building products other people depend on.",
    ],
  },
];

export function getWriting(slug: string) {
  return writings.find((writing) => writing.slug === slug);
}

export function writingHref(slug: string) {
  return `/writings/${slug}`;
}
