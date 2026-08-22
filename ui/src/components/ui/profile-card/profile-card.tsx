import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ProfileAction = {
  icon: LucideIcon;
  href: string;
  /** Accessible name — also the tooltip. */
  label: string;
  /** Opens in a new tab. Off for tel: and mailto:, on for WhatsApp. */
  external?: boolean;
};

export interface ProfileCardProps {
  name?: string;
  title?: string;
  /** One string, or several for a multi-paragraph bio. */
  description?: string | string[];
  imageUrl?: string;
  /** Where the square crop sits on a portrait photograph. */
  imagePosition?: string;
  /** Round buttons under the copy. Nothing renders when the list is empty. */
  actions?: ProfileAction[];
  /** Card surface — the panel overlaps the photo, so it needs to be opaque. */
  cardClassName?: string;
  className?: string;
}

/**
 * Portrait left, copy on a card that overlaps it.
 *
 * The overlap is the whole idea: the card sits 80px over the photograph, so
 * the two read as one object rather than as an image beside a paragraph.
 * Below md the overlap is dropped — at that width it would cover the face —
 * and the two stack, centred.
 *
 * Plain <img> and <a>, not next/image and next/link: this is a Vite app.
 */
export function ProfileCard({
  name = 'Pawan Yadav',
  title = 'Founder, Deep Real Estate',
  description = '',
  imageUrl,
  imagePosition = 'center 18%',
  actions = [],
  cardClassName,
  className,
}: ProfileCardProps) {
  const paragraphs = Array.isArray(description) ? description : description ? [description] : [];

  const Actions = ({ center }: { center?: boolean }) =>
    actions.length ? (
      <div className={cn('flex gap-3', center && 'justify-center')}>
        {actions.map(({ icon: Icon, href, label, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            title={label}
            aria-label={label}
            className="grid h-12 w-12 place-items-center rounded-full bg-[#0b1a27] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_12px_26px_-12px_rgb(0_128_198/0.9)]"
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </a>
        ))}
      </div>
    ) : null;

  const Portrait = ({ className: c }: { className?: string }) => (
    <div className={cn('overflow-hidden rounded-3xl bg-muted', c)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          draggable={false}
          className="h-full w-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-full w-full place-items-center text-[72px] font-extrabold tracking-tight text-foreground/25"
        >
          {name
            .split(/\s+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join('')}
        </span>
      )}
    </div>
  );

  return (
    <div className={cn('mx-auto w-full max-w-5xl', className)}>
      {/* ------------------------------------------------------ md and up */}
      <div className="relative hidden items-center md:flex">
        <Portrait className="h-[470px] w-[470px] shrink-0" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'z-10 ml-[-80px] max-w-xl flex-1 rounded-3xl bg-card p-8 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)]',
            cardClassName,
          )}
        >
          <h3 className="text-2xl font-bold tracking-tight text-foreground">{name}</h3>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">{title}</p>

          <div className="mt-6 space-y-4">
            {paragraphs.map((p) => (
              <p key={p} className="text-[15.5px] leading-[1.75] text-foreground/80">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <Actions />
          </div>
        </motion.div>
      </div>

      {/* ------------------------------------------------------ below md */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-sm text-center md:hidden"
      >
        <Portrait className="mb-6 aspect-square w-full" />

        <div className={cn('rounded-3xl bg-card p-6 text-left', cardClassName)}>
          <h3 className="text-xl font-bold tracking-tight text-foreground">{name}</h3>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">{title}</p>

          <div className="mt-5 space-y-3.5">
            {paragraphs.map((p) => (
              <p key={p} className="text-[15px] leading-[1.7] text-foreground/80">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-6">
            <Actions />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
