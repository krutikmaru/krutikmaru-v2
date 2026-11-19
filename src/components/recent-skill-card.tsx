import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";

type RecentSkillCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
  /** "responsive" renders primary, switching to secondary below 500px. */
  variant?: "primary" | "secondary" | "responsive";
  className?: string;
};

export function RecentSkillCard({
  icon,
  title,
  description,
  href,
  variant = "primary",
  className,
}: RecentSkillCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      draggable={false}
      data-variant={variant}
      className={`group bg-card-background hover:bg-card-background-hover ease-spring flex w-full flex-col items-start gap-4 rounded-[24px] p-[18px] transition-colors duration-400 [corner-shape:superellipse(1.4)] ${className ?? ""}`}
    >
      <Image
        src={icon}
        alt=""
        width={36}
        height={36}
        draggable={false}
        className="size-9 select-none"
      />
      {/* The title comes first in the DOM so it's read before the description; primary moves it below. */}
      <div className="card-secondary:items-start card-secondary:justify-start card-secondary:gap-1.5 flex w-full flex-1 flex-col justify-between">
        <div className="card-secondary:order-none order-last flex w-full flex-row items-center gap-2.5">
          <h3 className="text-title flex-1 text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
            {title}
          </h3>
          <div className="card-secondary:hidden group-hover:bg-accent-blue/20 group-hover:text-accent-blue ease-spring flex rounded-full bg-[#e3e3e3] p-2 text-[#999999] transition-colors duration-400 dark:bg-[#2e2e2e] dark:text-[#8f8f8f]">
            <ArrowRightIcon size={11} />
          </div>
        </div>
        <p className="text-description text-[14px] leading-[22px] tracking-[-0.02em]">
          {description}
        </p>
      </div>
    </a>
  );
}
