import { useEffect, useRef } from 'react';
import { LogoMarquee, type Logo } from '@/components/ui/logo-marquee/logo-marquee';
import { cn } from '@/lib/utils';

export type BrandsSectionProps = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  rowOne?: Logo[];
  rowTwo?: Logo[];
  /** Background video. Pass '' to fall back to the flat tint. */
  videoSrc?: string;
  /** Shown while the video loads, and instead of it under reduced motion. */
  videoPoster?: string;
  fill?: boolean;
  className?: string;
};

/* Every developer logo carried over from the live site's
   admin/assets/uploadedDevelopersLogo, normalised to one height. */
const defaultRowOne: Logo[] = [
  { name: 'DLF', src: '/img/brands/dlf.png' },
  { name: 'Emaar', src: '/img/brands/emaar.png' },
  { name: 'Unitech', src: '/img/brands/unitech.png' },
  { name: 'BPTP', src: '/img/brands/bptp.png' },
  { name: 'Bestech', src: '/img/brands/bestech.png' },
  { name: 'Parsvnath', src: '/img/brands/parsvnath.png' },
  { name: 'Ansal API', src: '/img/brands/ansal-api.png' },
  { name: 'Central Park', src: '/img/brands/central-park.png' },
  { name: 'Spaze', src: '/img/brands/spaze.png' },
];

const defaultRowTwo: Logo[] = [
  { name: 'Ansal Housing', src: '/img/brands/ansal-housing.png' },
  { name: 'Suncity', src: '/img/brands/suncity.png' },
  { name: 'Earth', src: '/img/brands/earth.png' },
  { name: 'Erose', src: '/img/brands/erose.png' },
  { name: 'SS Group', src: '/img/brands/ss-group.png' },
  { name: 'Antariksh', src: '/img/brands/antariksh.png' },
  { name: 'Universal', src: '/img/brands/universal.png' },
  { name: 'KLJ', src: '/img/brands/klj.png' },
];

/**
 * Homepage section — Ask about property.
 *
 * Two marquee rows travelling in opposite directions. Counter-motion reads as
 * deliberate; two rows going the same way looks like one broken row.
 */
export const BrandsSection = ({
  eyebrow = 'Our Partners',
  heading = 'Developers we work with',
  /* No lede: this paragraph now opens the page, in the welcome section. Running
     it again here would repeat the same sentences twice on one screen-scroll. */
  lede = '',
  rowOne = defaultRowOne,
  rowTwo = defaultRowTwo,
  videoSrc = '/video/brands-bg.mp4',
  videoPoster = '/img/bg/city.jpg',
  fill = false,
  className,
}: BrandsSectionProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* Autoplaying video is motion the user did not ask for; under
     prefers-reduced-motion we hold the poster frame instead.
     Otherwise it only plays while the section is on screen — decoding a
     1080p loop off-screen was costing frames on every scroll. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('autoplay');
      el.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn(
        'relative isolate w-full overflow-hidden bg-[#06121b]',
        fill && 'lg:flex lg:h-full lg:min-h-0 lg:items-center',
        className,
      )}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          src={videoSrc}
          poster={videoPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      {/* Legibility wash. The logo tiles are white and the copy is white, so
          the footage has to sit well back. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,18,27,0.90)_0%,rgba(6,18,27,0.74)_45%,rgba(6,18,27,0.92)_100%)]"
      />

      <div
        className={cn(
          'mx-auto w-full max-w-[1400px]',
          fill ? 'py-16 lg:py-12' : 'py-20 sm:py-24',
        )}
      >
        <div className="px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-sky-300/70" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                {eyebrow}
              </p>
              <span className="h-px w-8 bg-sky-300/70" />
            </div>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-[2.6rem]">
              {heading}
            </h2>
            {lede && <p className="mt-5 text-[16px] leading-[1.7] text-white/72">{lede}</p>}
          </div>
        </div>

        {/* full-bleed rows — the marquee should run off both edges, so these sit
            outside the padded container */}
        <div className={cn('space-y-5', fill ? 'mt-10' : 'mt-14')}>
          <LogoMarquee logos={rowOne} direction="left" duration={45} />
          <LogoMarquee logos={rowTwo} direction="right" duration={45} />
        </div>
      </div>
    </section>
  );
};
