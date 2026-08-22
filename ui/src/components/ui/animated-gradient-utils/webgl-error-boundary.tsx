import React from 'react';
import { cn } from '@/lib/utils';

/*
  The snippet imports these two from
  @/components/ui/animated-gradient-utils/webgl-error-boundary but does not
  include the file, so this is written to its contract: a boundary that catches
  a throw from inside the canvas, and a still image to show instead.

  Both matter here. The gradient is a background behind a page heading — if
  WebGL is unavailable (old hardware, a locked-down browser, a headless render)
  the heading must still sit on something, and a hard crash would take the whole
  page with it.
*/

/** A plain CSS approximation, for when the canvas cannot run. */
export const WebGLFallback = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn(
      'bg-[radial-gradient(120%_120%_at_20%_0%,#0b3a5c_0%,#04121b_55%),linear-gradient(120deg,#0080c6_0%,transparent_55%)]',
      className,
    )}
  />
);

type Props = { children: React.ReactNode; fallback: React.ReactNode };
type State = { failed: boolean };

export class WebGLErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Worth a line in the console: a silent swap to the fallback looks like the
    // gradient was simply never wired up.
    console.warn('AnimatedGradient failed, using the static fallback:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
