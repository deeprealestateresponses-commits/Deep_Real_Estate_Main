import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 to `end` once the element scrolls into view.
 * Returns a ref to attach and the current value.
 *
 * Honours prefers-reduced-motion by jumping straight to the final number —
 * an animated counter is decorative, and users who ask for less motion should
 * still see the figure.
 */
export function useCountUp(end: number, durationMs = 1400) {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(end);
      return;
    }

    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min((now - start) / durationMs, 1);
        // ease-out cubic: fast start, gentle settle
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(end * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, durationMs]);

  return { ref, value };
}
