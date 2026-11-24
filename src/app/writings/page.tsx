import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { WritingsSearch } from "@/components/writings-search";
import { hafferXH } from "@/lib/fonts";

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
      <div className="flex w-full flex-1 flex-col gap-4">
        <h1
          className={`${hafferXH.className} text-title text-[24px] leading-[1.2em] font-medium tracking-normal max-[810px]:text-[20px]`}
        >
          Writings
        </h1>
        <WritingsSearch />
      </div>
      <Footer />
    </main>
  );
}
