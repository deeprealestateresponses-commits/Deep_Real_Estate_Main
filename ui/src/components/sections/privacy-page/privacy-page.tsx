import { LegalPage } from '@/components/sections/legal-page/legal-page';
import { policySections, policyUpdated } from './privacy-data';

/** Privacy Policy — the shared legal layout, with the policy's own content. */
export const PrivacyPage = ({ className }: { className?: string }) => (
  <LegalPage
    title="Privacy Policy"
    sections={policySections}
    updated={policyUpdated}
    className={className}
  />
);
