import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export const AvatarWithFallback: React.FC<{
  src?: string | undefined | null;
  alt: string;
  fallback: string;
}> = ({ src, alt, fallback }) => {
  const [imageError, setImageError] = useState(false);

  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageError(false);
  }

  return (
    <Avatar>
      {!imageError && src ? (
        <AvatarImage
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      ) : null}
      <AvatarFallback className="bg-indigo-100 text-indigo-700">
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};