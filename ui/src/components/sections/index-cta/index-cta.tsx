import { StarButton } from '@/components/ui/star-button';
import { cn } from '@/lib/utils';

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92z" />
  </svg>
);

export type IndexCtaProps = {
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional second action, drawn as an outline beside the primary. */
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

/**
 * The closing band for an index page.
 *
 * Maps and Documents are the only pages that used to simply run out of content
 * and hit the footer. Every other page hands off to a CTA first, and that
 * hand-off is a large part of why they feel finished.
 */
export const IndexCta = ({
  heading = 'Can’t find what you need?',
  body = 'Tell us the sector or the document and we will send it across.',
  ctaLabel = 'Talk to us',
  ctaHref = '#contact-page',
  secondaryLabel,
  secondaryHref,
  className,
}: IndexCtaProps) => (
  <section className={cn('w-full bg-[#0b1d2a]', className)}>
    <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{heading}</h2>
        <p className="mt-2 max-w-xl text-[15px] leading-[1.6] text-white/65">{body}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <StarButton
          href={ctaHref}
          lightColor="#FAFAFA"
          className="h-12 px-7 text-[15px] font-semibold"
        >
          {ctaLabel}
        </StarButton>

        {/* Outlined, not filled: two solid buttons side by side give no answer
            to "which one", and the phone is the fallback, not the ask. */}
        {secondaryLabel && (
          <a
            href={secondaryHref ?? '#'}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-7 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            <PhoneIcon className="h-4 w-4" />
            {secondaryLabel}
          </a>
        )}
      </div>
    </div>
  </section>
);
