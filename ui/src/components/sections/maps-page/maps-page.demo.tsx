import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { MapsPage } from './maps-page';
import { MapsExplorer } from './maps-explorer';

/**
 * The Maps page.
 *   nav (limelight on Maps) → explorer (map + filters + library) → footer
 *
 * No scroll-snap here. The page is a browsable index of 74 maps; snapping it
 * to viewport-sized chunks would fight someone scanning for one sector.
 */
export const MapsFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    {/* activeIndex 3 puts the limelight on Maps */}
    <SiteHeader activeIndex={3} />
    <MapsExplorer />
    <SiteFooter />
  </div>
);

/** The previous sectioned-band layout, kept for comparison. */
export const MapsSectionedPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    <SiteHeader activeIndex={3} />
    <MapsPage />
    <SiteFooter />
  </div>
);
