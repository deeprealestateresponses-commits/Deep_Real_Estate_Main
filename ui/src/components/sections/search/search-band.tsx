import SearchComponent from '@/components/ui/search-bar/animated-glowing-search-bar';
import { cn } from '@/lib/utils';

export type SearchBandProps = {
  heading?: string;
  /**
   * 'page'        sits on the page background.
   * 'dark'        gives the glow its own dark field.
   * 'transparent' draws no ground at all, so whatever the parent is painting —
   *               on the home page, the welcome gradient — runs straight
   *               through the strip instead of being interrupted by it.
   */
  tone?: 'page' | 'dark' | 'transparent';
  onSearch?: (query: string) => void;
  className?: string;
};

/**
 * Homepage strip between the header and the welcome section.
 *
 * Two columns: the bar takes 5 of 12 (~42% of the page width), the label sits
 * beside it rather than above. Side-by-side keeps the strip to one row, which
 * is what lets the header + band + welcome fit in a single viewport.
 */
export const SearchBand = ({
  heading = 'Search by sector, project or developer',
  tone = 'page',
  onSearch,
  className,
}: SearchBandProps) => {
  const isDark = tone === 'dark';
  const isTransparent = tone === 'transparent';

  return (
    <section
      className={cn(
        'w-full',
        isTransparent
          ? 'bg-transparent'
          : cn('border-b', isDark ? 'bg-[#07121b]' : 'bg-background'),
        className,
      )}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-5 sm:px-8">
        {/* 40% / rest, stated literally rather than approximated with a
            12-column span, whose real width shifts with the gap. */}
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[40%_1fr] lg:gap-8">
          {/* bar */}
          <div className="min-w-0">
            <SearchComponent
              placeholder="Sector 56, DLF Phase 3, M3M…"
              label="Search properties"
              onSearch={onSearch}
            />
          </div>

          {/* label */}
          {heading && (
            <div className="min-w-0">
              <p
                className={cn(
                  'text-xs font-semibold uppercase tracking-[0.18em] sm:text-[13px]',
                  isDark || isTransparent ? 'text-white/70' : 'text-muted-foreground',
                )}
              >
                {heading}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
