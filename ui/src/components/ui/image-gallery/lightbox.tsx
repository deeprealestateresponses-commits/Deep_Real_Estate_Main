import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryItem } from './image-gallery';

export type LightboxProps = {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

/**
 * Full-screen map viewer.
 *
 * Portaled to <body>: a fixed overlay rendered inside a section that has a
 * transform, filter or backdrop-filter anywhere in its ancestry would size
 * itself to that ancestor rather than the viewport.
 */
export const Lightbox = ({ items, index, onClose, onIndexChange }: LightboxProps) => {
  const open = index !== null;
  const item = open ? items[index] : null;
  const [loaded, setLoaded] = useState(false);

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      setLoaded(false);
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => setLoaded(false), [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, go]);

  if (!open || !item) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} map`}
      className="fixed inset-0 z-[100] flex flex-col bg-[#05101a]/96"
    >
      {/* bar */}
      <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{item.name}</p>
          <p className="text-xs text-white/50">
            {index + 1} of {items.length}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={item.full}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Open full size
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* stage — click the backdrop to dismiss */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {!loaded && (
          <span className="absolute text-sm text-white/50">Loading map…</span>
        )}
        <img
          src={item.full}
          alt={`${item.name} map`}
          onLoad={() => setLoaded(true)}
          className={`max-h-full max-w-full rounded-lg object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous map"
              className="absolute left-3 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/40 text-white/85 transition-colors hover:bg-white/15 sm:left-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next map"
              className="absolute right-3 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/40 text-white/85 transition-colors hover:bg-white/15 sm:right-6"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};
