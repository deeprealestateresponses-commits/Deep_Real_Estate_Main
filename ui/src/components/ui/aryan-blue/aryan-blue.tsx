// GradientBackground — "Aryan Blue", made with the 21st.dev Gradient
// Builder and exported as live CSS (the builder's own Copy-CSS background,
// plus its soften-blur and grain passes). Zero dependencies: one <div> that
// fills its parent. Drop it behind your content:
// <div className="relative h-96"><GradientBackground className="absolute inset-0" /></div>
// Remix the source recipe (colors, mode, finish) in the editor:
// https://21st.dev/community/gradients/editor?from=2102cd52-9ae3-4da2-8a29-155de780c1dc
//
// Orientation note — the ramp is 0deg, i.e. bottom-to-top, so the near-black
// #031C26 stop lands at the TOP of the box and the near-white #EBF9FF fills the
// bottom four-tenths. Anything placed over it has to survive both ends.
export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        containerType: 'size',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#EBF9FF',
          backgroundImage:
            "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.110'/></svg>\"), linear-gradient(0deg, #EBF9FF 38%, #57D2F4 61%, #1B6AA7 81%, #031C26 97%)",
          backgroundSize: '120px 120px, auto',
          backgroundBlendMode: 'overlay, normal',
        }}
      />
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.11,
          mixBlendMode: 'overlay',
        }}
      >
        <filter id="grain-2102cd52">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-2102cd52)" />
      </svg>
    </div>
  );
}
