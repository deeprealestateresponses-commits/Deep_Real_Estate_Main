import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type RailItem = {
  /** DOM id of the section this chip jumps to. Omit for the "All" chip. */
  id?: string;
  label: string;
  /** Optional tally. Omit where a number would be noise — a privacy policy's
      chip does not want "7" after it. */
  count?: number;
};

export type SectionRailProps = {
  items: RailItem[];
  /** Rendered at the right of the rail — the docs page puts its search here. */
  trailing?: React.ReactNode;
  className?: string;
};

/**
 * The index rail for a long index page.
 *
 * Sticks directly under the site header (h-20), so it stays available through
 * 74 maps or 27 documents. It highlights whichever section is currently
 * crossing the top of the viewport, which is what gives a long scroll a sense
 * of place — a plain chip list does not.
 */
export const SectionRail = ({ items, trailing, className }: SectionRailProps) => {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const ids = items.map((i) => i.id).filter(Boolean) as string[];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    /* rootMargin pulls the trip-line down to just under the header and up from
       the bottom, so "active" means "the section you are actually reading"
       rather than "anything visible at all". */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const go = (id?: string) => {
    if (!id) {
      // "All" returns to the top of the list rather than the top of the page
      const first = items.find((i) => i.id)?.id;
      const el = first ? document.getElementById(first) : null;
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={cn(
        'sticky top-20 z-30 w-full border-b bg-background/85 backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-5 py-3 sm:px-8">
        {/* the chips scroll horizontally on a phone rather than wrapping to
            three rows and eating the screen */}
        <div className="-mx-1 flex flex-1 items-center gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const isActive = item.id ? activeId === item.id : !activeId;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => go(item.id)}
                className={cn(
                  'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:text-primary',
                )}
              >
                {item.label}
                {item.count != null && (
                  <span className={cn('text-[11px]', isActive ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {trailing && <div className="hidden shrink-0 md:block">{trailing}</div>}
      </div>
    </div>
  );
};
