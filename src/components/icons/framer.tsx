import type { IconProps } from "./types";

export function FramerIcon({ size = 16, ...props }: IconProps) {
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
        d="M 50.003 66.167 L 50.003 99.5 L 16.67 66.167 M 16.67 66.167 L 16.67 32.833 L 50.003 32.833 M 16.67 66.167 L 83.337 66.167 L 50.003 32.833 M 50.003 32.833 L 83.337 32.833 L 83.337 -0.5 L 16.67 -0.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}
