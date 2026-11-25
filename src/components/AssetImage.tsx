import { getImageProps, type ImageProps } from "next/image";

type Props = Pick<ImageProps, "alt" | "sizes" | "loading" | "fetchPriority"> & {
  src: string;
  width: number;
  height: number;
  webpWidths?: readonly number[];
};

export function AssetImage({ webpWidths, loading = "lazy", ...image }: Props) {
  if (!webpWidths) {
    const { props } = getImageProps({ ...image, loading });
    return <img {...props} />;
  }

  // The local WebP variants are generated ahead of time from the full-size capture.
  const srcSet = [
    ...webpWidths.map((width) => `${image.src.replace(/\.webp$/, `-${width}.webp`)} ${width}w`),
    `${image.src} ${image.width}w`,
  ].join(", ");

  return <img {...image} srcSet={srcSet} loading={loading} decoding="async" />;
}
