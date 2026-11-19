import Image from "next/image";

type VideoCardProps = {
  title: string;
  tagline: string;
  /** A 16:9 image in /public. Without one, the frame shows the card background. */
  thumbnail?: string;
  /** The video's URL. Without one, e.g. for an upcoming video, the card isn't a link. */
  href?: string;
  className?: string;
};

export function VideoCard({
  title,
  tagline,
  thumbnail,
  href,
  className,
}: VideoCardProps) {
  const body = (
    <>
      {/* The background shows until the thumbnail loads, or if it fails to. */}
      <div className="bg-card-background relative aspect-video w-full overflow-hidden rounded-[8px] [corner-shape:superellipse(1.4)]">
        {thumbnail && (
          // Decorative: the title below already names the video.
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 499px) 50vw, 220px"
            draggable={false}
            className="object-cover select-none"
          />
        )}
      </div>
      {/* Without a link the video is upcoming, so its text is dimmed. */}
      <div
        className={`flex flex-col gap-0 text-[14px] leading-[22px] tracking-[-0.02em] ${href ? "" : "opacity-50"}`}
      >
        <h3 className="text-title font-medium">{title}</h3>
        <p className="text-description">{tagline}</p>
      </div>
    </>
  );

  return (
    <li className={className}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          draggable={false}
          className="flex w-full flex-col gap-3"
        >
          {body}
        </a>
      ) : (
        <div className="flex w-full flex-col gap-3">{body}</div>
      )}
    </li>
  );
}
