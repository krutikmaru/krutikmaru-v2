import { searchPages } from "@/lib/search/pages";

// The command menu's index, fetched the first time it's about to open, so no page carries the whole site's text.
// It only reads the site's own content, so it's prerendered at build time.
export function GET() {
  return Response.json(searchPages, { headers: { "X-Robots-Tag": "noindex" } });
}
