"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";

export type CarouselImage = {
  src: StaticImageData;
  alt: string;
  /** "cover" lets the image be cropped to fill its slide, for images with plain margins. Default "contain". */
  fit?: "contain" | "cover";
};

type CarouselProps = {
  images: CarouselImage[];
  /** Accessible name of the carousel. */
  label: string;
  /** The `sizes` hint for each slide's image. */
  sizes: string;
  className?: string;
};

// Follows the WAI-ARIA carousel pattern: drag or swipe the slides, or use the page control (Tab to it, then
// click/Enter or the arrow keys). Takes the tallest image's aspect ratio, so that one is never cropped; wider
// images are letterboxed, or cropped at the sides when their fit is "cover".
export function Carousel({ images, label, sizes, className }: CarouselProps) {
  const [viewportRef, api] = useEmblaCarousel();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  function goTo(index: number) {
    if (!api) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    api.scrollTo(Math.max(0, Math.min(images.length - 1, index)), reduceMotion);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    goTo(selected + step);
  }

  const tallest = images.reduce<StaticImageData | undefined>(
    (current, { src }) =>
      !current || src.width / src.height < current.width / current.height ? src : current,
    undefined,
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={handleKeyDown}
      style={tallest && { aspectRatio: `${tallest.width} / ${tallest.height}` }}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      <div
        ref={viewportRef}
        className="h-full cursor-grab overflow-hidden active:cursor-grabbing"
      >
        <div aria-live="polite" className="flex h-full">
          {images.map((image, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${images.length}`}
              aria-hidden={index !== selected || undefined}
              className="h-full min-w-0 shrink-0 grow-0 basis-full"
            >
              <Image
                src={image.src}
                alt={image.alt}
                sizes={sizes}
                placeholder="blur"
                draggable={false}
                className={`h-full w-full select-none ${image.fit === "cover" ? "object-cover" : "object-contain"}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center rounded-full bg-black/40 px-[5px] backdrop-blur-md">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show slide ${index + 1} of ${images.length}`}
            aria-current={index === selected || undefined}
            onClick={() => goTo(index)}
            // The button is a 16px-tall hit area around the 6px dot; the active dot stretches into a pill.
            className="group flex h-4 cursor-pointer items-center rounded-full px-[3px] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white"
          >
            <span className="ease-spring block h-1.5 w-1.5 rounded-full bg-white transition-[width] duration-400 group-aria-[current=true]:w-5 motion-reduce:transition-none" />
          </button>
        ))}
      </div>
    </div>
  );
}
