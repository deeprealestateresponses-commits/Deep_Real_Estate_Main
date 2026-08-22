import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SearchBand } from '@/components/sections/search/search-band';
import { WelcomeSection } from '@/components/sections/welcome/welcome-section';
import { MapsSection } from '@/components/sections/maps/maps-section';
import { PropertiesSection } from './properties-section';

/** The section on its own. */
export const Standalone = () => (
  <div className="min-h-dvh bg-background">
    <PropertiesSection />
  </div>
);

/**
 * The home page so far — three screens, one section each, scrolled normally.
 * 1 · header + search + welcome   2 · maps   3 · featured & top properties
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

    <section className="lg:h-dvh">
      <MapsSection fill />
    </section>

    <section className="lg:h-dvh">
      <PropertiesSection fill />
    </section>
  </div>
);
