/* Small building blocks shared by the three admin screens.

   Plain Tailwind on the site's own tokens rather than a second design system —
   the PHP panel this replaces shipped an entire purchased admin theme with 88
   vendor libraries to render what amounts to some forms and tables. */
import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { uploadImage } from './api';

/*
  Ctrl/Cmd+S saves the open editor. preventDefault matters: without it the
  browser opens its own "save page" dialog over the panel.
*/
export function useSaveShortcut(enabled: boolean, onSave: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, onSave]);
}

/*
  Warns on refresh / tab close while an editor holds unsaved edits. The in-app
  Cancel path is guarded separately with confirm(), because beforeunload only
  fires for the browser's own navigation.
*/
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-foreground text-background hover:opacity-90',
        variant === 'ghost' && 'border border-border bg-transparent hover:bg-muted',
        variant === 'danger' && 'bg-destructive text-destructive-foreground hover:opacity-90',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

const control =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground ' +
  'outline-none placeholder:text-muted-foreground focus:border-foreground/40';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, 'resize-y', props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, 'cursor-pointer', props.className)} />;
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-foreground"
      />
      {label}
    </label>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-5', className)}>{children}</div>
  );
}

export function Banner({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 text-sm',
        kind === 'error'
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      )}
    >
      {children}
    </div>
  );
}

export type StatusFilter = 'all' | 'published' | 'draft';

/*
  Search box + status pills for the list screens.

  Filtering is done in the caller over the already-fetched array — the whole list
  arrives in one request, so searching the server per keystroke would be slower
  and no more correct.
*/
export function ListControls({
  query,
  onQuery,
  status,
  onStatus,
  counts,
  placeholder,
}: {
  query: string;
  onQuery: (v: string) => void;
  status: StatusFilter;
  onStatus: (v: StatusFilter) => void;
  counts: { all: number; published: number; draft: number };
  placeholder: string;
}) {
  const pills: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-56 flex-1">
        <Input
          value={query}
          placeholder={placeholder}
          onChange={(e) => onQuery(e.target.value)}
          className="pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex gap-1">
        {pills.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onStatus(p.id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm transition',
              status === p.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {p.label}{' '}
            <span className="opacity-60">{counts[p.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** A list of plain strings — paragraphs, features. */
export function StringList({
  values,
  onChange,
  placeholder,
  multiline,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  const set = (i: number, v: string) => onChange(values.map((x, j) => (j === i ? v : x)));
  const remove = (i: number) => onChange(values.filter((_, j) => j !== i));

  return (
    <div className="flex flex-col gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <Textarea rows={3} value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
          ) : (
            <Input value={v} placeholder={placeholder} onChange={(e) => set(i, e.target.value)} />
          )}
          <Button variant="ghost" onClick={() => remove(i)} className="shrink-0 px-3">
            ✕
          </Button>
        </div>
      ))}
      <Button variant="ghost" onClick={() => onChange([...values, ''])} className="self-start">
        + Add
      </Button>
    </div>
  );
}

/*
  Labels offered as suggestions on the fact rows. Only a prompt: the field stays
  free text, because the useful labels differ per property — an apartment lists
  Beds and Baths, a plot lists frontage and road width.
*/
const LABEL_SUGGESTIONS = [
  'Beds', 'Baths', 'Bedrooms', 'Bathrooms', 'Balconies', 'Parking', 'Floor',
  'Built-up area', 'Plot size', 'SqFt', 'Road width', 'Rate',
  'Type', 'Status', 'Facing', 'Furnishing', 'Builder', 'Corner property',
];

const COUNTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];

/*
  Values that really are a closed set, keyed by lowercased label. Anything not
  listed here keeps a plain text box — most figures (areas, rates) are numbers
  with units and cannot be enumerated.
*/
const VALUE_OPTIONS: Record<string, string[]> = {
  beds: COUNTS,
  bedrooms: COUNTS,
  baths: COUNTS,
  bathrooms: COUNTS,
  balconies: COUNTS,
  parking: COUNTS,
  floor: COUNTS,
  floors: COUNTS,
  facing: [
    'North', 'North-East', 'East', 'South-East',
    'South', 'South-West', 'West', 'North-West',
  ],
  status: ['For Sale', 'For Rent', 'Sold', 'Under construction', 'Ready to move'],
  furnishing: ['Unfurnished', 'Semi-furnished', 'Furnished'],
  type: [
    'Apartment · Residential', 'Independent Floor · Residential',
    'Villa · Residential', 'Farmhouse Plot · Residential',
    'Plot · Residential', 'Commercial',
  ],
  'corner property': ['Yes', 'No'],
};

