import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/*
  Integration notes (differences from the source snippet):
  - No "use client": this is a Vite SPA, not Next's app router.
  - The snippet hardcoded gray-100 / gray-800 and gray-600 / gray-300. Those are
    swapped for theme tokens, so the rail matches the site and follows the
    dark-mode switch instead of ignoring it.
  - Circles are 48px on a 56px step, not 64 on 48. The snippet's spacing was
    tighter than its own circles, so they overlapped; and at 64px nine items ran
    to 672px, taller than the viewport they open into.
  - Items open into three columns. The panel is a fixed size — it must not grow
    when the rail opens — and nine items only fit inside it as 3 x 3.
  - MenuItem gained `label` and `active`. Nine categories cannot be told apart
    by icon alone — "South City" and "Sushant Lok" have no distinct glyph — so
    each carries its name *under* the circle. A hover label beside the circle
    was the obvious first move and the wrong one: in two columns it opened
    straight over the neighbouring circle.
  - The head wears a travelling conic ring, the same one the FAQ card uses, so
    the closed state advertises itself as something to open.
  - The unused `Menu` dropdown from the snippet is left out; nothing here needs
    a second, differently-shaped menu.
*/

export type MenuItemProps = {
  icon?: React.ReactNode;
  /** Accessible name, and the pill that appears on hover. */
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  /** The head of the rail: primary fill, no hover label. */
  head?: boolean;
};

export function MenuItem({
  icon,
  label,
  onClick,
  disabled = false,
  active = false,
  head = false,
}: MenuItemProps) {
  if (head) {
    return (
      <button
        type="button"
        className="group/item relative block h-full w-full cursor-pointer rounded-full bg-primary text-center text-primary-foreground transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
        role="menuitem"
        aria-label={label}
        title={label}
        onClick={onClick}
      >
        <span className="flex h-full items-center justify-center">
          {icon && <span className="h-5 w-5">{icon}</span>}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'group/item flex w-full flex-col items-center gap-1.5 text-center',
        'transition-transform duration-200 ease-out',
        // the zoom on approach
        !disabled && 'hover:scale-105 active:scale-95',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
      role="menuitem"
      aria-label={label}
      aria-current={active || undefined}
      title={label}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={cn(
          'grid h-12 w-12 shrink-0 place-items-center rounded-full border transition-colors',
          active
            ? 'border-transparent bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_rgb(0_128_198/0.9)]'
            : 'border-white/15 bg-white/10 text-white/80 group-hover/item:border-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground',
        )}
      >
        {icon && (
          <span className="h-5 w-5 transition-all duration-200 group-hover/item:[&_svg]:stroke-[2.5]">
            {icon}
          </span>
        )}
      </span>

      {/* Under the circle, not beside it — in two columns a side label lands on
          top of its neighbour. Two lines max, so "Builder Projects" fits. */}
      {label && (
        <span
          className={cn(
            'line-clamp-2 w-full text-[10px] font-semibold leading-tight transition-colors',
            active ? 'text-white' : 'text-white/55 group-hover/item:text-white',
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
}

/** Circle diameter, and the cell each open item occupies. */
const SIZE = 48;
/** Tall enough for the circle plus two lines of label. */
const STEP_Y = 86;
const CELL_W = 78;
const STEP_X = CELL_W + 8;
/** How many columns the stack opens into. Three rows of three is what fits the
    panel without making it taller than its closed, globe-holding state. */
const COLS = 3;

export function MenuContainer({
  children,
  className,
  onCollapse,
  onOpenChange,
}: {
  children: React.ReactNode;
  className?: string;
  /** Fired when the rail closes, not when it opens. */
  onCollapse?: () => void;
  /** Fired on every change, so the caller can swap what sits behind it. */
  onOpenChange?: (open: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const rows = Math.ceil((childrenArray.length - 1) / COLS);

  return (
    <div
      className={cn('relative w-12', className)}
      data-expanded={isExpanded}
      role="menu"
      aria-orientation="vertical"
      /* The open stack is absolutely positioned, so the wrapper has to be told
         how much room it takes or the content under it collides with it. */
      style={{
        height: isExpanded ? rows * STEP_Y + SIZE : SIZE,
        width: isExpanded ? (COLS - 1) * STEP_X + CELL_W : SIZE,
        transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="relative">
        {/* Head — always visible, and the toggle. The 2px conic rim runs
            continuously so the closed rail reads as live rather than as a
            static icon. */}
        <div
          className="animate-border-run relative z-50 h-12 w-12 cursor-pointer rounded-full p-[2px] shadow-lg will-change-transform [background:conic-gradient(from_var(--border-angle),var(--color-sky-400),var(--color-blue-600),var(--color-cyan-300),var(--color-blue-600),var(--color-sky-400))] motion-reduce:animate-none"
          onClick={() =>
            setIsExpanded((v) => {
              if (v) onCollapse?.();
              onOpenChange?.(!v);
              return !v;
            })
          }
        >
          <div className="h-full w-full overflow-hidden rounded-full">{childrenArray[0]}</div>
        </div>

        {/* The rest, fanning downward out from under the head. */}
        {childrenArray.slice(1).map((child, index) => (
          <div
            key={index}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: CELL_W,
              transform: isExpanded
                ? `translate(${(index % COLS) * STEP_X}px, ${
                    (Math.floor(index / COLS) + 1) * STEP_Y
                  }px)`
                : 'translate(0px, 0px)',
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? 'auto' : 'none',
              zIndex: 40 - index,
              transition: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${
                isExpanded ? '300ms' : '350ms'
              }`,
              transitionDelay: isExpanded ? `${index * 18}ms` : '0ms',
              backfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
