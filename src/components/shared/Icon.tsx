import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
  src: StaticImageData;
  alt: string
}
export function Icon({ src, alt, className }: IconProps) {
  return (
    <Image
        src={src}
        alt={alt}
        width={16}
        height={16}
        draggable={false}
        className={cn("object-contain select-none dark:invert", className)}
        sizes="96px"
    />
  );
}