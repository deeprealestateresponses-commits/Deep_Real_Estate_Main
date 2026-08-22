import { SiteHeader } from '@/components/ui/navbar/site-header';
import { Breadcrumb } from '@/components/ui/breadcrumb/breadcrumb';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { PrivacyPage } from './privacy-page';

/**
 * The Privacy Policy page.
 *   nav → breadcrumb → head + index rail → ten sections → CTA → footer
 */
export const PrivacyFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    {/* activeIndex 5 is "More", which is where Privacy Policy lives */}
    <SiteHeader activeIndex={5} />
    <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
    <PrivacyPage />
    <SiteFooter />
  </div>
);
