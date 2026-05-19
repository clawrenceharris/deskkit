import Image, { ImageProps } from "next/image";


export function SupplyImage({ src, alt, className }: ImageProps) {
    return (
      <div className={className}>
        <Image
          src={src}
          alt={alt}
          fill
          draggable={false}
          className="object-contain drop-shadow-md select-none"
          sizes="96px"
        />
      </div>
    );
  }
  