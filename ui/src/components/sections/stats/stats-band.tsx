import { useCountUp } from '@/lib/use-count-up';
import { cn } from '@/lib/utils';

export type Stat = {
  value: number;
  suffix?: string;
  label: string;
};

export type StatsBandProps = {
  stats?: Stat[];
  backgroundImage?: string;
  className?: string;
};

const defaultStats: Stat[] = [
  { value: 900, label: 'Properties in hand' },
  { value: 25, label: 'Team strength' },
  { value: 1200, label: 'Happy clients' },
];

const StatItem = ({ stat }: { stat: Stat }) => {
  const { ref, value } = useCountUp(stat.value);

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className="flex flex-col items-center justify-center px-4 text-center"
    >
      <span className="text-3xl font-bold leading-none tracking-tight text-white sm:text-[38px]">
        {value.toLocaleString('en-IN')}
        {stat.suffix ?? ''}
      </span>
      <span className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
        {stat.label}
      </span>
    </div>
  );
};

/**
 * A ~160px credibility strip, not a section.
 *
 * Deliberately short: it is a rule between two full sections, so it has no
 * heading, no padding to speak of, and one row of figures. The photograph is
 * pushed almost entirely under a dark wash — at this height it reads as texture
 * rather than as an image, which is the point.
 */
export const StatsBand = ({
  stats = defaultStats,
  backgroundImage = '/img/bg/city.jpg',
  className,
}: StatsBandProps) => {
  return (
    <section
      className={cn(
        'relative isolate flex h-[160px] w-full items-center overflow-hidden bg-[#06121b]',
        className,
      )}
    >
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,18,27,0.94)_0%,rgba(6,18,27,0.72)_50%,rgba(6,18,27,0.94)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-3 divide-x divide-white/12">
          {stats.map((s) => (
            <StatItem key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
};
