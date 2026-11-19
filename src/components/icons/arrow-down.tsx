import type { IconProps } from "./types";

export function ArrowDownIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      {...props}
    >
      <path
        d="M 50 12.75 L 50 81.66 M 15.25 62.863 L 41.813 84.513 C 46.598 88.344 53.402 88.344 58.188 84.513 L 84.75 62.863"
        stroke="currentColor"
        strokeWidth={24.74}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
