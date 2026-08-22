import { useEffect, useState } from 'react';
import { StarButton } from '@/components/ui/star-button';
import { cn } from '@/lib/utils';

export type ScrollCueProps = {
  /** Element to scroll to when clicked. Falls back to one viewport down. */
  targetId?: string;
  label?: string;
  className?: string;
};

/**
 * "There is more below" — a nudge for a first screen that fills the viewport
 * exactly and so gives no visual hint that the page continues.
 *
 * It hides itself once the page has actually been scrolled: an arrow still
 * pointing down after you have started reading is noise.
 */
export const ScrollCue = ({ targetId, label = 'Scroll', className }: ScrollCueProps) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // the scroll may belong to the window or to an ancestor container, so
    // listen in the capture phase and take whatever reports movement
    const onScroll = (e: Event) => {
      const t = e.target as Document | HTMLElement;
      const top = t instanceof HTMLElement ? t.scrollTop : window.scrollY;
      setHidden(top > 24);
    };
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, []);

  const handleClick = () => {
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollBy({ top: window.innerHeight * 0.9, behavior: 'smooth' });
  };

  return (
    /* Same travelling light as the "Get more info" CTA, so the two read as the
       same kind of control rather than two unrelated inventions. */
    <StarButton
      onClick={handleClick}
      aria-label={`${label} — there is more below`}
      lightColor="#0080C6"
      className={cn(
        'group h-11 gap-2 px-6 text-sm font-semibold transition-opacity duration-300',
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
        className,
      )}
    >
      {label}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 animate-nudge-down motion-reduce:animate-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </StarButton>
  );
};
