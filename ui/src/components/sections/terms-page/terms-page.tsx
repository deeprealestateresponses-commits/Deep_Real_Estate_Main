import { LegalPage } from '@/components/sections/legal-page/legal-page';
import { termsSections, termsUpdated } from './terms-data';

/** Terms & Conditions — the same layout as the Privacy Policy, its own text. */
export const TermsPage = ({ className }: { className?: string }) => (
  <LegalPage
    title="Terms & Conditions"
    sections={termsSections}
    updated={termsUpdated}
    className={className}
  />
);
