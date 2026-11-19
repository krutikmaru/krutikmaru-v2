import type { IconProps } from "./types";

export function ArrowLeftIcon({ size = 16, ...props }: IconProps) {
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
        d="M 34.75 0 L 34.75 68.91 M 0 50.113 L 26.563 71.763 C 31.348 75.594 38.152 75.594 42.937 71.763 L 69.5 50.113"
        transform="translate(15.25 12.116) rotate(90 34.75 37.25)"
        stroke="currentColor"
        strokeWidth={24.74}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
