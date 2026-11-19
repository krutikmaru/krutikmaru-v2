import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

const photo = await readFile(join(process.cwd(), "public/krutik-maru.PNG"));
const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

// A favicon can't be rounded with CSS, so the radius is baked into the PNG's transparent corners.
export default function Icon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <img
        src={photoSrc}
        alt=""
        width={size.width}
        height={size.height}
        style={{ objectFit: "cover", borderRadius: 14 }}
      />
    </div>,
    size,
  );
}