const OTHER = ' other';

/*
  The value half of a fact row: a dropdown when the label names a closed set,
  a text box otherwise.

  Two cases deliberately fall back to text so no existing entry becomes
  unreachable: a stored value that is not one of the options (SqFt 2,664, or a
  Status someone typed by hand before this existed), and picking "Other…".
*/
function FactValue({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [custom, setCustom] = useState(false);
  const options = VALUE_OPTIONS[label.trim().toLowerCase()];
  const fits = value === '' || (options?.includes(value) ?? false);

  if (!options || custom || !fits) {
    return (
      <Input
        value={value}
        placeholder="Value (e.g. 4)"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <Select
      value={value}
      onChange={(e) => {
        if (e.target.value === OTHER) {
          setCustom(true);
          onChange('');
        } else {
          onChange(e.target.value);
        }
      }}
    >
      <option value="">—</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
      <option value={OTHER}>Other…</option>
    </Select>
  );
}

/*
  The {label, value} rows behind both Specs and the Overview table.

  `visibleCount` marks the rows past a cut-off as not appearing on the property
  card, which shows only the first few.
*/
export function FactList({
  values,
  onChange,
  visibleCount,
}: {
  values: { label: string; value: string }[];
  onChange: (next: { label: string; value: string }[]) => void;
  visibleCount?: number;
}) {
  const set = (i: number, patch: Partial<{ label: string; value: string }>) =>
    onChange(values.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div className="flex flex-col gap-2">
      <datalist id="fact-labels">
        {LABEL_SUGGESTIONS.map((l) => (
          <option key={l} value={l} />
        ))}
      </datalist>

      {values.map((row, i) => {
        const offCard = visibleCount !== undefined && i >= visibleCount;
        return (
          <div key={i} className={cn('flex flex-col gap-1', offCard && 'opacity-60')}>
            <div className="flex items-center gap-2">
              <Input
                list="fact-labels"
                value={row.label}
                placeholder="Label (e.g. Bedrooms)"
                onChange={(e) => set(i, { label: e.target.value })}
              />
              <FactValue
                label={row.label}
                value={row.value}
                onChange={(value) => set(i, { value })}
              />
              <Button
                variant="ghost"
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="shrink-0 px-3"
              >
                ✕
              </Button>
            </div>
            {offCard && (
              <span className="text-xs text-muted-foreground">Not shown on the card.</span>
            )}
          </div>
        );
      })}

      <Button
        variant="ghost"
        onClick={() => onChange([...values, { label: '', value: '' }])}
        className="self-start"
      >
        + Add row
      </Button>
    </div>
  );
}

/*
  Gallery editor. The first image is the cover — the card and the detail page
  both open on it — so it is labelled as such and can be changed by moving
  another photograph to the front.

  Reordering is by buttons rather than dragging: it works with a keyboard and on
  a touch screen, and there is no drag library to carry.
*/
export function ImageList({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadImage(file));
      onChange([...images, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  const move = (i: number, delta: number) => {
    const j = i + delta;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-4/3 bg-muted">
                <img src={src} alt="" className="size-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded bg-foreground/85 px-1.5 py-0.5 text-[11px] font-medium text-background">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5">
                <div className="flex gap-1">
                  <Button variant="ghost" className="px-2 py-1" onClick={() => move(i, -1)}>
                    ←
                  </Button>
                  <Button variant="ghost" className="px-2 py-1" onClick={() => move(i, 1)}>
                    →
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="px-2 py-1"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted">
          {busy ? 'Uploading…' : '+ Add photographs'}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => {
              void onPick(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
        {images.length === 0 && (
          <span className="text-xs text-muted-foreground">
            The first photograph becomes the cover.
          </span>
        )}
      </div>

      {error && <Banner kind="error">{error}</Banner>}
    </div>
  );
}
