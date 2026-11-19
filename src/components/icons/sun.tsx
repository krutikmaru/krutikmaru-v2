import type { IconProps } from "./types";

export function SunIcon({ size = 16, ...props }: IconProps) {
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
      <g transform="translate(6 6)">
        <path
          d="M 26.444 43.944 C 26.444 34.279 34.279 26.444 43.944 26.444 C 53.609 26.444 61.444 34.279 61.444 43.944 C 61.444 53.609 53.609 61.444 43.944 61.444 C 34.279 61.444 26.444 53.609 26.444 43.944 Z"
          fill="currentColor"
        />
        <path
          d="M 44 9.778 L 44 0 M 44 88 L 44 78.222 M 68.2 19.8 L 75.113 12.887 M 12.887 75.113 L 19.8 68.2 M 78.222 44 L 88 44 M 0 44 L 9.778 44 M 68.2 68.2 L 75.113 75.113 M 12.887 12.887 L 19.8 19.8"
          stroke="currentColor"
          strokeWidth={11.87}
          strokeLinecap="round"
          strokeMiterlimit={10}
        />
      </g>
    </svg>
  );
}
