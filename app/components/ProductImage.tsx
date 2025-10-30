import Image from 'next/image';
import React from 'react'

interface ProductImageProps {
  src: string | null;
  alt: string;
  heightClass?: string;
  widthClass?: string;
}

export default function ProductImage({ src, alt, heightClass, widthClass }: ProductImageProps) {
  return (
    <div className='avatar'>
      <div className={`rounded-xl ${heightClass ? heightClass : 'h-32'} ${widthClass ? widthClass : 'w-32'}`}>
        <Image
          src={src || '/placeholder-image.png'}
          alt={alt}
          width={500}
          height={500}
          quality={100}
          className='object-cover'
        />
      </div>
    </div>
  )
}

