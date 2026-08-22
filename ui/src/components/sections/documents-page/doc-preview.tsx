import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export type DocPreviewProps = {
  /** Null closes it. */
  doc: { title: string; ext: string; sizeKb: number; fileHref: string } | null;
  onClose: () => void;
};

/**
 * A document, rendered in place.
 *
 * Browsers cannot display .doc or .docx, so the preview is Microsoft's own
 * Office viewer in an iframe. It fetches the file from the public URL itself
 * rather than being handed bytes by the page, which is why the src has to be
 * absolute — and why this cannot work against a dev server that the outside
 * world cannot reach. On localhost the panel says so and offers the download
 * instead of showing an iframe that would sit blank forever.
 */
export const DocPreview = ({ doc, onClose }: DocPreviewProps) => {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [doc, onClose]);

  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  const absolute = doc ? origin + doc.fileHref : '';
  const viewerSrc = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(absolute)}`;

  return createPortal(
    <AnimatePresence>
      {doc && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview — ${doc.title}`}
        >
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[#04121b]/80 backdrop-blur-[3px]"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-[86dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl"
          >
            <header className="flex shrink-0 items-center gap-4 border-b bg-[linear-gradient(160deg,#f1f7fc_0%,#e2edf7_100%)] px-5 py-4">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[16px] font-bold tracking-tight text-foreground">
                  {doc.title}
                </h2>
                <p className="mt-0.5 flex items-center gap-2 text-[12.5px] text-muted-foreground">
                  <span className="font-bold uppercase tracking-wider">{doc.ext}</span>
                  <span aria-hidden="true" className="text-muted-foreground/40">·</span>
                  <span>{doc.sizeKb} KB</span>
                </p>
              </div>

              <a
                href={doc.fileHref}
                download
                className="hidden h-9 shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] px-4 text-[13px] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
              >
                Download
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border bg-card text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            {isLocal ? (
              <div className="grid flex-1 place-items-center bg-muted/40 p-8 text-center">
                <div>
                  <p className="text-[15px] font-semibold text-foreground">
                    Preview needs the published site.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-[14px] leading-[1.6] text-muted-foreground">
                    The Office viewer fetches the file over the internet, and a dev server is
                    not reachable from outside this machine. On the live site this panel shows
                    the document.
                  </p>
                  <a
                    href={doc.fileHref}
                    download
                    className="mt-5 inline-flex h-11 items-center rounded-full bg-[linear-gradient(120deg,#0b9ae0_0%,#0080c6_50%,#00618f_100%)] px-6 text-[14px] font-bold text-white"
                  >
                    Download instead
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                key={doc.fileHref}
                title={`Preview of ${doc.title}`}
                src={viewerSrc}
                className="flex-1 border-0 bg-muted/40"
              />
            )}

            <footer className="flex shrink-0 items-center justify-between gap-3 border-t bg-muted/40 px-5 py-3">
              <p className="text-[12.5px] text-muted-foreground">
                Rendered by the Microsoft Office viewer.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={isLocal ? doc.fileHref : viewerSrc}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12.5px] font-semibold text-primary hover:underline"
                >
                  Open in a new tab
                </a>
                <a
                  href={doc.fileHref}
                  download
                  className="text-[12.5px] font-semibold text-primary hover:underline sm:hidden"
                >
                  Download
                </a>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
