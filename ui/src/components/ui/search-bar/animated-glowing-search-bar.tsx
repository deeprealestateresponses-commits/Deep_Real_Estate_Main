import React, { useId } from 'react';
import { cn } from '@/lib/utils';

/* Integration notes (differences from the source snippet):
   - `animate-spin-slow` is not a Tailwind utility. It is now defined in
     index.css; without it the ring beside the filter icon never rotated.
     Its keyframes must re-apply translate(-50%,-50%), because an `animation`
     that sets `transform` replaces the utility transform wholesale and the
     600px ::before would jump out of position.
   - #poda gets `isolate`. The glow layers use z-[-1]; with no stacking context
     they paint *behind the nearest ancestor background*, so dropping this into
     any section with a background made every glow vanish.
   - Wrapped in <form role="search"> with a real (visually hidden) label, and
     given props. As pasted it was a decorative div with no way to read input.
   - duration-2000 / brightness-140 / rotate-60 were verified to compile in
     Tailwind v4 and are left exactly as written.
   - Width is now fluid. Every layer was pinned to a hardcoded pixel width
     (input 301, glows 314/312/307/303) so the bar could never fill a column.
     Each is now 100% of the parent plus its original overhang, explicitly
     centred with left-1/2, so the layered edge is preserved at any width. */

export type GlowingSearchBarProps = {
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  /** Fired on submit (Enter) with the trimmed query. */
  onSearch?: (query: string) => void;
  /**
   * Fired on every keystroke. For a bar that filters a list already on screen,
   * where waiting for Enter would feel broken.
   */
  onQueryChange?: (query: string) => void;
  /** Accessible label for the input. */
  label?: string;
  className?: string;
};

const SearchComponent = ({
  placeholder = 'Search...',
  defaultValue,
  name = 'q',
  onSearch,
  onQueryChange,
  label = 'Search',
  className,
}: GlowingSearchBarProps) => {
  // The source used fixed ids ("search", "searchl", "glowing-search-input").
  // Two search bars on one page would collide, and the second would render its
  // icon with the first one's gradient.
  const uid = useId();
  const inputId = `sb-input-${uid}`;
  const circleGradientId = `sb-search-${uid}`;
  const lineGradientId = `sb-searchl-${uid}`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get(name) ?? '');
    onSearch?.(value.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn('relative flex w-full items-center justify-center', className)}
    >
      <div className="absolute z-[-1] w-full h-min-screen"></div>
      <div id="poda" className="relative flex w-full items-center justify-center group isolate">
        <div className="absolute z-[-1] overflow-hidden h-full w-[calc(100%+13px)] left-1/2 -translate-x-1/2 max-h-[70px] rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[999px] before:h-[999px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-60
                        before:bg-[conic-gradient(var(--sb-base),var(--sb-glow-1)_5%,var(--sb-base)_38%,var(--sb-base)_50%,var(--sb-glow-2)_60%,var(--sb-base)_87%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-120deg] group-focus-within:before:rotate-[420deg] group-focus-within:before:duration-[4000ms]">
        </div>
        <div className="absolute z-[-1] overflow-hidden h-full w-[calc(100%+11px)] left-1/2 -translate-x-1/2 max-h-[65px] rounded-xl blur-[3px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[82deg]
                        before:bg-[conic-gradient(transparent,var(--sb-glow-1),transparent_10%,transparent_50%,var(--sb-glow-2),transparent_60%)] before:transition-all before:duration-2000
                        group-hover:before:rotate-[-98deg] group-focus-within:before:rotate-[442deg] group-focus-within:before:duration-[4000ms]">
        </div>

        <div className="absolute z-[-1] overflow-hidden h-full w-[calc(100%+6px)] left-1/2 -translate-x-1/2 max-h-[63px] rounded-lg blur-[2px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-[83deg]
                        before:bg-[conic-gradient(transparent_0%,var(--sb-glow-soft-1),transparent_8%,transparent_50%,var(--sb-glow-soft-2),transparent_58%)] before:brightness-140
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-97deg] group-focus-within:before:rotate-[443deg] group-focus-within:before:duration-[4000ms]">
        </div>

        <div className="absolute z-[-1] overflow-hidden h-full w-[calc(100%+2px)] left-1/2 -translate-x-1/2 max-h-[59px] rounded-xl blur-[0.5px]
                        before:absolute before:content-[''] before:z-[-2] before:w-[600px] before:h-[600px] before:bg-no-repeat before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-70
                        before:bg-[conic-gradient(var(--sb-base-2),var(--sb-glow-1)_5%,var(--sb-base-2)_14%,var(--sb-base-2)_50%,var(--sb-glow-2)_60%,var(--sb-base-2)_64%)] before:brightness-130
                        before:transition-all before:duration-2000 group-hover:before:rotate-[-110deg] group-focus-within:before:rotate-[430deg] group-focus-within:before:duration-[4000ms]">
        </div>

        <div id="main" className="relative w-full group">
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
          <input
            id={inputId}
            placeholder={placeholder}
            defaultValue={defaultValue}
            type="text"
            name={name}
            autoComplete="off"
            onChange={(e) => onQueryChange?.(e.currentTarget.value)}
            className="bg-[var(--sb-field)] text-[var(--sb-field-text)] placeholder:text-[var(--sb-placeholder)] border-none w-full h-[56px] rounded-lg px-[59px] text-lg focus:outline-none"
          />
          <div id="input-mask" className="pointer-events-none w-[100px] h-[20px] absolute bg-gradient-to-r from-transparent to-[var(--sb-field)] top-[18px] left-[70px] group-focus-within:hidden"></div>
          <div id="pink-mask" className="pointer-events-none w-[30px] h-[20px] absolute bg-[var(--sb-halo)] top-[10px] left-[5px] blur-2xl opacity-80 transition-all duration-2000 group-hover:opacity-0"></div>
          {/* filter chip and its rotating ring removed — the bar is a plain
              search field, and the control had nothing wired to it */}
          <div id="search-icon" className="absolute left-5 top-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="24" fill="none" className="feather feather-search" aria-hidden="true">
              <circle stroke={`url(#${circleGradientId})`} r="8" cy="11" cx="11"></circle>
              <line stroke={`url(#${lineGradientId})`} y2="16.65" y1="22" x2="16.65" x1="22"></line>
              <defs>
                <linearGradient gradientTransform="rotate(50)" id={circleGradientId}>
                  <stop stopColor="var(--sb-icon-1)" offset="0%"></stop>
                  <stop stopColor="var(--sb-icon-2)" offset="50%"></stop>
                </linearGradient>
                <linearGradient id={lineGradientId}>
                  <stop stopColor="var(--sb-icon-2)" offset="0%"></stop>
                  <stop stopColor="var(--sb-icon-2)" offset="50%"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchComponent;
export { SearchComponent };
