import { cn } from '@/lib/utils';

export type Logo = {
  name: string;
  src: string;
};

export type LogoMarqueeProps = {
  logos: Logo[];
  direction?: 'left' | 'right';
  /** Seconds for one full pass. Larger = slower. */
  duration?: number;
  className?: string;
};

/**
 * A single scrolling row of logos.
 *
 * The track renders the set twice and animates by exactly -50%, so the loop
 * lands on an identical frame with no visible jump. The duplicate is
 * aria-hidden so screen readers hear each brand once.
 */
export const LogoMarquee = ({
  logos,
  direction = 'left',
  duration = 40,
  className,
}: LogoMarqueeProps) => {
  const row = (hidden: boolean) =>
    logos.map((logo) => (
      <li
        key={`${hidden ? 'dup' : 'orig'}-${logo.name}`}
        className="flex shrink-0 items-center"
        aria-hidden={hidden || undefined}
      >
        <span className="flex h-[74px] w-[168px] items-center justify-center rounded-xl border bg-white px-5 shadow-[0_2px_10px_-6px_rgb(0_0_0/0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(0_0_0/0.45)]">
          <img
            src={logo.src}
            alt={hidden ? '' : logo.name}
            loading="lazy"
            className="max-h-[42px] w-auto max-w-full object-contain opacity-75 transition-opacity duration-300 hover:opacity-100"
          />
        </span>
      </li>
    ));

  return (
    <div
      className={cn('group/marquee relative overflow-hidden', className)}
      /* the fade is a mask so it works on any background, unlike a gradient
         overlay which would need to know the section colour */
      style={{
        maskImage:
          'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)',
      }}
    >
      <ul
        className="flex w-max items-center gap-5 motion-reduce:animate-none"
        style={{
          animation: `${direction === 'left' ? 'marquee-left' : 'marquee-right'} ${duration}s linear infinite`,
          animationPlayState: 'running',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
};
