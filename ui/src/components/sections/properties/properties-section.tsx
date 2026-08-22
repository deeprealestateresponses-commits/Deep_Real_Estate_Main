import { cn } from '@/lib/utils';
import { PropertyCard, type Property } from './property-card';
import { featuredProperties, propertyHref } from './properties-data';

/** Gradient stops for the CTA — the same three-stop ramp as the contact form's
    submit, so every filled control on the page shares one recipe. */
const ACCENT = {
  from: '#0b9ae0',
  mid: '#0080c6',
  to: '#00618f',
  glow: 'rgba(0,128,198,0.30)',
};

export type PropertiesSectionProps = {
  /** Big coloured title. */
  title?: string;
  /** Second line under the title. */
  heading?: string;
  lede?: string;
  items?: Property[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Secondary action under the CTA — the whole book, not just these two. */
  browseLabel?: string;
  browseHref?: string;
  /** Occupy exactly one viewport, lg and up. */
  fill?: boolean;
  className?: string;
};

/**
 * Homepage section — Featured properties.
 *
 * Cards lead and the copy sits beside them. The heading block used to run full
 * width above the row, which pushed the listings under the fold; in a column
 * next to them, both fit one screen.
 *
 * The two listings come from the shared property data, which the Properties
 * page reads as well — the home page shows the top of a book it does not own a
 * private copy of.
 *
 * Both cards and the second action lead to the Properties page. The section
 * shows two of fourteen, so every route out of it has to reach the rest.
 */
export const PropertiesSection = ({
  title = 'Featured Properties',
  heading = 'Handpicked listings',
  lede = 'A current selection from our residential and commercial books — with the pricing context to judge them.',
  items = featuredProperties,
  ctaLabel = 'Get more info',
  ctaHref = '#contact-page',
  browseLabel = 'Explore more properties',
  browseHref = '#properties-page',
  fill = false,
  className,
}: PropertiesSectionProps) => {
  return (
    <section
      // the welcome section's "Browse Properties" scrolls here
      id="featured-properties"
      className={cn(
        'w-full scroll-mt-20 bg-background',
        fill && 'lg:flex lg:h-full lg:min-h-0 lg:items-center',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-[1400px] px-5 sm:px-8',
          /* Pulled in a step from py-10/py-12. The aside gained a second
             action below the CTA, and in `fill` the whole section still has to
             land inside one viewport — the height for the new button comes out
             of the section's own padding rather than off the bottom of the
             cards. */
          fill ? 'py-8 lg:py-6' : 'py-8 sm:py-10',
        )}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_330px] lg:items-center lg:gap-10">
          {/* ------------------------------------------------------- cards */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Each card opens that property's own page. The card has always
                  been an anchor; until now it had no href to give it, so
                  clicking a listing did nothing. The button below is what goes
                  to the index — a card should open the thing it pictures. */}
              {items.map((p) => (
                <PropertyCard key={p.id} property={{ ...p, href: p.href ?? propertyHref(p.id) }} />
              ))}
            </div>

            {/* Says what is true rather than filling the row with invented
                stock. */}
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed py-16 text-center">
                <p className="text-[15px] font-medium text-foreground">
                  Nothing listed here at the moment.
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Call the office and we will send what is currently on the book.
                </p>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------- copy */}
          <aside className="order-1 lg:order-2">
            <h2 className="text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-[2.9rem]">
              <span className="bg-[linear-gradient(100deg,#0b9ae0_0%,#0080c6_45%,#00618f_100%)] bg-clip-text text-transparent">
                {title}
              </span>
            </h2>

            <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{heading}</p>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-muted-foreground">{lede}</p>

            {/* Filled rather than outlined, with a shine crossing it on a loop —
                this is the one thing on the section we want pressed, and an
                outlined pill read like a footnote. The sheen sits inside the
                button's own overflow, so it never escapes the rounded edge. */}
            <div className="mt-5 flex flex-col items-start gap-3">
              <a
                href={ctaHref}
                className="group/cta relative isolate inline-flex h-12 cursor-pointer items-center gap-2 overflow-hidden rounded-full px-8 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_var(--cta-glow)] transition-transform duration-300 hover:-translate-y-0.5"
                style={
                  {
                    background: `linear-gradient(120deg, ${ACCENT.from} 0%, ${ACCENT.mid} 50%, ${ACCENT.to} 100%)`,
                    '--cta-glow': ACCENT.glow,
                  } as React.CSSProperties
                }
              >
                <span
                  aria-hidden="true"
                  className="animate-sheen pointer-events-none absolute inset-y-0 -z-10 w-10 bg-white/40 motion-reduce:hidden"
                  style={{ animationDuration: '2.4s', animationIterationCount: 'infinite' }}
                />
                {ctaLabel}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>

              {/* Outlined, directly under the filled one. Two filled pills of
                  the same weight would compete, and this is the second thing
                  to do here, not the first — "Get more info" starts a
                  conversation, this one just goes and looks. */}
              <a
                href={browseHref}
                className="group/browse inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-primary/30 px-6 text-[14px] font-bold text-primary transition-colors duration-300 hover:border-primary hover:bg-primary/5"
              >
                {browseLabel}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover/browse:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
