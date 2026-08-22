import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/breadcrumb/breadcrumb';
import { ContactPopup } from '@/components/ui/contact-popup/contact-popup';
import { mapForLocality, type PropertyDetail } from '@/components/sections/properties/properties-data';
import { PropertyGallery } from './property-gallery';
import { cn } from '@/lib/utils';

export type PropertyDetailPageProps = {
  property: PropertyDetail;
  phone?: string;
  email?: string;
  officeAddress?: string;
  /** Where "Enquire Now" and "Fill a form" go — the full form lives there. */
  contactHref?: string;
  backHref?: string;
  homeHref?: string;
  className?: string;
};

/* ------------------------------------------------------------------ icons */

const PinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-4h6v4M9 10h.01M15 10h.01M9 13.5h.01M15 13.5h.01" />
  </svg>
);

const StatusIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const RupeeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4h10M7 9h10M15.5 4c0 4-3 5-5.5 5H7l7 11" />
  </svg>
);

const AreaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 3v18" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const FormIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M9 13h6M9 17h4" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.03 12.03 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.893 0-3.176-1.24-6.165-3.495-8.411M12.05 21.785h-.004a9.94 9.94 0 0 1-5.061-1.383l-.363-.216-3.759.982 1.004-3.653-.236-.375a9.86 9.86 0 0 1-1.516-5.263c.002-5.45 4.458-9.885 9.942-9.885a9.87 9.87 0 0 1 7.021 2.9 9.78 9.78 0 0 1 2.909 6.99c-.003 5.45-4.458 9.884-9.937 9.884" />
  </svg>
);

/* ------------------------------------------------------------ box + title */

/**
 * The reference's section device: a white panel with a hairline border, set on
 * a grey page, with a gap between each. That gap is the whole separation
 * mechanism — no coloured bands, no alternating grounds.
 */
const Box = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <section className={cn('rounded-lg border bg-card px-5 py-9 sm:px-10 sm:py-11', className)}>
    {children}
  </section>
);

/** Centred, uppercase, with a short rule under it — as the reference sets it.
    The rule is the brand ramp rather than a grey hairline; on a page of white
    boxes it is the one place colour costs nothing and gives each box a lift. */
const BoxTitle = ({ children }: { children: React.ReactNode }) => (
  <header className="mb-8 text-center">
    <h2 className="text-[19px] font-extrabold uppercase tracking-[0.02em] text-foreground sm:text-[26px]">
      {children}
    </h2>
    <span
      aria-hidden="true"
      className="mx-auto mt-4 block h-[3px] w-16 rounded-full bg-[linear-gradient(90deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)]"
    />
  </header>
);

/**
 * One property, in full — arranged to the reference layout at
 * realtimerealtors.in/property/silverglades-hightown.
 *
 * Its two structural ideas, both carried over:
 *   · the hero is a split, not a banner — photograph on the left, a white
 *     panel on the right holding the title, the locality, the headline facts
 *     as icon rows, and the Enquire Now;
 *   · every section below is a bordered white box on a grey page, each with a
 *     centred uppercase heading over a short rule. The gaps between boxes are
 *     what separates the sections.
 *
 * The reference's sticky tab bar is deliberately absent — asked for.
 *
 * Not carried over, for want of data rather than taste: floor plans,
 * downloads, a price list by configuration, a video, and the "similar
 * properties" wall. Inventing a floor plan for a real listing is worse than
 * leaving the box out.
 *
 * Colour stays this site's blue rather than the reference's gold-on-black —
 * the format is being copied, not the brand.
 */
