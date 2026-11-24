import MiniSearch, { type Query } from "minisearch";
import { normalize } from "@/lib/normalize";
import type { SearchPage } from "./pages";

/** A run of an excerpt's text, marked when it's a word the search matched. */
export type Segment = { text: string; match: boolean };

export type SearchResult = {
  page: SearchPage;
  /** The passage that matched, cut to the part around the first match. */
  excerpt: Segment[];
};

export type SiteSearch = {
  /** Every page, in the order they're listed, for the menu before anything is typed. */
  pages: SearchPage[];
  /** Pages matching the query, best match first. */
  search(query: string): SearchResult[];
};

// A match in the title counts most, then keywords, then the description, then the text.
const BOOST = { title: 4, keywords: 3, description: 2, content: 1 };

// How much of a passage a result quotes, and how much of it comes before the first match.
const EXCERPT_LENGTH = 160;
const EXCERPT_LEAD = 40;

// Splits on anything that isn't a letter or digit, after normalizing, so "AI-ready" is "ai" and "ready" and "Café"
// is "cafe". A contraction is indexed as its parts and as the parts joined, so "I’m" is "i", "m" and "im". Used for
// the index and for finding matches in excerpts, so the two agree on what a word is.
function tokenize(text: string) {
  const tokens: string[] = [];
  for (const word of normalize(text).split(/[^\p{L}\p{N}']+/u)) {
    const parts = word.split("'").filter(Boolean);
    tokens.push(...parts);
    if (parts.length > 1) tokens.push(parts.join(""));
  }
  return tokens;
}

// A query's words. A contraction is searched joined, so "I’m" and "im" both look for "im" and find "I’m", rather
// than "i" and "m", which are in nearly every passage.
function tokenizeQuery(query: string) {
  return normalize(query)
    .split(/[^\p{L}\p{N}']+/u)
    .map((word) => word.replaceAll("'", ""))
    .filter(Boolean);
}

// A rough English stemmer, used on query words only. Every word is also searched as a prefix, so "tested" becoming
// "test" finds "testing", "tests" and "test" as well. Doubled consonants are undone so "shipped" finds "ship".
function stem(word: string) {
  if (word.length <= 4) return word;
  let base = word;
  if (word.endsWith("ies")) base = `${word.slice(0, -3)}y`;
  else if (word.endsWith("ing")) base = word.slice(0, -3);
  else if (word.endsWith("ed")) base = word.slice(0, -2);
  else if (/(?:[sxz]|[cs]h)es$/.test(word)) base = word.slice(0, -2);
  else if (/[^su]s$/.test(word)) base = word.slice(0, -1);
  if (base !== word && /([^aeiouls])\1$/.test(base)) base = base.slice(0, -1);
  return base.length >= 3 ? base : word;
}

// Each word is searched as typed and as its stem; pages need every word under AND, or any of them under OR. Words
// are searched as prefixes, except single letters once they're followed by another word: while it's still being
// typed, "f" should list what starts with it rather than say there are no results.
function toQuery(words: string[], combineWith: "AND" | "OR"): Query {
  return {
    combineWith,
    queries: words.map((word, index) => {
      const base = stem(word);
      return {
        combineWith: "OR",
        prefix: word.length > 1 || index === words.length - 1,
        queries: base === word ? [word] : [word, base],
      };
    }),
  };
}

// Of the terms a page matched, the ones worth highlighting. A typo match is dropped when the word was also found as
// typed, so "fram" highlights "Framer" but not "from"; when some word was only found through a typo, e.g. "framr",
// every match is kept.
function highlightedTerms(words: string[], terms: string[]) {
  const direct = new Set<string>();
  for (const word of words) {
    const forms = [word, stem(word)];
    const found = terms.filter((term) => forms.some((form) => term.startsWith(form)));
    if (found.length === 0) return new Set(terms);
    for (const term of found) direct.add(term);
  }
  return direct;
}

/** A matched word's position, and which of the matched terms it holds, e.g. "im" for "I’m". */
type Match = { start: number; end: number; terms: string[] };

// The words in `text` that the search matched, by position. Matched terms are whole indexed words, e.g. "framer"
// for a query of "framr" or "fram", so each word only needs comparing as a whole. Contractions are kept whole, so
// "I’m" is highlighted as one word.
function findMatches(text: string, terms: Set<string>): Match[] {
  const matches: Match[] = [];
  for (const word of text.matchAll(/[\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu)) {
    const found = tokenize(word[0]).filter((token) => terms.has(token));
    if (found.length > 0) {
      matches.push({ start: word.index, end: word.index + word[0].length, terms: found });
    }
  }
  return matches;
}

// Cuts long text down to a window that starts a little before the first match, on word boundaries.
function toExcerpt(text: string, matches: Match[]): Segment[] {
  let start = 0;
  let end = text.length;
  if (text.length > EXCERPT_LENGTH) {
    const first = matches[0]?.start ?? 0;
    if (first > EXCERPT_LEAD) {
      const space = text.indexOf(" ", first - EXCERPT_LEAD);
      start = space === -1 || space >= first ? first : space + 1;
    }
    end = Math.min(text.length, start + EXCERPT_LENGTH);
    if (end < text.length) {
      const space = text.lastIndexOf(" ", end);
      if (space > start) end = space;
    }
  }

  const segments: Segment[] = [];
  let cursor = start;
  for (const match of matches) {
    if (match.start < start || match.end > end) continue;
    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start), match: false });
    }
    segments.push({ text: text.slice(match.start, match.end), match: true });
    cursor = match.end;
  }
  if (end > cursor) {
    // Trailing punctuation reads oddly before an ellipsis, e.g. "foundation, …".
    const rest = text.slice(cursor, end);
    segments.push({
      text: end < text.length ? rest.replace(/[\s,;:]+$/, "") : rest,
      match: false,
    });
  }
  if (start > 0) segments.unshift({ text: "…", match: false });
  if (end < text.length) segments.push({ text: "…", match: false });
  return segments;
}

// Quotes the passage with the most different matched words, then the most matches, preferring earlier passages.
// When only the title or keywords matched, it falls back to the description or the opening passage, unmarked.
function excerptFor(page: SearchPage, terms: Set<string>): Segment[] {
  const passages = page.description ? [page.description, ...page.content] : page.content;

  let best: { text: string; matches: Match[]; distinct: number } | undefined;
  for (const text of passages) {
    const matches = findMatches(text, terms);
    const distinct = new Set(matches.flatMap((match) => match.terms)).size;
    if (
      distinct > 0 &&
      (!best ||
        distinct > best.distinct ||
        (distinct === best.distinct && matches.length > best.matches.length))
    ) {
      best = { text, matches, distinct };
    }
  }

  if (best) return toExcerpt(best.text, best.matches);
  const [fallback] = passages;
  return fallback ? toExcerpt(fallback, []) : [];
}

export function createSearch(pages: SearchPage[]): SiteSearch {
  const index = new MiniSearch<SearchPage>({
    idField: "href",
    fields: Object.keys(BOOST),
    extractField(page, field) {
      const value = page[field as keyof SearchPage];
      return Array.isArray(value) ? value.join("\n") : (value ?? "");
    },
    tokenize,
    // Terms come out of `tokenize` already normalized.
    processTerm: (term) => term,
    // Prefix search is set per word, in toQuery.
    searchOptions: {
      boost: BOOST,
      tokenize: tokenizeQuery,
      // Forgives a typo or so in longer words; short words are too easily mistaken for others.
      fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
    },
  });
  index.addAll(pages);

  const pagesByHref = new Map(pages.map((page) => [page.href, page]));

  return {
    pages,
    search(query) {
      const words = tokenizeQuery(query);
      if (words.length === 0) return [];

      let hits = index.search(toQuery(words, "AND"));
      // A page with some of the words beats an empty menu.
      if (hits.length === 0 && words.length > 1)
        hits = index.search(toQuery(words, "OR"));

      return hits.flatMap((hit) => {
        const page = pagesByHref.get(hit.id);
        if (!page) return [];
        return [{ page, excerpt: excerptFor(page, highlightedTerms(words, hit.terms)) }];
      });
    },
  };
}
