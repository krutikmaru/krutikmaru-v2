import Image from "next/image";
import type { ComponentType, ReactNode } from "react";
import { Carousel, type CarouselImage } from "@/components/carousel";
import type { IconProps } from "@/components/icons";
import { Tooltip } from "@/components/tooltip";

type MentionProps = {
  icon: ComponentType<IconProps>;
  /** Shown in the hover preview. */
  description: string;
  /**
   * Hover preview images. One is shown as a thumbnail at its own aspect ratio; more become a carousel. A gray
   * placeholder stands in without any.
   */
  images?: CarouselImage[];
  children: ReactNode;
};

// The thumbnail gives up height first when the tooltip runs out of room. Its radius is the tooltip's minus its
// padding, so the corners stay concentric.
const thumbnailClassName =
  "min-h-0 shrink rounded-[16px] [corner-shape:superellipse(1.4)]";
// The tooltip's content width: 260px minus its padding and border.
const thumbnailSizes = "234px";

// An inline icon + name in body copy. A border, not text-decoration, so the underline runs under the icon too.
// The border sits at the font's descent (3px below the baseline for 14px Inter); pb-0.5 pushes it to 5px.
export function Mention({
  icon: Icon,
  description,
  images = [],
  children,
}: MentionProps) {
  const name = typeof children === "string" ? children : undefined;
  const hasCarousel = images.length > 1;
  const [firstImage] = images;

  return (
    <Tooltip
      interactive={hasCarousel}
      label={name && `${name} preview`}
      className="text-title border-underline hover:border-underline-hover data-open:border-underline-hover cursor-pointer border-b pb-0.5 whitespace-nowrap"
      content={
        <>
          {hasCarousel ? (
            <Carousel
              images={images}
              label={name ? `${name} screenshots` : "Screenshots"}
              sizes={thumbnailSizes}
              className={thumbnailClassName}
            />
          ) : firstImage ? (
            // object-contain keeps the aspect ratio if the tooltip is squeezed shorter than the image.
            <Image
              src={firstImage.src}
              alt={firstImage.alt}
              sizes={thumbnailSizes}
              placeholder="blur"
              draggable={false}
              className={`${thumbnailClassName} h-auto w-full object-contain select-none`}
            />
          ) : (
            <div className={`${thumbnailClassName} bg-placeholder aspect-[16/10]`} />
          )}
          <p className="shrink-0 px-1 pt-3 pb-0.5 text-[13px] leading-[18px] tracking-[-0.02em]">
            {description}
          </p>
        </>
      }
    >
      <Icon size={12} className="mr-0.5 inline-block align-[-1px]" />
      {children}
    </Tooltip>
  );
}
