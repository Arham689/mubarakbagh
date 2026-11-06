"use client";

import Image, { type ImageLoader } from "next/image";
import { base, type Photo } from "@/lib/images";

// Unsplash's CDN resizes for us, so next/image just requests the right width.
const unsplashLoader: ImageLoader = ({ src, width, quality }) =>
  `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 78}`;

export default function Img({
  p,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  p: Photo;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      loader={unsplashLoader}
      src={base(p)}
      alt={p.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
