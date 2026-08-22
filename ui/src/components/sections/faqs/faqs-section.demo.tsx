import { SiteHeader } from '@/components/ui/navbar/site-header';
import { Breadcrumb } from '@/components/ui/breadcrumb/breadcrumb';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { Faqs } from './faqs-section';

/** The section on its own, for judging it in isolation. */
export const Standalone = () => <Faqs />;

/**
 * The FAQs page.
 *   nav → accordion of the live site's eight questions → footer
 *
 * FAQs now lives under the nav's "More" menu, so activeIndex 5 puts the
 * limelight on More — the item that actually leads here. Index 2 is Properties.
 */
export const FaqsFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    <SiteHeader activeIndex={5} />
    <Breadcrumb items={[{ label: 'FAQs' }]} />
    <Faqs />
    <SiteFooter />
  </div>
);
