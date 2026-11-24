"use client";

import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import { Command } from "cmdk";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { MenuIcon, SearchIcon } from "@/components/icons";
import { createSearch, type SearchResult, type SiteSearch } from "@/lib/search/engine";
import type { SearchPage } from "@/lib/search/pages";

// Loaded once per visit, the first time the menu is about to open. A failed load is retried on the next attempt.
let loading: Promise<SiteSearch> | undefined;
let loaded: SiteSearch | undefined;

function loadSearch() {
  loading ??= fetch("/search.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Search index responded ${response.status}`);
      return response.json() as Promise<SearchPage[]>;
    })
    .then((pages) => (loaded = createSearch(pages)))
    .catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
  return loading;
}

// Map.groupBy, which Safari only has from 17.4.
function groupPages(pages: SearchPage[]) {
  const groups = new Map<string, SearchPage[]>();
  for (const page of pages) {
    const group = groups.get(page.group);
    if (group) group.push(page);
    else groups.set(page.group, [page]);
  }
  return groups;
}

function isShortcut(event: globalThis.KeyboardEvent) {
  return (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    !event.repeat &&
    event.key.toLowerCase() === "k"
  );
}

const textClassName = "text-[14px] leading-[22px] tracking-[-0.02em]";
const smallTextClassName = "text-[12px] leading-[1.6em] tracking-[-0.02em]";

// A little under the 19px that would be concentric with the panel (28px, less its border and the list's padding),
// so single-line rows, which are 38px tall, don't round off into pills.
const itemClassName =
  "group flex cursor-pointer flex-row gap-2.5 rounded-[17px] px-3 py-2 [corner-shape:superellipse(1.4)] data-[selected=true]:bg-menu-item-background-selected";

const groupClassName =
  "[&_[cmdk-group-heading]]:text-description [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:leading-[18px] [&_[cmdk-group-heading]]:tracking-[-0.02em]";

