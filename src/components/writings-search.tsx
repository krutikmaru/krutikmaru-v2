"use client";

import { useRef, useState } from "react";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { ListItem } from "@/components/list-item";
import { normalize } from "@/lib/normalize";
import { writingHref, writings } from "@/lib/writings";

const searchable = writings.map((writing) => ({
  ...writing,
  text: normalize([writing.title, ...writing.body].join(" ")),
}));

export function WritingsSearch() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Every word has to appear somewhere in the title or body, in any order.
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const results = searchable.filter(({ text }) =>
    terms.every((term) => text.includes(term)),
  );

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <label className="group bg-card-background hover:not-focus-within:bg-card-background-hover focus-within:ring-accent-blue/40 ease-spring flex h-[30px] w-full cursor-text flex-row items-center gap-2 rounded-[12px] px-3 transition-[background-color,box-shadow] duration-400 [corner-shape:superellipse(1.4)] focus-within:ring-3">
        <SearchIcon
          size={12}
          className="text-item-icon group-focus-within:text-item-icon-active ease-spring shrink-0 transition-colors duration-400"
        />
        {/* 16px on touch screens, since iOS zooms into any input with smaller text when it's focused. */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="Search writings"
          aria-label="Search writings"
          autoComplete="off"
          spellCheck={false}
          className="text-title placeholder:text-description/70 min-w-0 flex-1 bg-transparent text-[14px] leading-[22px] font-medium tracking-[-0.02em] outline-none pointer-coarse:text-[16px] [&::-webkit-search-cancel-button]:appearance-none"
        />
      </label>
      {results.length > 0 ? (
        <ul className="flex w-full flex-col gap-1">
          {results.map((writing) => (
            <ListItem
              key={writing.slug}
              icon={MenuIcon}
              title={writing.title}
              tag={writing.tag}
              href={writingHref(writing.slug)}
            />
          ))}
        </ul>
      ) : (
        <EmptyState query={query.trim()} onClear={clear} />
      )}
      <p aria-live="polite" className="sr-only">
        {terms.length > 0
          ? `${results.length} ${results.length === 1 ? "result" : "results"}`
          : ""}
      </p>
    </div>
  );
}

// The icon tile's radius is the frame's minus its border and padding, so the corners stay concentric.
function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex w-full flex-col items-center gap-4 px-6 py-12 text-center">
      <div className="border-item-icon-border size-10 rounded-[13px] border p-[3px] shadow-[0_1px_2px_-1px_var(--item-icon-shadow-1),0_2px_4px_0_var(--item-icon-shadow-2)] [corner-shape:superellipse(1.4)]">
        <div className="bg-item-icon-background flex size-full items-center justify-center rounded-[9px] [corner-shape:superellipse(1.4)]">
          <SearchIcon size={14} className="text-item-icon" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-title text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
          No writings found
        </p>
        <p className="text-description max-w-[300px] text-[12px] leading-[1.6em] tracking-[-0.02em] wrap-break-word">
          Nothing matches “{query}”. Try a different word, or clear the search to see
          every writing.
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="text-accent-blue cursor-pointer text-[12px] leading-[22px] tracking-[-0.02em]"
      >
        Clear search
      </button>
    </div>
  );
}
