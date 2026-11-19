import type { IconProps } from "./types";

export function ArrowUpIcon({ size = 16, ...props }: IconProps) {
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
        d="M 50 87.386 L 50 18.477 M 15.25 37.274 L 41.813 15.624 C 46.598 11.792 53.402 11.792 58.187 15.624 L 84.75 37.274"
        stroke="currentColor"
        strokeWidth={24.74}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
