import { SiteHeader } from '@/components/ui/navbar/site-header';
import { SiteFooter } from '@/components/sections/footer/site-footer';
import { DocumentsPage } from './documents-page';

/**
 * The Documents page.
 *   nav → header + search → grouped list of files → footer
 *
 * Documents lives under the nav's "More" menu, so activeIndex 5 puts the
 * limelight on More — the item that actually leads here.
 */
export const DocumentsFullPage = () => (
  <div className="min-h-dvh scroll-smooth bg-background">
    <SiteHeader activeIndex={5} />
    {/* no Breadcrumb bar here — this page carries its trail inside its own
        title band, so a strip above it would be a second one */}
    <DocumentsPage />
    <SiteFooter />
  </div>
);
