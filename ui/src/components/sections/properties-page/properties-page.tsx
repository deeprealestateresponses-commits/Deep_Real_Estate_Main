import { GooeySearchBar } from '@/components/ui/animated-search-bar/animated-search-bar';
import { PropertyCard } from '@/components/sections/properties/property-card';
import {
  featuredProperties,
  propertyHref,
  type PropertyDetail,
} from '@/components/sections/properties/properties-data';
import { cn } from '@/lib/utils';

export type PropertiesPageProps = {
  items?: PropertyDetail[];
  title?: string;
  className?: string;
};

/**
 * Properties index.
 *
 * A fixed 100px band under the navbar carries the title on the left and the
 * search on the right, then the cards run underneath it. The band is a real
 * strip with its own ground and a rule below, so it reads as part of the site
 * chrome rather than as the first thing on the page.
 *
 * No chip rail and no hero: those belong to Maps and Documents, which are
 * indexes of *files* and need finding aids. Two photographed properties do
 * not, and the same chrome made this read as a third documents page.
 */
export const PropertiesPage = ({
  items = featuredProperties,
  title = 'Featured Properties',
  className,
}: PropertiesPageProps) => (
  <div className={cn('w-full bg-background', className)}>
    {/* ------------------------------------------------------------- band */}
    {/* Fixed height at sm and up. It stays `h-auto` below that, because a
        title and a search control cannot sit side by side at phone width
        without one of them being squeezed to nothing. */}
    <section className="w-full border-b bg-[linear-gradient(160deg,#f1f7fc_0%,#e6f0f9_100%)]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-5 py-6 sm:h-[100px] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-0">
        <h1 className="text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-[2.1rem]">
          <span className="bg-[linear-gradient(100deg,#0b9ae0_0%,#0080c6_45%,#00618f_100%)] bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        {/* The results blob downwards out of the pill, so this sits in a
            zero-height slot and overflows the band rather than stretching it. */}
        <div className="relative z-20 shrink-0 sm:h-12 sm:w-[320px]">
          <div className="sm:absolute sm:right-0 sm:top-0">
            <GooeySearchBar
              tone="dark"
              buttonLabel="Search"
              placeholder="Name or locality…"
              items={items.map((p) => ({
                label: p.name,
                hint: p.location,
                href: propertyHref(p.id),
              }))}
            />
          </div>
        </div>
      </div>
    </section>

    {/* ------------------------------------------------------------ cards */}
    <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((p) => (
          <PropertyCard key={p.id} property={{ ...p, href: propertyHref(p.id) }} />
        ))}
      </div>
    </div>
  </div>
);
