import { cn } from '@/lib/utils';

export type Property = {
  id: string | number;
  name: string;
  location: string;
  /** Pre-formatted, e.g. "₹ 2.4 Cr" — the site's getPrice() already returns text. */
  price: string;
  /** Secondary price line, e.g. "₹ 12,500 / Sq.Ft." */
  priceUnit?: string;
  developer?: string;
  image: string;
  /** Corner pill — "Residential", "Commercial", "New Launch". */
  badge?: string;
  /** Up to three short facts shown in the spec row. */
  specs?: { label: string; value: string }[];
  href?: string;
};

/**
 * One property card, used by both tabs so the two sets cannot drift apart.
 *
 * Arrangement rules:
 *  - Fixed 4:3 image frame, object-cover — uploads vary from 960×540 to
 *    4032×3024, and a shared frame is what makes a row read as a set.
 *  - Cards are flex columns with the spec row pushed down by `mt-auto`, so the
 *    price and specs sit on one baseline across the row regardless of whether
 *    a title wraps to two lines.
 *  - Price is the largest text in the card. It is the number people scan for,
 *    and on the current site it is set smaller than the property title.
 */
export const PropertyCard = ({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) => {
  const { name, location, price, priceUnit, developer, image, badge, specs, href } = property;

  return (
    <a
      href={href ?? '#'}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border bg-card',
        'shadow-[0_10px_30px_-18px_rgb(0_0_0/0.4)] transition-all duration-300',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_22px_50px_-24px_rgb(0_0_0/0.45)]',
        className,
      )}
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
            {badge}
          </span>
        )}
        {developer && (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
            {developer}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="truncate">{location}</span>
        </p>

        {/* mt-auto pins everything below to the card bottom, so prices align
            across the row even when one title wraps */}
        <div className="mt-auto pt-4">
          {specs && specs.length > 0 && (
            <ul className="mb-3 flex items-center gap-4 border-t pt-3 text-[11px] text-muted-foreground">
              {specs.slice(0, 3).map((s) => (
                <li key={s.label} className="min-w-0">
                  <span className="block truncate font-semibold text-foreground">{s.value}</span>
                  <span className="block truncate">{s.label}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-lg font-bold tracking-tight text-foreground">
                {price}
              </span>
              {priceUnit && (
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {priceUnit}
                </span>
              )}
            </div>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};