// A search across every page, opened from the nav's search button or with ⌘K (Ctrl+K elsewhere).
export function CommandMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<SiteSearch | undefined>(() => loaded);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  // The highlighted page, kept with the query it was chosen for, so typing moves the highlight back to the top hit.
  const [selection, setSelection] = useState({ query: "", value: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    refs: { setReference, setFloating },
    context,
  } = useFloating({ open, onOpenChange: setOpen });
  // Escape is handled on the panel instead, so it clears the query before closing.
  const dismiss = useDismiss(context, { escapeKey: false });
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: { open: 400, close: 150 },
  });

  // Called on hover and focus of the button too, so the index is usually there by the time the menu opens.
  function prepare() {
    if (search) return;
    setFailed(false);
    loadSearch().then(setSearch, () => setFailed(true));
  }

  function openMenu() {
    setQuery("");
    setSelection({ query: "", value: "" });
    setOpen(true);
    prepare();
  }

  const toggle = useEffectEvent(() => (open ? setOpen(false) : openMenu()));

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (!isShortcut(event)) return;
      event.preventDefault();
      toggle();
    }
    addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Escape" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (query) setQuery("");
    else setOpen(false);
  }

  function go(href: string) {
    setOpen(false);
    if (href !== pathname) router.push(href);
  }

  const searching = query.trim() !== "";
  const results = useMemo(
    () => (search && searching ? search.search(query) : []),
    [search, searching, query],
  );
  const groups = useMemo(() => groupPages(search?.pages ?? []), [search]);

  const values = searching
    ? results.map(({ page }) => page.href)
    : (search?.pages.map((page) => page.href) ?? []);
  const value =
    selection.query === query && values.includes(selection.value)
      ? selection.value
      : (values[0] ?? "");

  return (
    <>
      <button
        ref={setReference}
        type="button"
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        className="text-icon hover:text-icon-hover flex cursor-pointer items-center"
        {...getReferenceProps({
          onClick: openMenu,
          onPointerEnter: prepare,
          onFocus: prepare,
        })}
      >
        <SearchIcon size={12} />
      </button>
      {isMounted && (
        <FloatingPortal>
          <FloatingOverlay
            lockScroll
            className="z-50 flex items-start justify-center px-3 pt-[min(18vh,180px)]"
          >
            {/* Dims and softly blurs the page; a press on it is outside the panel, so it closes the menu. */}
            <div
              aria-hidden
              data-status={status}
              className="ease-spring fixed inset-0 bg-black/10 backdrop-blur-[3px] transition-opacity duration-400 data-[status=close]:opacity-0 data-[status=close]:duration-150 data-[status=close]:ease-out data-[status=initial]:opacity-0 dark:bg-black/40"
            />
            <FloatingFocusManager context={context} initialFocus={inputRef}>
              <div
                ref={setFloating}
                data-status={status}
                className="bg-popover-background/80 border-popover-border ease-spring relative flex w-full max-w-[540px] origin-top flex-col overflow-hidden rounded-[28px] border shadow-[0_24px_56px_-12px_rgb(0_0_0/0.18)] backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,scale,translate] duration-400 [corner-shape:superellipse(1.4)] data-[status=close]:opacity-0 data-[status=close]:duration-150 data-[status=close]:ease-out data-[status=initial]:opacity-0 motion-safe:data-[status=close]:scale-96 motion-safe:data-[status=initial]:-translate-y-1 motion-safe:data-[status=initial]:scale-96 dark:shadow-[0_24px_56px_-12px_rgb(0_0_0/0.7)]"
                {...getFloatingProps({
                  "aria-label": "Search",
                  onKeyDown: handleKeyDown,
                })}
              >
                <Command
                  label="Search"
                  shouldFilter={false}
                  loop
                  value={value}
                  onValueChange={(next) => {
                    setSelection({ query, value: next });
                    if (next) router.prefetch(next);
                  }}
                >
                  <div className="flex h-[52px] flex-row items-center gap-2.5 px-5">
                    <SearchIcon size={14} className="text-item-icon-active shrink-0" />
                    {/* 16px, which iOS also needs so it doesn't zoom into the field when it's focused. */}
                    <Command.Input
                      ref={inputRef}
                      value={query}
                      onValueChange={setQuery}
                      placeholder="Search"
                      autoComplete="off"
                      spellCheck={false}
                      enterKeyHint="go"
                      className="text-title placeholder:text-description/70 min-w-0 flex-1 bg-transparent text-[16px] leading-[22px] font-medium tracking-[-0.02em] outline-none"
                    />
                    <kbd
                      aria-hidden
                      className="border-popover-border text-description rounded-[6px] border px-1.5 font-sans text-[11px] leading-[18px] font-medium [corner-shape:superellipse(1.4)] pointer-coarse:hidden"
                    >
                      esc
                    </kbd>
                    {/* Touch screens have no Escape key, so they get a Cancel button, as iOS search fields do. */}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className={`text-accent-blue cursor-pointer ${textClassName} pointer-fine:hidden`}
                    >
                      Cancel
                    </button>
                  </div>
                  <Command.List className="border-popover-border max-h-[min(400px,50dvh)] scroll-py-2 overflow-y-auto overscroll-contain border-t [&_[cmdk-list-sizer]]:p-2">
                    {!search && !failed && (
                      <Command.Loading
                        className={`text-description px-3 py-6 text-center ${smallTextClassName}`}
                      >
                        Loading…
                      </Command.Loading>
                    )}
                    {failed && <LoadError onRetry={prepare} />}
                    {search && searching && results.length === 0 && (
                      <EmptyState query={query.trim()} />
                    )}
                    {search && searching
                      ? results.map((result) => (
                          <ResultItem
                            key={result.page.href}
                            result={result}
                            onSelect={go}
                          />
                        ))
                      : Array.from(groups, ([heading, pages]) => (
                          <Command.Group
                            key={heading}
                            heading={heading}
                            className={groupClassName}
                          >
                            {pages.map((page) => (
                              <ResultItem
                                key={page.href}
                                result={{ page }}
                                onSelect={go}
                              />
                            ))}
                          </Command.Group>
                        ))}
                  </Command.List>
                  <p aria-live="polite" className="sr-only">
                    {search && searching
                      ? `${results.length} ${results.length === 1 ? "result" : "results"}`
                      : ""}
                  </p>
                </Command>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
}

function ResultItem({
  result: { page, excerpt },
  onSelect,
}: {
  result: Pick<SearchResult, "page"> & Partial<Pick<SearchResult, "excerpt">>;
  onSelect: (href: string) => void;
}) {
  const hasExcerpt = excerpt && excerpt.length > 0;

  return (
    <Command.Item
      value={page.href}
      onSelect={onSelect}
      className={`${itemClassName} ${hasExcerpt ? "items-start" : "items-center"}`}
    >
      <PageIcon icon={page.icon} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className={`text-title truncate font-medium ${textClassName}`}>{page.title}</p>
        {hasExcerpt && (
          <p className={`text-description line-clamp-2 ${smallTextClassName}`}>
            {excerpt.map((segment, index) =>
              segment.match ? (
                <mark key={index} className="text-title bg-transparent font-medium">
                  {segment.text}
                </mark>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </p>
        )}
      </div>
      {page.tag && (
        <p className="text-description shrink-0 text-[12px] leading-[22px] tracking-[-0.02em] whitespace-nowrap">
          {page.tag}
        </p>
      )}
    </Command.Item>
  );
}

// The same tile as a list item's, lit up while its row is highlighted. The homepage shows the profile photo instead,
// cut to the tile's squircle.
function PageIcon({ icon }: { icon: SearchPage["icon"] }) {
  if (icon === "avatar") {
    return (
      <Image
        src="/krutik-maru.PNG"
        alt=""
        width={24}
        height={24}
        draggable={false}
        className="size-6 shrink-0 rounded-[9px] object-cover saturate-100 select-none [corner-shape:superellipse(1.4)] dark:saturate-0"
      />
    );
  }

  return (
    <div className="border-item-icon-border group-data-[selected=true]:border-item-icon-border-active ease-spring size-6 shrink-0 rounded-[9px] border p-[3px] shadow-[0_1px_2px_-1px_var(--item-icon-shadow-1),0_2px_4px_0_var(--item-icon-shadow-2)] transition-colors duration-400 [corner-shape:superellipse(1.4)]">
      <div className="bg-item-icon-background group-data-[selected=true]:bg-item-icon-background-active ease-spring flex size-full items-center justify-center rounded-[5px] transition-colors duration-400 [corner-shape:superellipse(1.4)]">
        <MenuIcon
          size={10}
          className="text-item-icon group-data-[selected=true]:text-item-icon-active ease-spring transition-colors duration-400"
        />
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      <div className="border-item-icon-border size-10 rounded-[13px] border p-[3px] shadow-[0_1px_2px_-1px_var(--item-icon-shadow-1),0_2px_4px_0_var(--item-icon-shadow-2)] [corner-shape:superellipse(1.4)]">
        <div className="bg-item-icon-background flex size-full items-center justify-center rounded-[9px] [corner-shape:superellipse(1.4)]">
          <SearchIcon size={14} className="text-item-icon" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className={`text-title font-medium ${textClassName}`}>No results</p>
        <p
          className={`text-description max-w-[300px] wrap-break-word ${smallTextClassName}`}
        >
          Nothing on the site matches “{query}”. Try a different word.
        </p>
      </div>
    </div>
  );
}

function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-6 text-center">
      <p className={`text-description ${smallTextClassName}`}>Search couldn’t load.</p>
      <button
        type="button"
        onClick={onRetry}
        className={`text-accent-blue cursor-pointer ${smallTextClassName}`}
      >
        Try again
      </button>
    </div>
  );
}
