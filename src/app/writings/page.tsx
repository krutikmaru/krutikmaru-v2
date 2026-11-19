import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { MenuIcon } from "@/components/icons";
import { ListItem } from "@/components/list-item";
import { Nav } from "@/components/nav";
import { writings } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writings",
  // The root layout's canonical points at "/", so it's overridden here.
  alternates: {
    canonical: "/writings",
  },
};

export default function Writings() {
  return (
    // One pixel taller than the screen so the page scrolls like home does; otherwise the scrollbar
    // disappears and the centered column shifts sideways when navigating between them.
    <main className="mx-auto flex min-h-[calc(100vh+1px)] w-full max-w-[700px] flex-col items-start gap-16 px-6 pt-12 pb-11 max-[810px]:max-w-[500px]">
      <Nav />
      <div className="flex w-full flex-1 flex-col gap-3">
        <h1 className="text-title text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
          Writings
        </h1>
        <ul className="flex w-full flex-col gap-1">
          {writings.map((writing) => (
            <ListItem key={writing.title} icon={MenuIcon} {...writing} />
          ))}
        </ul>
      </div>
      <Footer />
    </main>
  );
}
