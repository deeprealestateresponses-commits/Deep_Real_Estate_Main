import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type BaseProps = {
  text?: string;
  className?: string;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type InteractiveHoverButtonProps = ButtonProps | AnchorProps;

/**
 * A button whose label slides out to the right while a dot in the corner
 * expands to fill it, revealing the same label with an arrow on the new
 * ground.
 *
 * Renders an <a> when given `href`. That matters wherever the control actually
 * navigates — a <button> that opens a document can't be middle-clicked,
 * bookmarked or opened in a new tab, and reads wrong to a screen reader.
 */
const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  InteractiveHoverButtonProps
>(({ text = 'Button', className, ...props }, ref) => {
  const shared = {
    ref: ref as never,
    className: cn(
      'group relative inline-block w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold',
      className,
    ),
    ...props,
  };

  const inner = (
    <>
      <span className="relative z-20 inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute top-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
      {/* the dot that grows into the filled state */}
      <div className="absolute left-[20%] top-[40%] z-10 h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary" />
    </>
  );

  if ('href' in props && props.href !== undefined) {
    return <a {...(shared as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  }

  return <button {...(shared as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{inner}</button>;
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export { InteractiveHoverButton };
