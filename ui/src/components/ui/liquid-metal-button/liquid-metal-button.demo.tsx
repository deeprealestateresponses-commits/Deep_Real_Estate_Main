import { LiquidMetalButton } from './liquid-metal-button';

/** Default size, plus the two sizes actually used on the page. */
export const Default = () => (
  <div className="flex flex-col items-center gap-10 p-8">
    <LiquidMetalButton label="Get Started" />

    <div className="w-[420px]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Contact form — full width, 56px
      </p>
      <LiquidMetalButton label="Send message" width="100%" height={56} fontSize={15} />
    </div>

    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Navbar — 168px, 42px
      </p>
      <LiquidMetalButton label="Sell Your Property" href="#" width={168} height={42} fontSize={13} />
    </div>
  </div>
);
