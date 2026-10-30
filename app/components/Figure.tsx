import Image from "next/image";

// An article image with an optional caption and credit. Put the file under
// public/articles/<slug>/ and pass its pixel size so the layout never jumps.
// `credit` is where a sourced image's licence attribution goes.
export default function Figure({
  src,
  alt,
  width,
  height,
  caption,
  credit,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
}) {
  return (
    <figure className="my-10">
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto rounded-lg" />
      {(caption || credit) && (
        <figcaption className="mt-3 text-sm text-muted">
          {caption}
          {credit && <span className="block mt-1 text-xs">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
