import { SiteHeader } from '@/components/ui/navbar/site-header';
import { WelcomeSection } from './welcome-section';

/** Section 1 sitting under the real header, as it will on the live page. */
export const WithHeader = () => (
  <div className="min-h-dvh bg-background">
    <SiteHeader activeIndex={0} />
    <WelcomeSection />
  </div>
);

/** The section on its own, for judging spacing and alignment in isolation. */
export const Standalone = () => (
  <div className="min-h-dvh bg-background">
    <WelcomeSection />
  </div>
);

/** Gallery on the left — the alternate arrangement. */
export const PictureLeft = () => (
  <div className="min-h-dvh bg-background">
    <SiteHeader activeIndex={0} />
    <WelcomeSection reverse />
  </div>
);

/** Single-image override — the pre-gallery behaviour, still supported. */
export const SingleImage = () => (
  <div className="min-h-dvh bg-background">
    <SiteHeader activeIndex={0} />
    <WelcomeSection imageSrc="/img/welcome.jpg" imageAlt="A bright living space" />
  </div>
);
