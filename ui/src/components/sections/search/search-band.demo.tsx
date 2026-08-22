import { SiteHeader } from '@/components/ui/navbar/site-header';
import { WelcomeSection } from '@/components/sections/welcome/welcome-section';
import { SearchBand } from './search-band';

/**
 * The requested arrangement: header → search → welcome, all inside one screen.
 * The page is a fixed-height flex column; the welcome section takes whatever
 * height is left (`flex-1 min-h-0`) rather than adding to the page, so nothing
 * scrolls. Below lg it reverts to normal document flow.
 */
export const InPage = () => (
  <div className="flex min-h-dvh flex-col bg-background lg:h-dvh lg:overflow-hidden">
    <div className="shrink-0">
      <SiteHeader activeIndex={0} />
      <SearchBand onSearch={(q) => console.log('search:', q)} />
    </div>
    <div className="lg:min-h-0 lg:flex-1">
      <WelcomeSection fill />
    </div>
  </div>
);

/** Same position, but on a dark field so the glow has something to sit against. */
export const OnDarkBand = () => (
  <div className="flex min-h-dvh flex-col bg-background lg:h-dvh lg:overflow-hidden">
    <div className="shrink-0">
      <SiteHeader activeIndex={0} />
      <SearchBand tone="dark" onSearch={(q) => console.log('search:', q)} />
    </div>
    <div className="lg:min-h-0 lg:flex-1">
      <WelcomeSection fill />
    </div>
  </div>
);

/** The bare component, as shipped. */
export const Standalone = () => (
  <div className="grid min-h-dvh place-items-center bg-background">
    <SearchBand heading="" />
  </div>
);
