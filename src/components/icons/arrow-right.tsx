import type { IconProps } from "./types";

export function ArrowRightIcon({ size = 16, ...props }: IconProps) {
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
        d="M 34.75 74.636 L 34.75 5.727 M 0 24.524 L 26.563 2.874 C 31.348 -0.958 38.152 -0.958 42.937 2.874 L 69.5 24.524"
        transform="translate(15.25 12.116) rotate(90 34.75 37.25)"
        stroke="currentColor"
        strokeWidth={24.74}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
