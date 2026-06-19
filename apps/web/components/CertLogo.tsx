"use client";

import { useState } from "react";

// Logo/badge de una certificación. Usa la URL (manual o derivada del fabricante);
// si la imagen falla o no hay, muestra un monograma con las iniciales del fabricante.
export function CertLogo({
  src,
  alt,
  size = 56,
}: {
  src?: string | null;
  alt: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initials = alt
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!src || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-md border border-line bg-canvas font-semibold text-muted"
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-md border border-line bg-white object-contain p-1.5"
    />
  );
}
