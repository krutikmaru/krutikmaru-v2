import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { ArrowLeftIcon } from "@/components/icons";
import { Nav } from "@/components/nav";
import { hafferXH } from "@/lib/fonts";
import { getWriting, writingHref, writings } from "@/lib/writings";

export function generateStaticParams() {
  return writings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/writings/[slug]">): Promise<Metadata> {
  const writing = getWriting((await params).slug);
  if (!writing) return {};

  return {
    title: writing.title,
    // The root layout's canonical points at "/", so it's overridden here.
    alternates: {
      canonical: writingHref(writing.slug),
    },
  };
}

export default async function Writing({ params }: PageProps<"/writings/[slug]">) {
  const writing = getWriting((await params).slug);
  if (!writing) notFound();

  return (
    <main className="mx-auto flex min-h-[calc(100vh+1px)] w-full max-w-[700px] flex-col items-start gap-16 px-6 pt-12 pb-11 max-[810px]:max-w-[500px]">
      <Nav />
      <article className="flex w-full flex-1 flex-col gap-8">
        <Link
          href="/writings"
          draggable={false}
          className="text-accent-blue flex w-fit flex-row items-center gap-1.5 text-[12px] leading-[22px] tracking-[-0.02em]"
        >
          <ArrowLeftIcon size={9} />
          Writings
        </Link>
        <div className="flex flex-col gap-4">
          <h1
            className={`${hafferXH.className} text-title text-[32px] leading-[1.2em] font-medium tracking-normal max-[810px]:text-[28px]`}
          >
            {writing.title}
          </h1>
          <div className="text-description flex flex-col gap-4 text-[14px] leading-[1.7em] font-medium tracking-[-0.02em]">
            {writing.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
