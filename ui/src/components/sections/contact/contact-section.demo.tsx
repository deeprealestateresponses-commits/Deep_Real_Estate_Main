import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SearchBand } from '@/components/sections/search/search-band';
import { WelcomeSection } from '@/components/sections/welcome/welcome-section';
import { MapsSection } from '@/components/sections/maps/maps-section';
import { StatsBand } from '@/components/sections/stats/stats-band';
import { PropertiesSection } from '@/components/sections/properties/properties-section';
import { ContactSection } from './contact-section';

/** The section on its own. */
export const Standalone = () => (
  <div className="min-h-dvh bg-background">
    <ContactSection />
  </div>
);

/**
 * The home page — four screens.
 *   1 · header + search + welcome
 *   2 · maps, closed by the stats strip
 *   3 · featured & top properties
 *   4 · contact form + process flow
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
      <div className="lg:min-h-0 lg:flex-1">
        <MapsSection fill />
      </div>
      <div className="shrink-0">
        <StatsBand />
      </div>
    </section>

    <section className="lg:h-dvh">
      <PropertiesSection fill />
    </section>

    <section className="lg:min-h-dvh">
      <ContactSection fill />
    </section>
  </div>
);
