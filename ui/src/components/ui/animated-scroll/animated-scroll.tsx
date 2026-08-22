import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/*
  Integration notes (differences from the source snippet):

  - The snippet listens on `window` and swallows every wheel event for as long
    as it is mounted. Dropped into a long page that traps the visitor: they
    scroll, the page does not move, and the only way out is the scrollbar. The
    listener is on the section here, it only engages while the section actually
    fills the viewport, and it hands the wheel straight back at the first and
    last panel so the page carries on scrolling past.
  - Panels come in as props. The snippet hardcoded five pages of Unsplash
    placeholder copy.
  - Below lg the panels stack and scroll normally. A half-width split is
    unreadable on a phone, and a full-screen wheel takeover on a touch device
    with no touch handler is a dead end.
  - Arrow keys only act while the section is engaged, and only when the event
    did not come from a form control — the contact form lives inside one of
    these panels, and Up/Down in a textarea must move the caret.
*/

export type ScrollPanel = {
  id: string;
  left: ReactNode;
  right: ReactNode;
};

export type AnimatedScrollProps = {
  panels: ScrollPanel[];
  /** Milliseconds for one slide; also the lockout between wheel steps. */
  animTime?: number;
  className?: string;
};

export const AnimatedScroll = ({ panels, animTime = 900, className }: AnimatedScrollProps) => {
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const locked = useRef(false);

  /* "Engaged" means the section is the thing on screen. Anything less and the
     visitor is still reading the section above or below it, and taking their
     wheel would be theft. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setEngaged(entry.intersectionRatio > 0.92), {
      threshold: [0, 0.5, 0.92, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const step = (down: boolean) => {
    if (locked.current) return;
    locked.current = true;
    setIndex((i) => Math.min(panels.length - 1, Math.max(0, i + (down ? 1 : -1))));
    window.setTimeout(() => {
      locked.current = false;
    }, animTime);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!engaged) return;
      if (!window.matchMedia('(min-width: 1024px)').matches) return;

      const down = e.deltaY > 0;
      // At the ends, give the wheel back so the page scrolls out of the section
      if ((down && index === panels.length - 1) || (!down && index === 0)) return;

      e.preventDefault();
      step(down);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!engaged) return;
      const t = e.target as HTMLElement | null;
      // never steal arrows from a field the visitor is typing in
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

      const down = e.key === 'ArrowDown';
      if ((down && index === panels.length - 1) || (!down && index === 0)) return;
      e.preventDefault();
      step(down);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engaged, index, panels.length, animTime]);

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full overflow-hidden bg-[#04070b] lg:h-dvh', className)}
    >
      {/* ------------------------------------------------------------ phone */}
      {/* Stacked and ordinary. No takeover, no halves. */}
      <div className="lg:hidden">
        {panels.map((p) => (
          <div key={p.id}>
            <div>{p.left}</div>
            <div>{p.right}</div>
          </div>
        ))}
      </div>

      {/* ----------------------------------------------------------- desktop */}
      <div className="hidden lg:block lg:h-full">
        {panels.map((panel, i) => {
          const isActive = i === index;
          /* The signature move: the halves leave in opposite directions, so a
             step reads as one thing tearing apart rather than two slides. */
          return (
            <div key={panel.id} className="absolute inset-0" aria-hidden={!isActive}>
              <div
                className="absolute left-0 top-0 h-full w-1/2 transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(100%)',
                  transitionDuration: `${animTime}ms`,
                }}
              >
                <div className="h-full w-full overflow-hidden">{panel.left}</div>
              </div>

              <div
                className="absolute left-1/2 top-0 h-full w-1/2 transition-transform ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(-100%)',
                  transitionDuration: `${animTime}ms`,
                }}
              >
                <div className="h-full w-full overflow-hidden">{panel.right}</div>
              </div>
            </div>
          );
        })}

        {/* Position, and a way through without a wheel. */}
        <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {panels.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to panel ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                i === index ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedScroll;
