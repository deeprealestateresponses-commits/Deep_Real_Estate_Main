import React from 'react';
import { useInView } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

/* Integration notes (differences from the source snippet):
   - The original generated random picsum images and picked the aspect ratio
     with Math.random() on every render. That is non-deterministic: React
     re-renders would reshuffle every tile's shape. Ratio is now derived from
     the item itself, so a tile keeps its shape.
   - It rendered a fixed 3 x 10 grid of placeholders. It now takes real items.
   - Tiles are buttons, so a map can be opened. */

export type GalleryItem = {
  name: string;
  thumb: string;
  full: string;
};

export type ImageGalleryProps = {
  items: GalleryItem[];
  columns?: number;
  onOpen?: (item: GalleryItem) => void;
  className?: string;
};

/**
 * Masonry-style gallery. Items are dealt column-by-column so each column's
 * heights stay independent — a CSS grid would force every row to the tallest
 * tile and leave gaps under the shorter ones.
 */
export function ImageGallery({ items, columns = 3, onOpen, className }: ImageGalleryProps) {
  const cols: GalleryItem[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));

  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {cols.map((col, i) => (
        <div key={i} className="grid content-start gap-5">
          {col.map((item) => (
            <AnimatedImage key={item.name} item={item} onOpen={onOpen} />
          ))}
        </div>
      ))}
    </div>
  );
}

function AnimatedImage({
  item,
  onOpen,
}: {
  item: GalleryItem;
  onOpen?: (item: GalleryItem) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '200px' });
  const [isLoading, setIsLoading] = React.useState(true);
  const [failed, setFailed] = React.useState(false);

  return (
    <AspectRatio
      ref={ref}
      ratio={3 / 2}
      className="group relative size-full overflow-hidden rounded-xl border bg-muted"
    >
      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="absolute inset-0 h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={`Open ${item.name} map`}
      >
        {/* Only request the file once the tile is near the viewport. With 74
            maps on the page, loading them all up front would be a lot of
            megabytes for images most visitors never scroll to. */}
        {isInView && !failed && (
          <img
            alt={item.name}
            src={item.thumb}
            onLoad={() => setIsLoading(false)}
            onError={() => setFailed(true)}
            loading="lazy"
            decoding="async"
            className={cn(
              'size-full object-cover transition-all duration-700 ease-out',
              isLoading ? 'opacity-0' : 'opacity-100 group-hover:scale-[1.04]',
            )}
          />
        )}

        {failed && (
          <span className="absolute inset-0 grid place-items-center px-3 text-center text-xs text-muted-foreground">
            {item.name}
          </span>
        )}

        {/* label */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-3 pt-8 text-left">
          <span className="block truncate text-[13px] font-semibold text-white">
            {item.name}
          </span>
        </span>
      </button>
    </AspectRatio>
  );
}
