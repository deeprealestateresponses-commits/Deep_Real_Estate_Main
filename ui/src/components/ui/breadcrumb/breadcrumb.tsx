import { cn } from '@/lib/utils';

export type Crumb = {
  label: string;
  /** Omit on the last crumb — the page you are already on is not a link. */
  href?: string;
};

export type BreadcrumbProps = {
  items: Crumb[];
  /** Prepended automatically unless this is false. */
  includeHome?: boolean;
  homeHref?: string;
  /**
   * 'bar'    — full-width chrome with its own ground and a rule under it, for
   *            sitting directly beneath the header.
   * 'inline' — no ground, no rule, no measure of its own; takes the width of
   *            whatever it is dropped into. The property page puts its trail
   *            inside the page container, under the hero.
   */
  variant?: 'bar' | 'inline';
  className?: string;
};

/**
 * The trail under the navbar: Home › Section › This page.
 *
 * A slim full-width bar with a rule under it, so it belongs to the site
 * chrome rather than to whatever band follows it. Sits directly beneath the
 * header on every page that is not the home page.
 *
 * The last crumb is deliberately not a link — a link to the page you are
 * already on is a dead control, and screen readers announce it as one. It
 * carries aria-current="page" instead.
 */
export const Breadcrumb = ({
  items,
  includeHome = true,
  homeHref = '#home-so-far',
  variant = 'bar',
  className,
}: BreadcrumbProps) => {
  const crumbs: Crumb[] = includeHome ? [{ label: 'Home', href: homeHref }, ...items] : items;
  const isBar = variant === 'bar';

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('w-full', isBar && 'border-b bg-muted/40', className)}
    >
      <ol
        className={cn(
          'flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]',
          isBar ? 'mx-auto w-full max-w-[1400px] px-5 py-3 sm:px-8' : 'px-1 py-4',
        )}
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-2">
              {c.href && !isLast ? (
                <a href={c.href} className="text-muted-foreground transition-colors hover:text-primary">
                  {c.label}
                </a>
              ) : (
                <span aria-current="page" className="font-semibold text-foreground">
                  {c.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
