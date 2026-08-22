import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SearchBand } from '@/components/sections/search/search-band';
import { WelcomeSection } from '@/components/sections/welcome/welcome-section';
import { MapsSection } from '@/components/sections/maps/maps-section';
import { PropertiesSection } from '@/components/sections/properties/properties-section';
import { StatsBand } from './stats-band';

/** The band on its own, between two plain blocks, to judge its height. */
export const Standalone = () => (
  <div className="min-h-dvh bg-background">
    <div className="grid h-[40vh] place-items-center text-sm text-muted-foreground">
      section above
    </div>
    <StatsBand />
    <div className="grid h-[40vh] place-items-center text-sm text-muted-foreground">
      section below
    </div>
  </div>
);

/**
 * The home page — three screens.
 *   1 · header + search + welcome        (back to exactly one screen)
 *   2 · maps, closed by the stats strip
 *   3 · featured & top properties
 *
 * The strip rides at the bottom of screen 2 rather than standing between the
 * two screens. At 104px it is far too short to hold a screen of its own, and
 * riding the bottom of the maps screen puts it exactly where it was asked for —
 * after maps, before properties.
 *
 * Screen 2 alone is `min-h-dvh`, since it is the one now carrying the extra
 * 104px and would otherwise overlap on a short laptop. 1 and 3 are locked to
 * `h-dvh`.
 */
export const HomeSoFar = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    <section className="flex flex-col lg:h-dvh">
      <div className="shrink-0">
        <SiteHeader activeIndex={0} />
        <SearchBand onSearch={(q) => console.log('search:', q)} />
      </div>
      <div className="lg:min-h-0 lg:flex-1">
        <WelcomeSection fill />
      </div>
    </section>

    <section className="flex flex-col lg:min-h-dvh">
      <MapsSection fill className="lg:min-h-0 lg:flex-1" />
      <div className="shrink-0">
        <StatsBand />
      </div>
    </section>

    <section className="lg:h-dvh">
      <PropertiesSection fill />
    </section>
  </div>
);
