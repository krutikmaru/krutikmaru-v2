import localFont from "next/font/local";

// Loaded here rather than in the root layout so it's only preloaded on the pages that use it.
export const hafferXH = localFont({
  src: "../fonts/haffer-xh-medium.woff",
  weight: "500",
  display: "swap",
});
