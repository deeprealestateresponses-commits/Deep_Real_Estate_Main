import { useCountUp } from '@/lib/use-count-up';
import { cn } from '@/lib/utils';

export type ProcessStep = {
  step: string;
  title: string;
  body: string;
};

export type ProcessStat = {
  value: number;
  suffix?: string;
  label: string;
};

export type ProcessSectionProps = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  steps?: ProcessStep[];
  stats?: ProcessStat[];
  backgroundImage?: string;
  fill?: boolean;
  className?: string;
};

const defaultSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Tell us what you need',
    body: 'Budget, sector, possession timeline. We start from your constraints, not from what we are trying to move.',
  },
  {
    step: '02',
    title: 'We shortlist',
    body: 'Only options that genuinely exist at the price quoted, checked against our own book and the developer.',
  },
  {
    step: '03',
    title: 'We visit together',
    body: 'We drive you to each one and point out what a listing photo will never tell you about a property.',
  },
  {
    step: '04',
    title: 'Paperwork & handover',
    body: 'Registry, dues, khata and possession — handled end to end so nothing lands back on your desk.',
  },
];

const defaultStats: ProcessStat[] = [
  { value: 900, label: 'Properties in hand' },
  { value: 25, label: 'Team strength' },
  { value: 1200, label: 'Deals closed' },
];

const StatItem = ({ stat }: { stat: ProcessStat }) => {
  const { ref, value } = useCountUp(stat.value);

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="text-center sm:text-left">
      <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {value.toLocaleString('en-IN')}
        {stat.suffix ?? ''}
      </div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
        {stat.label}
      </div>
    </div>
  );
};

/**
 * Homepage section — Our process, on a night-city backdrop.
 *
 * The photograph is decorative and sits behind two stacked gradients: a
 * near-opaque wash on the left where the copy sits, and a softer vertical one
 * so the image still reads. Text contrast is the constraint, not the picture.
 */
export const ProcessSection = ({
  eyebrow = 'Our process',
  heading = 'Four steps. No surprises in between.',
  lede = 'Twenty years of doing this in one city means we already know which questions matter — and which answers to distrust.',
  steps = defaultSteps,
  stats = defaultStats,
  backgroundImage = '/img/bg/city.jpg',
  fill = false,
  className,
}: ProcessSectionProps) => {
  return (
    <section
      className={cn(
        'relative isolate w-full overflow-hidden bg-[#06121b]',
        fill && 'lg:flex lg:h-full lg:min-h-0 lg:items-center',
        className,
      )}
    >
      {/* backdrop */}
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,18,27,0.82)_0%,rgba(6,18,27,0.62)_45%,rgba(6,18,27,0.92)_100%)]"
      />

      <div
        className={cn(
          'relative mx-auto w-full max-w-[1400px] px-5 sm:px-8',
          fill ? 'py-16 lg:py-12' : 'py-20 sm:py-24',
        )}
      >
        {/* header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-[2.6rem]">
            {heading}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-white/70">{lede}</p>
        </div>

        {/* steps */}
        <ol
          className={cn(
            'grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4',
            fill ? 'mt-10' : 'mt-14',
          )}
        >
          {steps.map((s) => (
            <li key={s.step} className="border-t border-white/15 pt-5">
              <span className="text-xs font-bold tracking-[0.2em] text-primary">{s.step}</span>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-white/60">{s.body}</p>
            </li>
          ))}
        </ol>

        {/* stats */}
        <div
          className={cn(
            'grid grid-cols-1 gap-8 border-t border-white/15 pt-8 sm:grid-cols-3',
            fill ? 'mt-10' : 'mt-16',
          )}
        >
          {stats.map((s) => (
            <StatItem key={s.label} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
};
