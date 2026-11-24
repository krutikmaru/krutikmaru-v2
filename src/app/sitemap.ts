import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { writingHref, writings } from "@/lib/writings";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/writings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...writings.map((writing) => ({
      url: `${site.url}${writingHref(writing.slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
