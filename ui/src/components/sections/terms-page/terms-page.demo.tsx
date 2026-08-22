import { SiteHeader } from '@/components/ui/navbar/site-header';
import { Breadcrumb } from '@/components/ui/breadcrumb/breadcrumb';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { TermsPage } from './terms-page';

/**
 * The Terms & Conditions page.
 *   nav → breadcrumb → shader head → "on this page" card + 21 sections → footer
 */
export const TermsFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    {/* activeIndex 5 is "More", which is where Terms lives */}
    <SiteHeader activeIndex={5} />
    <Breadcrumb items={[{ label: 'Terms and Conditions' }]} />
    <TermsPage />
    <SiteFooter />
  </div>
);
