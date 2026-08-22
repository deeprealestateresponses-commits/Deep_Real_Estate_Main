import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { ContactPage } from './contact-page';

/**
 * The Contact Us page.
 *   nav (limelight on Contact Us) → map hero + detail/form cards → footer
 *
 * No scroll-snap: it is a short page whose whole point is the form, and
 * snapping would put the form's own scroll at odds with the page's.
 */
export const ContactFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    {/* activeIndex 4 puts the limelight on Contact Us */}
    <SiteHeader activeIndex={4} />
    {/* No onSubmit observer: the form delivers the enquiry itself, and a
        console.log here would print the visitor's name, phone and email into
        the browser console on the live site. */}
    <ContactPage />
    <SiteFooter />
  </div>
);
