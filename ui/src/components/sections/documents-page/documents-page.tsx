import { useMemo, useState } from 'react';
import { GooeySearchBar } from '@/components/ui/animated-search-bar/animated-search-bar';
import { Breadcrumb } from '@/components/ui/breadcrumb/breadcrumb';
import { IndexCta } from '@/components/sections/index-cta/index-cta';
import { documentGroups, documents, type DocCategory, type DocumentItem } from './documents-data';
import { DocPreview } from './doc-preview';
import { cn } from '@/lib/utils';

export type DocumentsPageProps = {
  items?: DocumentItem[];
  /** Where the files live. Overridable so the same page can point at a CDN. */
  basePath?: string;
  className?: string;
};

const DocIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

/* Each category gets its own colour. Three groups of near-identical grey rows
   were impossible to tell apart at a glance; the accent is doing navigational
   work, not decoration. Written out in full because Tailwind only keeps class
   names it can see as complete strings. */
/* The colour is carried by a deep, saturated header band at the top of each
   panel, with plain white cards underneath it.

   The previous attempt tinted everything — pale panel, paler card on top of
   it, tinted strip, tinted border — and pastel on pastel cancels out: nothing
   had enough contrast against anything else to read as colour at all. One
   strong band per section, and white below it, gives the colour somewhere to
   be loud and the cards somewhere to be legible. */
type Accent = {
  /** The saturated band across the top of the panel. */
  header: string;
  /** A soft echo of it behind the cards, so the body is not flat white. */
  body: string;
  border: string;
  text: string;
  hoverBorder: string;
  /** Icon tile — filled from the start rather than only on hover. */
  icon: string;
  button: string;
  shadow: string;
};

const accents: Record<DocCategory, Accent> = {
  General: {
    header: 'bg-[linear-gradient(135deg,#0ea5e9_0%,#0080c6_45%,#004d73_100%)]',
    body: 'bg-[linear-gradient(180deg,#f5fbff_0%,#ffffff_60%)]',
    border: 'border-sky-200',
    text: 'text-sky-700',
    hoverBorder: 'hover:border-sky-400',
    icon: 'bg-[linear-gradient(135deg,#0ea5e9_0%,#00618f_100%)] text-white',
    button: 'bg-[linear-gradient(120deg,#0ea5e9_0%,#0080c6_50%,#00618f_100%)]',
    shadow: 'shadow-[0_18px_40px_-24px_rgb(2_132_199/0.75)]',
  },
  HUDA: {
    header: 'bg-[linear-gradient(135deg,#10b981_0%,#059669_45%,#04503a_100%)]',
    body: 'bg-[linear-gradient(180deg,#f4fdf9_0%,#ffffff_60%)]',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    hoverBorder: 'hover:border-emerald-400',
    icon: 'bg-[linear-gradient(135deg,#10b981_0%,#047857_100%)] text-white',
    button: 'bg-[linear-gradient(120deg,#10b981_0%,#059669_50%,#047857_100%)]',
    shadow: 'shadow-[0_18px_40px_-24px_rgb(5_150_105/0.75)]',
  },
  Formats: {
    header: 'bg-[linear-gradient(135deg,#8b5cf6_0%,#7c3aed_45%,#43167f_100%)]',
    body: 'bg-[linear-gradient(180deg,#faf8ff_0%,#ffffff_60%)]',
    border: 'border-violet-200',
    text: 'text-violet-700',
    hoverBorder: 'hover:border-violet-400',
    icon: 'bg-[linear-gradient(135deg,#8b5cf6_0%,#6d28d9_100%)] text-white',
    button: 'bg-[linear-gradient(120deg,#8b5cf6_0%,#7c3aed_50%,#6d28d9_100%)]',
    shadow: 'shadow-[0_18px_40px_-24px_rgb(124_58_237/0.75)]',
  },
};

/** What each group is for. The live site gives the files no explanation at all. */
const groupBlurb: Record<DocCategory, string> = {
  General: 'Sale agreements, powers of attorney and the deeds a private transaction needs.',
  HUDA: 'Affidavits, allotment and possession forms for HUDA plots.',
  Formats: 'Blank formats to fill in — receipts, undertakings and standard letters.',
};

/**
 * One document, as a card with both controls on it.
 *
 * View and Download are genuinely different actions here and both are wanted:
 * a browser cannot render .doc, so a plain link downloads the file whether you
 * meant to read it or keep it. View hands the public URL to Microsoft's own
 * Office viewer, which renders it in the browser; Download takes the file.
 */
const DocumentCard = ({
  item,
  href,
  onPreview,
  accent,
}: {
  item: DocumentItem;
  href: string;
  onPreview: () => void;
  accent: Accent;
}) => (
  <div
    className={cn(
      'group/doc relative flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-24px_rgb(0_0_0/0.4)]',
      accent.hoverBorder,
    )}
  >
    <div className="flex flex-1 items-start gap-3.5">
      <span
        aria-hidden="true"
        className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', accent.icon)}
      >
        <DocIcon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold leading-snug text-foreground">{item.title}</h3>
        <p className="mt-1.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
          <span className={cn('font-bold uppercase tracking-wider', accent.text)}>
            {item.ext}
          </span>
          <span aria-hidden="true" className="text-muted-foreground/40">·</span>
          <span>{item.sizeKb} KB</span>
        </p>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2">
      {/* Opens the preview in place rather than navigating away — a .doc
          handed to the browser is a download, not a look at the file. */}
      <button
        type="button"
        onClick={onPreview}
        className={cn(
          'inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-bold text-white shadow-sm transition-transform duration-300 hover:-translate-y-0.5',
          accent.button,
        )}
      >
        <EyeIcon className="h-3.5 w-3.5" />
        View
      </button>
      <a
        href={href}
        download
        className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-foreground/15 bg-card/80 px-4 text-[13px] font-bold text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-foreground/30 hover:bg-card"
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        Download
      </a>
    </div>
  </div>
);