export const PropertyDetailPage = ({
  property,
  phone = '+91-9810922338',
  email = 'info@deeprealestate.in',
  officeAddress = 'G-564, Sushant Lok-II Extn., Sector 57, Nr. Scottish High Gurgaon, Haryana-122002, India',
  contactHref = '#contact-page',
  backHref = '#properties-page',
  homeHref = '#home-so-far',
  className,
}: PropertyDetailPageProps) => {
  const {
    name,
    location,
    address,
    propertyId,
    price,
    priceUnit,
    images,
    description,
    features,
    overview,
  } = property;

  const [contactOpen, setContactOpen] = useState(false);

  const mapImage = mapForLocality(location);
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const telLink = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const waLink = `https://wa.me/${phone.replace(/\D/g, '')}`;

  /* Falls back to the card's own image, so a listing added without a gallery
     still gets a page with a photograph rather than a broken frame. */
  const gallery = images.length > 0 ? images : [property.image];

  /** First Overview row whose label matches, for the hero's fact rows. */
  const fact = (...labels: string[]) =>
    overview.find((o) => labels.some((l) => o.label.toLowerCase() === l.toLowerCase()))?.value;

  const builder = fact('Builder');

  const heroFacts = [
    { icon: BuildingIcon, label: 'Property Type', value: fact('Type') },
    { icon: StatusIcon, label: 'Status', value: fact('Status') },
    { icon: RupeeIcon, label: null, value: price },
    { icon: AreaIcon, label: 'Size', value: fact('Built-up area', 'Plot size', 'Size') },
  ].filter((f): f is { icon: typeof PinIcon; label: string | null; value: string } =>
    Boolean(f.value),
  );

  return (
    /* grey page — it is what makes the white boxes below read as boxes */
    <div className={cn('w-full bg-muted/50', className)}>
      <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
        {/* ========================================================== hero */}
        {/* Held to the viewport, less the header (5rem), this block's own top
            padding and the breadcrumb under it — so the hero is what you see
            on arrival and the first scroll lands on Overview rather than on
            the bottom of a photograph. Capped and floored so it neither
            towers on a tall monitor nor crushes on a laptop. */}
        <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-lg border bg-card lg:h-[calc(100dvh-12.5rem)] lg:max-h-[560px] lg:min-h-[400px] lg:grid-cols-[1.35fr_1fr]">
          <PropertyGallery
            images={gallery}
            alt={name}
            className="h-full"
            frameClassName="h-[240px] sm:h-[340px] lg:h-full"
          />

          <div className="flex flex-col justify-center overflow-y-auto px-6 py-6 sm:px-9 sm:py-7">
            <h1 className="text-[24px] font-extrabold leading-[1.08] tracking-tight text-foreground sm:text-[1.9rem]">
              {name}
            </h1>

            {/* Read off the Overview's own Builder row rather than the card's
                `developer` field — setting that would also stamp a pill across
                the bottom of every card on the index. */}
            {builder && (
              <p className="mt-1.5 text-[16px] font-bold text-muted-foreground">
                by <span className="text-primary">{builder}</span>
              </p>
            )}

            <p className="mt-2 inline-flex items-center gap-2 text-[14px] text-muted-foreground">
              <PinIcon className="h-4 w-4 shrink-0 text-primary" />
              {location}
            </p>

            {/* fact rows, hairline-separated, as the reference sets them */}
            <dl className="mt-4">
              {heroFacts.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label ?? f.value}
                    className="flex items-center gap-3 border-b py-2.5 last:border-b-0"
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0 text-primary" />
                    {f.label ? (
                      <>
                        <dt className="text-[14px] font-semibold text-foreground">{f.label} :</dt>
                        <dd className="text-[14px] text-muted-foreground">{f.value}</dd>
                      </>
                    ) : (
                      <dd className="text-[14px] font-semibold text-foreground">{f.value}</dd>
                    )}
                  </div>
                );
              })}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {/* Opens the numbers dialog — the same one the header's
                  Buy/Sell Property button opens. Enquiring here is a phone
                  call, not a page change. */}
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="group/enq relative isolate inline-flex h-11 cursor-pointer items-center overflow-hidden rounded-md bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] px-7 text-[14.5px] font-bold text-white shadow-[0_14px_30px_-14px_rgb(0_128_198/0.9)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span
                  aria-hidden="true"
                  className="animate-sheen pointer-events-none absolute inset-y-0 -z-10 w-10 bg-white/40 motion-reduce:hidden"
                  style={{ animationDuration: '2.4s', animationIterationCount: 'infinite' }}
                />
                Enquire Now
              </button>
              {priceUnit && <span className="text-[13.5px] text-muted-foreground">{priceUnit}</span>}
            </div>
          </div>
        </div>

        {/* ==================================================== breadcrumb */}
        {/* Same component the FAQs, Documents and legal pages put under the
            navbar, in its inline variant — one trail, two placements. */}
        <Breadcrumb
          variant="inline"
          homeHref={homeHref}
          items={[{ label: 'Properties', href: backHref }, { label: name }]}
        />

        <div className="flex flex-col gap-5">
          {/* ==================================================== overview */}
          <Box>
            <BoxTitle>Overview</BoxTitle>
            {description.map((para) => (
              <p key={para} className="mx-auto max-w-4xl text-[16px] leading-[1.8] text-foreground/85">
                {para}
              </p>
            ))}
          </Box>

          {/* ============================ key features + property details */}
          {/* One box, split down the middle — the arrangement the reference
              uses for Key Features and Payment Plan. */}
          <Box>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <BoxTitle>{name} Key Features</BoxTitle>
                <ul className="space-y-3.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15.5px] leading-snug text-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
                      >
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <BoxTitle>{name} Property Details</BoxTitle>
                <dl className="divide-y border-y">
                  {overview.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[14px] font-semibold text-muted-foreground">{f.label}</dt>
                      <dd className="text-right text-[15px] font-semibold text-foreground">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Box>

          {/* ===================================================== gallery */}
          <Box>
            <BoxTitle>{name} Gallery</BoxTitle>
            <div
              className={cn(
                'grid grid-cols-1 gap-4',
                gallery.length >= 3
                  ? 'sm:grid-cols-3'
                  : gallery.length === 2
                    ? 'sm:grid-cols-2'
                    : 'mx-auto sm:max-w-2xl',
              )}
            >
              {gallery.map((src, i) => (
                <figure key={src} className="overflow-hidden rounded-md border bg-muted">
                  <img
                    src={src}
                    alt={`${name} — view ${i + 1}`}
                    className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-[1.04] sm:h-[250px]"
                  />
                </figure>
              ))}
            </div>
          </Box>

          {/* ================================================ location map */}
          <Box>
            <BoxTitle>{name} Location Map</BoxTitle>
            <p className="mx-auto mb-6 max-w-3xl text-center text-[15.5px] leading-[1.7] text-foreground/85">
              {address}
            </p>
            {/* The site's own sector sheet rather than a live embed — the same
                choice the contact page makes, and it keeps a third-party
                script off the page. The button hands off to real Maps. */}
            <div className="relative overflow-hidden rounded-md border bg-muted">
              <img
                src={mapImage}
                alt={`Sector map covering ${location}`}
                className="h-[260px] w-full object-cover sm:h-[380px]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.6)_100%)]"
              />
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-md bg-primary px-6 py-3 text-[14px] font-bold text-primary-foreground shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
              >
                <PinIcon className="h-4 w-4" />
                See location
              </a>
            </div>
          </Box>

          {/* ================================================== contact us */}
          <Box>
            <BoxTitle>Contact Us</BoxTitle>
            <p className="mx-auto mb-8 max-w-2xl text-center text-[15.5px] leading-[1.7] text-foreground/85">
              Quote Property ID {propertyId} and we will pull the file before we call you back —
              usually within 15 minutes, between 9am and 10pm.
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-md border bg-muted/30 p-6">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Our office
                </p>
                <p className="mt-2.5 text-[15px] leading-[1.65] text-foreground">{officeAddress}</p>
                <div className="mt-5 space-y-2.5 border-t pt-5">
                  <a href={telLink} className="flex items-center gap-3 text-[15px] font-semibold text-foreground transition-colors hover:text-primary">
                    <PhoneIcon className="h-4 w-4 shrink-0 text-primary" />
                    {phone}
                  </a>
                  <a href={`mailto:${email}`} className="flex items-center gap-3 text-[15px] font-semibold text-foreground transition-colors hover:text-primary">
                    <MailIcon className="h-4 w-4 shrink-0 text-primary" />
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-md border bg-muted/30 p-6">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Asking price
                </p>
                <p className="mt-1.5 text-[30px] font-bold leading-none tracking-tight text-foreground">
                  {price}
                </p>
                {priceUnit && <p className="mt-2 text-[14px] text-muted-foreground">{priceUnit}</p>}
                <div className="mt-5 flex flex-col gap-2.5">
                  {/* Opens the numbers dialog rather than dialling one line
                      outright — there are three, and which to ring depends on
                      what the caller wants. */}
                  <button
                    type="button"
                    onClick={() => setContactOpen(true)}
                    className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] px-6 text-[14.5px] font-bold text-white shadow-[0_14px_30px_-14px_rgb(0_128_198/0.85)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Call now
                  </button>
                  <a
                    href={contactHref}
                    className="inline-flex h-11 items-center justify-center rounded-md border-2 border-primary/30 px-6 text-[14px] font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    Write to us
                  </a>
                </div>
              </div>
            </div>

            {/* The last thing on the page, so it is filled and shining rather
                than a grey slab — same recipe as the home page's properties
                CTA, with the sheen kept inside the button's own overflow so it
                never escapes the rounded edge. */}
            <div className="mt-9 flex justify-center border-t pt-8">
              <a
                href={backHref}
                className="group/back relative isolate inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] px-8 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_rgb(0_128_198/0.85)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span
                  aria-hidden="true"
                  className="animate-sheen pointer-events-none absolute inset-y-0 -z-10 w-10 bg-white/40 motion-reduce:hidden"
                  style={{ animationDuration: '2.4s', animationIterationCount: 'infinite' }}
                />
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover/back:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Go back to all properties
              </a>
            </div>
          </Box>
        </div>
      </div>

      {/* ============================================ floating action rail */}
      {/* The reference's fixed right-edge column. On a phone it becomes a bar
          along the bottom, where a fixed side column would cover the content. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t bg-card sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col sm:items-center sm:gap-2.5 sm:border-0 sm:bg-transparent">
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-bold text-primary sm:h-12 sm:w-12 sm:flex-none sm:gap-0 sm:rounded-full sm:bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] sm:py-0 sm:text-white sm:shadow-lg sm:transition-transform sm:duration-300 sm:hover:-translate-y-0.5"
          aria-label="Call now"
          title="Call now"
        >
          <PhoneIcon className="h-5 w-5" />
          <span className="sm:hidden">Call Now</span>
        </button>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 flex-col items-center justify-center gap-1 border-l py-2.5 text-[11px] font-bold text-[#25D366] sm:h-12 sm:w-12 sm:flex-none sm:gap-0 sm:rounded-full sm:border-0 sm:bg-[#25D366] sm:py-0 sm:text-white sm:shadow-lg sm:transition-transform sm:duration-300 sm:hover:-translate-y-0.5"
          aria-label="WhatsApp"
          title="WhatsApp"
        >
          <WhatsAppIcon className="h-5 w-5" />
          <span className="sm:hidden">WhatsApp</span>
        </a>
        <a
          href={contactHref}
          className="flex flex-1 flex-col items-center justify-center gap-1 border-l py-2.5 text-[11px] font-bold text-foreground sm:h-12 sm:w-12 sm:flex-none sm:gap-0 sm:rounded-full sm:border-0 sm:bg-[#0b1a27] sm:py-0 sm:text-white sm:shadow-lg sm:transition-transform sm:duration-300 sm:hover:-translate-y-0.5"
          aria-label="Fill a form"
          title="Fill a form"
        >
          <FormIcon className="h-5 w-5" />
          <span className="sm:hidden">Fill a Form</span>
        </a>
      </div>

      {/* clears the fixed bottom bar on phones */}
      <div aria-hidden="true" className="h-16 sm:hidden" />

      <ContactPopup open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};
