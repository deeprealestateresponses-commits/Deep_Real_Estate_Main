import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/* Integration notes (differences from the source snippet):
   - Cleanup called `shaderMount.destroy()`. @paper-design/shaders exposes
     `dispose()` and no `destroy`, so the optional-chain silently did nothing
     and every unmount leaked a WebGL context. Browsers cap those at ~16 and
     then start killing the oldest, so a few navigations would have blanked
     other shaders on the page.
   - Sizes were hardcoded (142x46). Both places this is used need something
     else — the form submit is full-width at 56px, the nav CTA is auto-width —
     so width/height are props and every layer is now 100%. ShaderMount already
     matches its parent's size, so nothing else was needed.
   - Renders an <a> when given `href`, and accepts `type="submit"` so it can
     actually submit the contact form.
   - The global <style> injection moved into index.css.
   - Label defaults to a light grey. The original #666 on the near-black pill is
     about 3.3:1, which fails AA for body-sized text on a primary CTA. */

export type LiquidMetalButtonProps = {
  label?: string;
  onClick?: () => void;
  /** Renders an anchor instead of a button. */
  href?: string;
  type?: 'button' | 'submit';
  /** Any CSS width — a number is treated as px. */
  width?: number | string;
  height?: number;
  fontSize?: number;
  labelColor?: string;
  className?: string;
};

export function LiquidMetalButton({
  label = 'Get Started',
  onClick,
  href,
  type = 'button',
  width = 142,
  height = 46,
  fontSize = 14,
  labelColor = '#dcdcdc',
  className,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const surfaceRef = useRef<HTMLElement | null>(null);
  const rippleId = useRef(0);

  useEffect(() => {
    if (!shaderRef.current) return;

    try {
      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        /* Speed 0 renders one frame and then stops the rAF loop entirely
           (documented behaviour). The nav button lives in a sticky header, so
           at the original 0.6 it drove a WebGL redraw on every single frame of
           the page's lifetime. It now animates only while hovered. */
        0,
      );
    } catch (error) {
      // A failed WebGL context should not take the page down; the button still
      // works, it just renders as the plain dark pill underneath.
      console.error('[liquid-metal-button] shader failed to mount:', error);
    }

    return () => {
      shaderMount.current?.dispose();
      shaderMount.current = null;
    };
  }, []);

  const setSpeed = (speed: number) => shaderMount.current?.setSpeed?.(speed);

  const handleEnter = () => {
    setIsHovered(true);
    setSpeed(1);
  };

  const handleLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    setSpeed(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setSpeed(2.4);
    window.setTimeout(() => setSpeed(isHovered ? 1 : 0), 300);

    const el = surfaceRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const ripple = { x: e.clientX - rect.left, y: e.clientY - rect.top, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(
        () => setRipples((prev) => prev.filter((r) => r.id !== ripple.id)),
        600,
      );
    }

    onClick?.();
  };

  const cssWidth = typeof width === 'number' ? `${width}px` : width;

  const surfaceStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    zIndex: 40,
    transformStyle: 'preserve-3d',
    transform: 'translateZ(25px)',
    overflow: 'hidden',
    borderRadius: '100px',
    display: 'block',
  };

  const rippleNodes = ripples.map((r) => (
    <span
      key={r.id}
      style={{
        position: 'absolute',
        left: `${r.x}px`,
        top: `${r.y}px`,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background:
          'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
        pointerEvents: 'none',
        animation: 'ripple-animation 0.6s ease-out',
      }}
    />
  ));

  const interactionProps = {
    onClick: handleClick,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    style: surfaceStyle,
    'aria-label': label,
  };

  return (
    <div className={cn('relative inline-block align-middle', className)} style={{ width: cssWidth }}>
      <div style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${height}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* label */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transformStyle: 'preserve-3d',
              transform: 'translateZ(20px)',
              zIndex: 30,
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: `${fontSize}px`,
                color: labelColor,
                fontWeight: 600,
                letterSpacing: '0.01em',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.6)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          </div>

          {/* inner pill — leaves a 2px rim of shader showing as the metal edge */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: `translateZ(10px) ${isPressed ? 'translateY(1px) scale(0.98)' : 'none'}`,
              transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 20,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '2px',
                borderRadius: '100px',
                background: 'linear-gradient(180deg, #202020 0%, #000000 100%)',
                boxShadow: isPressed
                  ? 'inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)'
                  : 'none',
                transition: 'box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>

          {/* shader */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: `translateZ(0px) ${isPressed ? 'translateY(1px) scale(0.98)' : 'none'}`,
              transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '100px',
                boxShadow: isPressed
                  ? '0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)'
                  : isHovered
                    ? '0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)'
                    : '0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)',
                transition: 'box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'rgb(0 0 0 / 0)',
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: '100px',
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          </div>

          {/* interactive surface */}
          {href ? (
            <a
              ref={surfaceRef as React.Ref<HTMLAnchorElement>}
              href={href}
              {...interactionProps}
            >
              {rippleNodes}
            </a>
          ) : (
            <button
              ref={surfaceRef as React.Ref<HTMLButtonElement>}
              type={type}
              {...interactionProps}
            >
              {rippleNodes}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
