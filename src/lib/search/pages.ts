import { site } from "@/lib/site";
import { writingHref, writings } from "@/lib/writings";

export type SearchPage = {
  /** The page's path, which also identifies it. */
  href: string;
  title: string;
  /** Before anything is typed, the menu lists pages under this heading, in the order they first appear here. */
  group: string;
  icon: "avatar" | "document";
  /** Shown at the right edge, e.g. a writing's date. */
  tag?: string;
  /** Shown under the title when the match is in the title or keywords rather than the text. */
  description?: string;
  /** Words to find the page by that don't appear on it, e.g. "blog" for Writings. */
  keywords?: string[];
  /** Everything the page says, one passage per paragraph or item. A result quotes the passage that matched. */
  content: string[];
};

// Everything the command menu can find. A new page joins the search by adding an entry here; one that renders from
// data, like a writing, should build its entry from that data so the two can't drift apart. Lists of links to other
// pages are left out of `content`, as those pages have entries of their own.
export const searchPages: SearchPage[] = [
  {
    href: "/",
    title: "Home",
    group: "Pages",
    icon: "avatar",
    description: site.description,
    keywords: ["about", "bio", "profile", "portfolio", "contact", "socials"],
    // The homepage's copy is JSX in src/app/page.tsx (and the footer), so it's repeated here. Update both together.
    content: [
      `${site.name}, Software Engineer`,
      "I’m the founder of Jayer, where I’m building a design canvas to design your whole foundation for your site foundation using both AI and human touch, then exporting it to a full codebase over which people can use their existing ai tools to build more complex features over that foundation.",
      "Jayer: A design canvas that turns your site’s design into a full codebase.",
      "I’ve officially worked with the Framer team where I have been involved in creating content & resources for their upcoming updates, testing unreleased features, updates to provide opinions and feedbacks. I’ve also helped them by finding and reporting severe bugs.",
      "Apart from that I am also a verified Framer Pro Expert and have independently made over $50K with Framer templates, client works & distribution.",
      "Framer: A website builder for designers, from first draft to published site.",
      "Currently I am learning Final Cut Pro and creating content on social media platforms in order to analyse and learn content that goes viral and keeps the viewers psychologically hooked so they don’t lose attention and at the same time receive some value from that content.",
      "Recents: Jayer, building a website design app that converts design into full codebase.",
      "Recents: Final Cut Pro, started editing video so I can study and create viral content.",
      "Recents: YouTube, doing this as I realised the world now heavily depends on content.",
      "YouTube: I Am Becoming Jethalal!",
      "Based in Ahmedabad, India. Find me on Email, YouTube, LinkedIn and Twitter.",
    ],
  },
  {
    href: "/writings",
    title: "Writings",
    group: "Pages",
    icon: "document",
    description: "Everything I’ve written.",
    keywords: ["blog", "articles", "posts", "essays", "notes"],
    content: [],
  },
  ...writings.map((writing): SearchPage => ({
    href: writingHref(writing.slug),
    title: writing.title,
    group: "Writings",
    icon: "document",
    tag: writing.tag,
    // The date is searchable too, so "november" or "2026" finds what was published then.
    keywords: [writing.tag, "writing", "article", "post"],
    content: writing.body,
  })),
];
