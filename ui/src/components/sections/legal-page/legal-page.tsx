import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatedGradient } from '@/components/ui/animated-gradient/animated-gradient';
import type { PolicySection } from '@/components/sections/privacy-page/privacy-data';
import { cn } from '@/lib/utils';

export type LegalPageProps = {
  /** Big heading in the shader band. */
  title: string;
  sections: PolicySection[];
  updated: string;
  className?: string;
};

const sectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * The shared layout for a legal document — Privacy Policy, Terms & Conditions,
 * anything else of that shape.
 *
 * Shader band, then a sticky "On this page" card beside one continuous run of
 * numbered sections. Deliberately not the Maps / Documents treatment: those are
 * indexes you scan, this is a document you read down, and a chip rail with
 * alternating bands fought that.
 *
 * One component rather than one per page, so the two notices cannot drift into
 * looking like they came from different sites.
 */
export const LegalPage = ({ title, sections, updated, className }: LegalPageProps) => {
  const [activeId, setActiveId] = useState<string>(() => sectionId(sections[0]?.title ?? ''));

  /* Highlights whichever section is crossing the top of the viewport. A static
     list of ten links on a page this long gives no sense of place. */
  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(sectionId(s.title)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  /* The pointer that rides the outside edge of the card. Its position is
     measured from the live rows rather than computed from a row height —
     several titles wrap to two lines, so the rows are not a uniform size. */
  const cardRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [markerTop, setMarkerTop] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const index = sections.findIndex((s) => sectionId(s.title) === activeId);
      const el = rowRefs.current[index < 0 ? 0 : index];
      if (!el) return;
      setMarkerTop(el.offsetTop + el.offsetHeight / 2);
    };

    measure();
    const card = cardRef.current;
    if (!card) return;
    // titles re-wrap as the column narrows, which moves every row below them
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  }, [activeId, sections]);

  /* Buttons, not <a href="#id">. The sandbox routes on the hash, so a bare
     fragment would be read as a page id and land on the fallback entry. */
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={cn('w-full bg-background', className)}>
      {/* --------------------------------------------------------- head band */}
      {/* The shader runs in the site's own blues rather than one of the
          component's presets — every preset is pitched at a colour this site
          does not use, and a magenta aurora over a legal notice is a strange
          thing to promise. Copy turns white; the ramp is dark throughout. */}
      <section className="relative isolate w-full overflow-hidden border-b bg-[#04121b]">
        <AnimatedGradient
          className="-z-10"
          noise={{ opacity: 0.35, scale: 1 }}
          config={{
            preset: 'custom',
            color1: '#03101a',
            color2: '#0b3a5c',
            color3: '#0080c6',
            rotation: -20,
            proportion: 62,
            scale: 0.45,
            speed: 9,
            distortion: 18,
            swirl: 55,
            swirlIterations: 10,
            softness: 95,
            offset: 120,
            shape: 'Edge',
            shapeSize: 45,
          }}
        />

        <div className="mx-auto w-full max-w-[1240px] px-6 py-16 sm:py-20">
          <h1 className="text-[2.25rem] font-extrabold leading-tight tracking-tight text-white sm:text-[2.625rem]">
            {title}
          </h1>
          <p className="mt-2.5 text-[15px] text-white/70">{updated}</p>
        </div>
      </section>

      {/* ------------------------------------------------------------- body */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-20 pt-12 sm:pb-[84px] sm:pt-14">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[286px_1fr] lg:gap-12">
          {/* on this page */}
          <aside className="lg:sticky lg:top-[130px]">
            {/* not overflow-hidden any more — the pointer has to hang off the
                right edge, and clipping would swallow it */}
            <div
              ref={cardRef}
              className="relative rounded-2xl border bg-card shadow-[0_14px_36px_-26px_rgb(0_0_0/0.45)]"
            >
              {/* The pointer. A solid triangle on the outside edge, aimed at the
                  section it belongs to — the card says where you can go, this
                  says where you are. */}
              {markerTop != null && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[9px] hidden h-0 w-0 border-y-[9px] border-l-[10px] border-y-transparent border-l-primary transition-[top] duration-300 ease-out motion-reduce:transition-none lg:block"
                  style={{ top: markerTop, transform: 'translateY(-50%)' }}
                />
              )}
              <p className="rounded-t-2xl border-b bg-muted/40 px-5 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                On this page
              </p>

              <nav className="flex flex-col p-2">
                {sections.map((s, i) => {
                  const id = sectionId(s.title);
                  const isActive = activeId === id;
                  return (
                    <button
                      key={id}
                      ref={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      type="button"
                      onClick={() => go(id)}
                      aria-current={isActive || undefined}
                      className={cn(
                        'group/toc relative flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] leading-snug transition-colors',
                        isActive
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {/* A live rule on the left edge of the current row — the
                          colour change alone is easy to miss on a list this
                          long, and it doubles as the reading position. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute left-0 top-1.5 w-[3px] rounded-full bg-primary transition-all duration-300',
                          isActive ? 'bottom-1.5 opacity-100' : 'bottom-1/2 opacity-0',
                        )}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'w-5 shrink-0 pt-px text-[12px] font-bold tabular-nums transition-colors',
                          isActive ? 'text-primary' : 'text-muted-foreground/50',
                        )}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">{s.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* the policy */}
          <div className="min-w-0">
            {sections.map((section, i) => (
              <div
                key={section.title}
                id={sectionId(section.title)}
                className={cn(
                  'scroll-mt-[130px]',
                  // a rule and real air between clauses; ten headings in one
                  // column with nothing between them read as one long run
                  i > 0 && 'mt-11 border-t pt-11',
                )}
              >
                {/* Numbered to match the card on the left, so a row there and a
                    heading here are visibly the same thing. */}
                <div className="mb-4 flex items-start gap-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-[13px] font-bold tabular-nums text-primary"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-[22px] font-bold leading-tight tracking-tight text-foreground sm:text-[25px]">
                    {section.title}
                    {/* short accent under the title, not a full-width rule —
                        the rule above already does the separating */}
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block h-[3px] w-10 rounded-full bg-primary"
                    />
                  </h2>
                </div>

                {section.blocks.map((block, j) => {
                  if (block.t === 'h') {
                    return (
                      <h3
                        key={j}
                        className="mb-2 mt-[18px] text-[16.5px] font-semibold text-foreground"
                      >
                        {block.text}
                      </h3>
                    );
                  }

                  if (block.t === 'note') {
                    return (
                      <p
                        key={j}
                        className="mb-3 rounded-xl border-l-[3px] border-primary bg-primary/[0.06] px-4 py-3.5 text-[15px] font-medium leading-[1.7] text-foreground/90"
                      >
                        {block.text}
                      </p>
                    );
                  }

                  if (block.t === 'ul') {
                    return (
                      <ul
                        key={j}
                        className="mb-3 list-disc pl-[22px] text-[15.5px] leading-[1.7] text-muted-foreground marker:text-primary/60"
                      >
                        {block.items.map((item) => (
                          <li key={item} className="mb-[7px]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p
                      key={j}
                      className="mb-3 text-[15.5px] leading-[1.75] text-muted-foreground"
                    >
                      {block.text}
                    </p>
                  );
                })}
              </div>
            ))}

            {/* Ten sections deep, the footer is a long way from the top and
                there is nothing else down here to act on. Same filled-and-
                shining treatment as the properties CTA, so the one button at
                the end of a legal page is not a grey link. */}
            <div className="mt-12 flex justify-center border-t pt-10">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group/top relative isolate inline-flex h-12 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] px-7 text-[15px] font-bold text-white shadow-[0_14px_30px_-12px_rgb(0_128_198/0.85)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span
                  aria-hidden="true"
                  className="animate-sheen pointer-events-none absolute inset-y-0 -z-10 w-10 bg-white/40 motion-reduce:hidden"
                  style={{ animationDuration: '2.4s', animationIterationCount: 'infinite' }}
                />
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover/top:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
                Back to top
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
