import React from 'react';
import { cn } from '@/lib/utils';

/*
  Integration notes (differences from the source snippet):
  - The snippet hardcoded `h-screen` on a centring wrapper. It sits inside a
    panel here, so size is a prop and the wrapper is the caller's business.
  - The keyframes moved to index.css. A <style> block rendered inside a
    component re-injects the same rules on every mount, and this one mounts and
    unmounts every time the rail opens or closes.
  - The stars sat inside the globe's own `overflow-hidden`, which clipped every
    one of them — they were positioned at left-[350px] on a 250px circle. They
    are siblings of the globe now, so they actually show.

  The texture is a remote file on the snippet author's R2 bucket. Nothing here
  controls that URL: if it goes away the globe degrades to a dark sphere with
  the lighting still on it, which is why the base colour is set underneath.
*/

export type GlobeProps = {
  /** Diameter in px. */
  size?: number;
  className?: string;
};

const STARS = [
  { left: -18, top: 12, anim: 'twinkle 3s infinite' },
  { left: -34, top: 74, anim: 'twinkle 2s infinite' },
  { left: 8, top: 168, anim: 'twinkle 1.5s infinite' },
  { left: 96, top: -22, anim: 'twinkle 4s infinite' },
  { left: 164, top: 196, anim: 'twinkle 3s infinite' },
  { left: 188, top: 40, anim: 'twinkle 2s infinite' },
  { left: -28, top: 140, anim: 'twinkle 4s infinite' },
];

export const Globe: React.FC<GlobeProps> = ({ size = 180, className }) => {
  const scale = size / 250;

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white motion-reduce:animate-none"
          style={{ left: s.left * scale + size / 2, top: s.top * scale, animation: s.anim }}
        />
      ))}

      <div
        className="relative rounded-full bg-[#0b2436] shadow-[0_0_20px_rgba(255,255,255,0.2),-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset] motion-reduce:animate-none"
        style={{
          width: size,
          height: size,
          backgroundImage:
            "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'left',
          animation: 'earth-rotate 30s linear infinite',
        }}
      />
    </div>
  );
};

export default Globe;