/**
 * Documents page.
 *
 * Same shape as the Properties index on purpose: a 100px band under the navbar
 * with the title on the left and the search on the right, then boxed sections
 * below. The two index pages of this site should not look like two different
 * sites.
 *
 * The chip rail is gone — three categories do not need an index, and a sticky
 * rail over three groups was chrome for its own sake. The colour does that
 * work instead: each section opens on a deep gradient band, and the cards
 * under it stay white so they have something to read against.
 */
export const DocumentsPage = ({
  items = documents,
  basePath = '/docs',
  className,
}: DocumentsPageProps) => {
  const groups = useMemo(
    () =>
      documentGroups
        .map((g) => ({ ...g, docs: items.filter((d) => d.category === g.category) }))
        .filter((g) => g.docs.length > 0),
    [items],
  );

  const [preview, setPreview] = useState<DocumentItem | null>(null);

  const hrefFor = (item: DocumentItem) => `${basePath}/${encodeURIComponent(item.file)}`;

  return (
    <div className={cn('w-full bg-muted/40', className)}>

      {/* ------------------------------------------------------------ band */}
      <section className="w-full border-b bg-[linear-gradient(160deg,#f1f7fc_0%,#e6f0f9_100%)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-5 py-5 sm:h-[110px] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-0">
          <div>
            {/* The trail lives in the band rather than in a bar of its own —
                two stacked strips under the navbar for one word of context
                was a strip too many. */}
            <Breadcrumb
              variant="inline"
              items={[{ label: 'Documents' }]}
              className="[&>ol]:px-0 [&>ol]:py-0 [&>ol]:text-[13px]"
            />
            <h1 className="mt-1.5 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-[2.1rem]">
              <span className="bg-[linear-gradient(100deg,#0b9ae0_0%,#0080c6_45%,#00618f_100%)] bg-clip-text text-transparent">
                Documents
              </span>
            </h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {items.length} forms, free to download
            </p>
          </div>

          {/* Zero-height slot: the results blob downwards out of the pill and
              would otherwise stretch the band. */}
          <div className="relative z-20 shrink-0 sm:h-12 sm:w-[320px]">
            <div className="sm:absolute sm:right-0 sm:top-0">
              <GooeySearchBar
                tone="dark"
                buttonLabel="Search"
                placeholder="Name of a form…"
                items={items.map((d) => ({
                  label: d.title,
                  hint: d.category,
                  href: hrefFor(d),
                }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- groups */}
      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-5">
          {groups.map((group, i) => {
            const accent = accents[group.category];
            return (
              <section
                key={group.category}
                className={cn(
                  'flex flex-col overflow-hidden rounded-2xl border',
                  accent.border,
                  accent.shadow,
                  /* The first panel is grown to fill what is left of the
                     screen: header 5rem + band 6.875rem + this container's top
                     padding 2rem = 15.875rem taken, and the extra half a rem
                     leaves the top edge of the next panel just showing, so it
                     reads as "there is more" rather than as the end of the
                     page. Later panels take their natural height. */
                  i === 0 && 'lg:min-h-[calc(100dvh-16.375rem)]',
                )}
              >
                {/* -------------------------------------------- colour band */}
                <header
                  className={cn(
                    'relative isolate overflow-hidden px-6 py-8 text-center sm:px-12 sm:py-9',
                    accent.header,
                  )}
                >
                  {/* light thrown in from the corner, so the band reads as a
                      lit surface rather than a flat rectangle of colour */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 -top-28 -z-10 h-64 w-64 rounded-full bg-white/25 blur-[60px]"
                  />
                  <h2 className="text-[21px] font-extrabold uppercase tracking-[0.03em] text-white sm:text-[28px]">
                    {group.category} Documents
                  </h2>
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-4 block h-[3px] w-16 rounded-full bg-white/70"
                  />
                  <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.6] text-white/85">
                    {groupBlurb[group.category]}
                  </p>
                </header>

                {/* ------------------------------------------------- cards */}
                {/* Four across at xl, so General's eight land in two rows and
                    the whole panel clears one screen. content-start keeps them
                    under the band rather than floating in the middle of the
                    grown first panel. */}
                <div
                  className={cn(
                    'grid flex-1 grid-cols-1 content-start gap-4 px-5 py-8 sm:grid-cols-2 sm:px-10 sm:py-10 lg:grid-cols-3 xl:grid-cols-4',
                    accent.body,
                  )}
                >
                  {group.docs.map((item) => (
                    <DocumentCard
                      key={item.file}
                      item={item}
                      href={hrefFor(item)}
                      onPreview={() => setPreview(item)}
                      accent={accent}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <IndexCta
          heading="Need a document we don’t list?"
          body="Tell us which form you need and we will send it across."
        />
      </div>

      <DocPreview
        doc={
          preview
            ? {
                title: preview.title,
                ext: preview.ext,
                sizeKb: preview.sizeKb,
                fileHref: hrefFor(preview),
              }
            : null
        }
        onClose={() => setPreview(null)}
      />
    </div>
  );
};
