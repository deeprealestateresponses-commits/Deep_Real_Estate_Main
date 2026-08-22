import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/*
  The look lives in src/index.css under `.gradient-button` — a radial gradient
  whose stops are registered @property values, so the browser can interpolate
  them and the hover becomes a real 0.5s transition rather than a jump. This
  file only supplies the box and the variant switch.

  No "use client": this is a Vite SPA, not Next's app router, so the directive
  would be dead weight.
*/
const gradientButtonVariants = cva(
  [
    'gradient-button',
    'inline-flex items-center justify-center',
    'rounded-[11px] min-w-[132px] px-9 py-4',
    'text-base leading-[19px] text-white',
    'font-sans font-bold',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: '',
        variant: 'gradient-button-variant',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  /** Render the child element instead of a <button> — use for links. */
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(gradientButtonVariants({ variant, className }))} ref={ref} {...props} />
    );
  },
);
GradientButton.displayName = 'GradientButton';

export { GradientButton, gradientButtonVariants };
