import { useEffect, useState } from 'react';

/**
 * Reports whether the `.dark` class is currently on <html>.
 *
 * Stands in for next-themes' `useTheme()` — this project is Vite, not Next.js,
 * and the theme is a plain class toggle, so we observe the class directly.
 */
export function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains('dark'));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
