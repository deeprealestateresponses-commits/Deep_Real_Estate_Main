import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SearchBand } from '@/components/sections/search/search-band';
import { WelcomeSection } from '@/components/sections/welcome/welcome-section';
import { MapsSection } from './maps-section';

/** The section on its own. */
export const Standalone = () => (
  <div className="min-h-dvh bg-background">
    <MapsSection />
  </div>
);

/**
 * The home page as it stands — one section per screen.
 *
 * The page scrolls normally: each screen is still `lg:h-dvh`, so the layout is
 * unchanged, but nothing intercepts the scroll or snaps it to a section
 * boundary. The wheel does what the user asked it to do.
 */
export const HomeSoFar = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    {/* screen 1 — header + search + welcome */}
    <section className="flex flex-col lg:h-dvh">
      <div className="shrink-0">
        <SiteHeader activeIndex={0} />
        <SearchBand onSearch={(q) => console.log('search:', q)} />
      </div>
      <div className="lg:min-h-0 lg:flex-1">
        <WelcomeSection fill />
      </div>
    </section>

    {/* screen 2 — maps */}
    <section className="lg:h-dvh">
      <MapsSection fill />
    </section>
  </div>
);

