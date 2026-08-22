import { StarButton } from '@/components/ui/star-button';
import { useIsDark } from '@/lib/use-is-dark';

/** The original demo, with next-themes swapped for our class-based theme hook. */
export const Default = () => {
  const isDark = useIsDark();
  const lightColor = isDark ? '#FAFAFA' : '#FF2056';

  return (
    <StarButton lightColor={lightColor} className="rounded-3xl">
      Button
    </StarButton>
  );
};

/** Sized and worded as it is used in the welcome section. */
export const AsUsed = () => {
  const isDark = useIsDark();

  return (
    <StarButton
      href="#"
      lightColor={isDark ? '#FAFAFA' : '#0080C6'}
      className="h-12 px-7 text-[15px] font-semibold"
    >
      Browse Properties
    </StarButton>
  );
};

/** Prop sweep — speed, light width and border. */
export const Variants = () => {
  const isDark = useIsDark();
  const light = isDark ? '#FAFAFA' : '#0080C6';

  return (
    <div className="flex flex-wrap items-center gap-5">
      <StarButton lightColor={light} duration={1.5}>
        Fast (1.5s)
      </StarButton>
      <StarButton lightColor={light} duration={6}>
        Slow (6s)
      </StarButton>
      <StarButton lightColor={light} lightWidth={220}>
        Wide light
      </StarButton>
      <StarButton lightColor={light} borderWidth={1} className="h-12 px-8">
        Thin border, large
      </StarButton>
    </div>
  );
};
