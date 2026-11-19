"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

const socials = [
  { href: "mailto:krutikmaru18@gmail.com", label: "Email", image: "/apps/mail.png" },
  {
    href: "https://www.youtube.com/@krutikmarus",
    label: "YouTube",
    image: "/apps/youtube.png",
  },
  {
    href: "https://www.linkedin.com/in/krutik-maru/",
    label: "LinkedIn",
    image: "/apps/linkedin.png",
  },
  { href: "https://x.com/krutikmarus", label: "Twitter", image: "/apps/twitter.png" },
];

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Kolkata",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

// Built from parts because browsers differ on the space before AM/PM.
function getTime() {
  const parts = formatter.formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;
  return `${part("hour")}:${part("minute")} ${part("dayPeriod")?.toLowerCase()}`;
}

// Polls every second, but the string only changes, and re-renders, once a minute.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

export function Footer() {
  // The page is prerendered, so the time is only known in the browser.
  const time = useSyncExternalStore(subscribe, getTime, () => null);

  return (
    <footer className="flex w-full flex-row items-center justify-between">
      {/* Hidden, not removed, until the time is known so the row doesn't shift. */}
      <p
        className={`text-description text-[14px] leading-[22px] tracking-[-0.02em] ${time ? "" : "invisible"}`}
      >
        {time ?? "12:00 pm"} in Ahmedabad, India
      </p>
      <div className="flex flex-row items-center gap-0.5">
        {socials.map(({ href, label, image }) => {
          // A mailto link opens the mail app, so it shouldn't also open an empty tab.
          const external = href.startsWith("http");

          return (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener" : undefined}
              draggable={false}
              aria-label={label}
              className="flex"
            >
              <Image
                src={image}
                alt=""
                width={20}
                height={20}
                draggable={false}
                className="size-5 select-none"
              />
            </a>
          );
        })}
      </div>
    </footer>
  );
}
