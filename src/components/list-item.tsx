import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";

type ListItemProps = {
  icon: ComponentType<IconProps>;
  title: string;
  /** Shown at the right edge, e.g. a date. */
  tag: string;
  className?: string;
};

// The icon tile's radius is the frame's minus its border and padding, so the corners stay concentric.
export function ListItem({ icon: Icon, title, tag, className }: ListItemProps) {
  return (
    <li
      className={`group bg-item-background-hover/0 hover:bg-item-background-hover flex h-fit cursor-pointer flex-row items-center gap-2.5 rounded-[12px] px-3 pt-1.5 pb-[5px] [corner-shape:superellipse(1.4)] ${className ?? ""}`}
    >
      <div className="border-item-icon-border group-hover:border-item-icon-border-active ease-spring size-6 shrink-0 rounded-[9px] border p-[3px] shadow-[0_1px_2px_-1px_var(--item-icon-shadow-1),0_2px_4px_0_var(--item-icon-shadow-2)] transition-colors duration-400 [corner-shape:superellipse(1.4)]">
        <div className="bg-item-icon-background group-hover:bg-item-icon-background-active ease-spring flex size-full items-center justify-center rounded-[5px] transition-colors duration-400 [corner-shape:superellipse(1.4)]">
          <Icon
            size={10}
            className="text-item-icon group-hover:text-item-icon-active ease-spring transition-colors duration-400"
          />
        </div>
      </div>
      <p className="text-title min-w-0 flex-1 text-[14px] leading-[22px] font-medium tracking-[-0.02em]">
        {title}
      </p>
      <p className="text-description text-[12px] leading-[22px] tracking-[-0.02em] whitespace-nowrap">
        {tag}
      </p>
    </li>
  );
}
