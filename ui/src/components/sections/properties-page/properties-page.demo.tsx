import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { IndexCta } from '@/components/sections/index-cta/index-cta';
import { allProperties, type PropertyDetail } from '@/components/sections/properties/properties-data';
import { PropertiesPage } from './properties-page';
import { PropertyDetailPage } from './property-detail-page';

/**
 * The Properties index.
 *   nav → listings → closing CTA → footer
 *
 * Properties is its own top-level nav item, third along, so activeIndex 2 puts
 * the limelight on the item that leads here. The CTA lives out here rather
 * than inside PropertiesPage so the index itself stays nothing but listings.
 */
export const PropertiesFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    <SiteHeader activeIndex={2} />
    <PropertiesPage />
    <IndexCta
      heading="Looking for something not listed here?"
      body="Tell us the sector and the budget and we will send what is currently on the book."
      ctaLabel="Get in touch"
      ctaHref="#contact-page"
      secondaryLabel="Call +91-9810922338"
      secondaryHref="tel:+919810922338"
    />
    <SiteFooter />
  </div>
);

/** The listings on their own, without the site chrome. */
export const Standalone = () => <PropertiesPage />;

/**
 * One property's page, wrapped in the site chrome.
 *
 * Exported as a factory rather than as fourteen hand-written components — the
 * registry builds an entry per property from `allProperties`, so adding a
 * listing to the data adds its page with it.
 */
export const propertyPage = (property: PropertyDetail) => () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    <SiteHeader activeIndex={2} />
    <PropertyDetailPage property={property} />
    <SiteFooter />
  </div>
);

/** The first listing's detail page, for looking at the layout in isolation. */
export const DetailStandalone = () => <PropertyDetailPage property={allProperties[0]} />;
