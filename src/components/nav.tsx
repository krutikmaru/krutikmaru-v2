"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/writings", label: "Writings" },
  // Hidden for now.
  // { href: "/stuff", label: "Stuff" },
  // { href: "/life", label: "Life" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-row gap-2.5 text-[12px] leading-[22px] tracking-[-0.02em]">
        {links.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              draggable={false}
              aria-current={active ? "page" : undefined}
              className={active ? "text-title underline" : "text-description"}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-row items-center gap-3">
        <CommandMenu />
        <ThemeToggle />
      </div>
    </nav>
  );
}
