import { cn } from '@/lib/utils';

export type Review = {
  name: string;
  text: string;
  /** Out of 5. */
  rating: number;
  source: string;
};

/**
 * The reviews the live site publishes on its home page, carried over as
 * written. They come from the site's Google reviews widget.
 */
export const reviews: Review[] = [
  {
    name: 'Neeta Rani',
    text: 'Dealing with Deep Real Estate is very amazing experience..Very helpful staff and owner is very responsible and supportive.Will highly recommend it to others.Thankyou',
    rating: 5,
    source: 'Google',
  },
  {
    name: 'Anil kumar Sharma',
    text: 'One of the best real estate broker in Gurugram. Hardworking honest and quality conscience builder.',
    rating: 5,
    source: 'Google',
  },
  {
    name: 'anamika wadhera',
    text: 'Excellent experience 👏 👌 dealing with property consultants. Fair deal',
    rating: 5,
    source: 'Google',
  },
  {
    name: 'Abhishek Chauhan',
    text: 'Company do good work with efforts and they are try to give you as you want.',
    rating: 5,
    source: 'Google',
  },
];

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn('h-4 w-4', i < rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-muted-foreground/40')}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

/** The G mark, drawn rather than fetched — no external request for a 16px glyph. */
const GoogleMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.57-5.17 3.57-8.87z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

export type ReviewsSectionProps = {
  items?: Review[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Fill the remaining height of a viewport-height page. */
  fill?: boolean;
  className?: string;
};

/**
 * Home page — what clients said.
 *
 * Sits between the properties grid and the contact form: you have just looked
 * at what is on offer, and the next thing asked of you is your phone number.
 * Other people vouching for the office is what belongs in between.
 */
export const ReviewsSection = ({
  items = reviews,
  eyebrow = 'What people said',
  heading = 'Our Sweet Testimonials',
  lede = 'Verified Google reviews from our valued clients',
  fill = false,
  className,
}: ReviewsSectionProps) => (
  <section
    className={cn(
      'w-full bg-muted/40',
      fill && 'lg:flex lg:h-full lg:min-h-0 lg:items-center',
      className,
    )}
  >
    <div className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-primary" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-2xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
          {/* Highlighter, painted as the text's own background so it follows
              every line box. An absolutely positioned bar only ever covers the
              last line once the heading wraps. */}
          <span className="box-decoration-clone bg-[linear-gradient(transparent_62%,rgb(0_128_198/0.3)_62%)]">
            {heading}
          </span>
        </h2>
        <p className="text-[15px] text-muted-foreground">{lede}</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((review) => (
          <figure
            key={review.name}
            className="flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <StarRow rating={review.rating} />

            <blockquote className="mt-4 flex-1 text-[15px] leading-[1.7] text-foreground">
              {review.text}
            </blockquote>

            <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
              {/* initial, so the card has a face without loading an avatar */}
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary"
              >
                {review.name.trim().charAt(0)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold capitalize text-foreground">
                  {review.name}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GoogleMark className="h-3.5 w-3.5" />
                  Posted on {review.source}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
