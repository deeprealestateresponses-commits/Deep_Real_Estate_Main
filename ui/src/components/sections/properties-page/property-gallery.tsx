import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type PropertyGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
  /** Height classes for the frame. The hero and the Gallery box want different ones. */
  frameClassName?: string;
};

const Chevron = ({ className, dir }: { className?: string; dir: 'prev' | 'next' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
  </svg>
);

/**
 * The photographs, one at a time, with previous / next.
 *
 * All the frames stay mounted and are cross-faded rather than swapped, so
 * moving between them does not re-request an image that has already been
 * decoded — with four full-width photographs a straight swap flashes the empty
 * frame on every click.
 *
 * Arrow keys work whenever the gallery has focus, and the dots are real
 * buttons, so this is navigable without a mouse.
 */
export const PropertyGallery = ({
  images,
  alt,
  className,
  frameClassName,
}: PropertyGalleryProps) => {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  useEffect(() => {
    // clamp if the list ever shrinks under us
    if (index > count - 1) setIndex(0);
  }, [count, index]);

  return (
    <div
      className={cn('group/gal relative overflow-hidden bg-muted', className)}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt} — ${count} photographs`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(-1);
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(1);
        }
      }}
    >
      <div className={cn('relative w-full', frameClassName)}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === index ? alt : ''}
            aria-hidden={i === index ? undefined : true}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out motion-reduce:transition-none',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Always visible on touch, where there is no hover to reveal them. */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photograph"
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white sm:opacity-0 sm:group-hover/gal:opacity-100 sm:group-focus-within/gal:opacity-100"
          >
            <Chevron dir="prev" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photograph"
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white sm:opacity-0 sm:group-hover/gal:opacity-100 sm:group-focus-within/gal:opacity-100"
          >
            <Chevron dir="next" className="h-4 w-4" />
          </button>

          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11.5px] font-bold tabular-nums text-white backdrop-blur-sm">
            {index + 1} / {count}
          </span>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to photograph ${i + 1}`}
                aria-current={i === index || undefined}
                className={cn(
                  'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
