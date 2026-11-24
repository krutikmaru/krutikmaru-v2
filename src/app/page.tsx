import Image from "next/image";
import Link from "next/link";
import type { CarouselImage } from "@/components/carousel";
import { Footer } from "@/components/footer";
import { FramerIcon, MenuIcon, VerifyCheckIcon } from "@/components/icons";
import { ListItem } from "@/components/list-item";
import { Mention } from "@/components/mention";
import { Nav } from "@/components/nav";
import { RecentSkillCard } from "@/components/recent-skill-card";
import { VideoCard } from "@/components/video-card";
import { site } from "@/lib/site";
import { writingHref, writings } from "@/lib/writings";
import appMockup from "../../public/app-mockup.png";
import finalCutProIcon from "../../public/apps/final-cut-pro.png";
import jayerAppIcon from "../../public/apps/jayer-app.png";
import framerLogo from "../../public/framer.jpeg";
import jayerBanner from "../../public/jayer-banner.png";

const jayerPreview: CarouselImage[] = [
  // The banner is a logo on a plain background, so it's cropped at the sides to the mockup's shape.
  { src: jayerBanner, alt: "The Jayer logo", fit: "cover" },
  { src: appMockup, alt: "Jayer’s editor with a site open on the canvas" },
];
// Decorative: the description already says what Framer is.
const framerPreview = [{ src: framerLogo, alt: "" }];

const recents = [
  {
    icon: "/apps/jayer-app.png",
    title: "Jayer",
    description: "Building a website design app that converts design into full codebase",
    href: "https://jayer.app",
  },
  {
    icon: "/apps/final-cut-pro.png",
    title: "Final Cut Pro",
    description: "Started editing video so I can study and create viral content",
    href: "https://www.apple.com/in/final-cut-pro/",
  },
  {
    icon: "/apps/youtube.png",
    title: "YouTube",
    description: "Doing this as I realised the world now heavily depends on content",
    href: "https://www.youtube.com/@krutikmarus",
  },
];

const videos = [
  {
    title: "I Am Becoming Jethalal!",
    tagline: "Krutik Maru",
    thumbnail: "/thumbnails/i-am-becoming-jethalal.png",
    href: "https://youtu.be/uYkFcSm_TXM",
  },
  { title: "Upcoming Video", tagline: "Krutik Maru" },
  { title: "Upcoming Video", tagline: "Krutik Maru" },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[700px] flex-col items-start gap-16 px-6 pt-12 pb-11 max-[810px]:max-w-[500px]">
      <Nav />
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center gap-3">
          <Image
            src="/krutik-maru.PNG"
            alt={site.name}
            width={44}
            height={44}
            preload
            draggable={false}
            className="size-11 rounded-full object-cover saturate-100 select-none dark:saturate-0"
          />
          <div className="flex flex-col gap-0 text-[14px] leading-[22px] tracking-[-0.02em]">
            <h1 className="text-title flex items-center gap-1 font-medium">
              {site.name}
              <VerifyCheckIcon size={14} className="text-accent-blue" />
            </h1>
            <p className="text-description">Software Engineer</p>
          </div>
        </div>
        <div className="text-description flex flex-col gap-4 text-[14px] leading-[1.7em] font-medium tracking-[-0.02em]">
          <p>
            I’m the founder of{" "}
            <Mention
              icon={jayerAppIcon}
              href="https://jayer.app"
              images={jayerPreview}
              description="A design canvas that turns your site’s design into a full codebase."
            >
              Jayer
            </Mention>
            , where I’m building a design canvas to design your whole foundation for your
            site foundation using both AI and human touch, then exporting it to a full
            codebase over which people can use their existing ai tools to build more
            complex features over that foundation.
          </p>
          <p>
            I’ve officially worked with the{" "}
            <Mention
              icon={FramerIcon}
              href="https://www.framer.com"
              images={framerPreview}
              description="A website builder for designers, from first draft to published site."
            >
              Framer
            </Mention>{" "}
            team where I have been involved in creating content &amp; resources for their
            upcoming updates, testing unreleased features, updates to provide opinions and
            feedbacks. I’ve also helped them by finding and reporting severe bugs.
            <br />
            Apart from that I am also a verified Framer Pro Expert and have independently
            made over $50K with Framer templates, client works &amp; distribution.
          </p>
          <p>
            Currently I am learning{" "}
            <Mention
              icon={finalCutProIcon}
              href="https://www.apple.com/in/final-cut-pro/"
            >
              Final Cut Pro
            </Mention>{" "}
            and creating content on social media platforms in order to analyse and learn
            content that goes viral and keeps the viewers psychologically hooked so they
            don’t lose attention and at the same time receive some value from that
            content.
          </p>
        </div>
      </div>
      <section className="flex w-full flex-col gap-3">
        <h2 className="text-title text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
          Recents
        </h2>
        {/* Below 500px the cards are secondary: they size to content and every row matches the tallest.
            Below 340px they stack, each at its own content height. */}
        <div className="flex w-full flex-row gap-2.5 max-[810px]:grid max-[810px]:grid-cols-2 max-[500px]:auto-rows-fr max-[340px]:flex max-[340px]:flex-col">
          {recents.map((recent) => (
            <RecentSkillCard
              key={recent.title}
              {...recent}
              variant="responsive"
              className="h-[210px] max-[810px]:h-[221px] max-[500px]:h-auto"
            />
          ))}
        </div>
      </section>
      <section className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-row items-center justify-between pr-3">
          <h2 className="text-title text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
            Writings
          </h2>
          <Link
            href="/writings"
            draggable={false}
            className="text-accent-blue text-[12px] leading-[22px] tracking-[-0.02em]"
          >
            View all
          </Link>
        </div>
        <ul className="flex w-full flex-col gap-1">
          {writings.map((writing) => (
            <ListItem
              key={writing.slug}
              icon={MenuIcon}
              title={writing.title}
              tag={writing.tag}
              href={writingHref(writing.slug)}
            />
          ))}
        </ul>
      </section>
      <section className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-row items-center justify-between pr-3">
          <h2 className="text-title text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
            YouTube
          </h2>
          <a
            href="https://www.youtube.com/@krutikmarus"
            target="_blank"
            rel="noopener"
            draggable={false}
            className="text-accent-blue text-[12px] leading-[22px] tracking-[-0.02em]"
          >
            View all
          </a>
        </div>
        {/* Below 810px only the first two cards show. The mask fades out the upcoming-video placeholders. */}
        <ul className="grid w-full grid-cols-3 gap-4 [mask-image:linear-gradient(270deg,#0000_0%,#00000094_31%,#000000e2_51%,#000_68%)] max-[810px]:grid-cols-2">
          {videos.map((video, index) => (
            <VideoCard key={index} {...video} className="max-[810px]:nth-3:hidden" />
          ))}
        </ul>
      </section>
      <Footer />
    </main>
  );
}
