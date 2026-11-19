"use client";

import { useLayoutEffect } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { getPreferredTheme, setTheme } from "@/lib/theme";

export function ThemeToggle() {
  // Strict Mode's dev remount clears the attribute the inline script set; re-apply it.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = getPreferredTheme();
  }, []);

  function toggle() {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-icon hover:text-icon-hover flex cursor-pointer items-center"
    >
      <MoonIcon size={14} className="dark:hidden" />
      <SunIcon size={14} className="hidden dark:block" />
    </button>
  );
}
