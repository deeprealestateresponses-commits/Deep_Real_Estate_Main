import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes, letting later classes win over earlier conflicting
 * ones (e.g. a passed-in `rounded-xl` correctly overrides a default `rounded-lg`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
