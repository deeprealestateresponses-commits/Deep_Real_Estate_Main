/* Supplied component, integrated with four changes:

   · typed. The original leaves every prop implicitly `any`, which `tsc -b`
     rejects in this project;
   · it searches whatever it is handed rather than a hard-coded list of
     JavaScript frameworks, and each result is a link, so a hit on a property
     goes to that property;
   · the class names it referenced came with no CSS, so that is written out in
     animated-search-bar.css alongside it — the goo filter, the pill, and the
     result rows the motion variants animate;
   · the dummy 500ms network delay is gone. It filters an array already in
     memory, and pretending to wait for a server only makes the result slower.

   The debounce is kept: it is what stops the result list re-animating on
   every keystroke. */

import { useState, useRef, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import './animated-search-bar.css';

export type SearchItem = {
  label: string;
  /** Where a hit leads. Rendered as the row's href. */
  href: string;
  /** Second line, e.g. a locality. Kept short — the row is one line tall. */
  hint?: string;
};

const GooeyFilter = () => (
  <svg aria-hidden="true" className="absolute h-0 w-0">
    <defs>
      <filter id="goo-effect">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -15"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
);

const SearchIcon = ({ isUnsupported }: { isUnsupported: boolean }) => (
  <motion.svg
    initial={{ opacity: 0, scale: 0.8, x: -4, filter: isUnsupported ? 'none' : 'blur(5px)' }}
    animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, scale: 0.8, x: -4, filter: isUnsupported ? 'none' : 'blur(5px)' }}
    transition={{ delay: 0.1, duration: 1, type: 'spring', bounce: 0.15 }}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </motion.svg>
);

const LoadingIcon = () => (
  <svg
    className="loading-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    aria-label="Searching"
    role="status"
  >
    <rect width="256" height="256" fill="none" />
    {[
      [128, 32, 128, 64],
      [195.88, 60.12, 173.25, 82.75],
      [224, 128, 192, 128],
      [195.88, 195.88, 173.25, 173.25],
      [128, 224, 128, 192],
      [60.12, 195.88, 82.75, 173.25],
      [32, 128, 64, 128],
      [60.12, 60.12, 82.75, 82.75],
    ].map(([x1, y1, x2, y2]) => (
      <line
        key={`${x1}-${y1}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    ))}
  </svg>
);

const InfoIcon = ({ index }: { index: number }) => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ delay: index * 0.12 + 0.3 }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
    className="info-icon"
    aria-hidden="true"
    fill="none"
  >
    <path
      d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.91420 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.91420 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </motion.svg>
);

const buttonVariants = {
  initial: { x: 0, width: 140 },
  step1: { x: 0, width: 140 },
  step2: { x: 0, width: 320 },
};

const iconVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 16, opacity: 1 },
};

const useDebounce = <T,>(value: T, delay: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);
  return debounced;
};

export const isUnsupportedBrowser = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isSafari =
    ua.includes('safari') &&
    !ua.includes('chrome') &&
    !ua.includes('chromium') &&
    !ua.includes('android') &&
    !ua.includes('firefox');
  const isChromeOniOS = ua.includes('crios');
  return isSafari || isChromeOniOS;
};

const getResultItemVariants = (index: number, isUnsupported: boolean) => ({
  initial: { y: 0, scale: 0.3, filter: isUnsupported ? 'none' : 'blur(10px)' },
  animate: { y: (index + 1) * 50, scale: 1, filter: 'blur(0px)' },
  exit: { y: isUnsupported ? 0 : -4, scale: 0.8 },
});

const getResultItemTransition = (index: number) => ({
  duration: 0.75,
  delay: index * 0.12,
  type: 'spring' as const,
  bounce: 0.35,
  exit: { duration: index * 0.1 },
  filter: { ease: 'easeInOut' as const },
});

export type GooeySearchBarProps = {
  items: SearchItem[];
  buttonLabel?: string;
  placeholder?: string;
  /** 'light' is the white pill; 'dark' is the black one. */
  tone?: 'light' | 'dark';
  className?: string;
};

export const GooeySearchBar = ({
  items,
  buttonLabel = 'Search',
  placeholder = 'Type a name or locality…',
  tone = 'light',
  className,
}: GooeySearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [searchText, setSearchText] = useState('');

  const debounced = useDebounce(searchText, 300);
  const isUnsupported = useMemo(() => isUnsupportedBrowser(), []);
  /* "Loading" here means "you have typed something the debounce has not caught
     up with yet" — there is no request behind it. */
  const isLoading = searchText.trim() !== debounced.trim();

  useEffect(() => {
    if (step === 2) inputRef.current?.focus();
    else setSearchText('');
  }, [step]);

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    return items.filter(
      (i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q),
    );
  }, [items, debounced]);

  /* Clicking away closes it again, otherwise an expanded pill with nothing in
     it sits there for the rest of the visit. */
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step !== 2) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setStep(1);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [step]);

  const showEmpty = step === 2 && !isLoading && debounced.trim() !== '' && results.length === 0;

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        'gooey-search wrapper relative flex justify-center',
        tone === 'dark' && 'tone-dark',
        isUnsupported && 'no-goo',
        className,
      )}
    >
      <GooeyFilter />

      <div className="button-content">
        <motion.div
          className="button-content-inner"
          initial="initial"
          animate={step === 1 ? 'step1' : 'step2'}
          transition={{ duration: 0.75, type: 'spring', bounce: 0.15 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key="search-text-wrapper"
              className="search-results"
              role="listbox"
              aria-label="Search results"
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: isUnsupported ? 0.5 : 1.25, duration: 0.5 }}
            >
              <AnimatePresence mode="popLayout">
                {results.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    variants={getResultItemVariants(index, isUnsupported)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={getResultItemTransition(index)}
                    className="search-result"
                    role="option"
                    aria-selected={false}
                  >
                    <div className="search-result-title">
                      <InfoIcon index={index} />
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.12 + 0.3 }}
                      >
                        {item.label}
                      </motion.span>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <motion.div
            variants={buttonVariants}
            onClick={() => setStep(2)}
            whileHover={{ scale: step === 2 ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="search-btn"
            role="button"
            tabIndex={step === 1 ? 0 : -1}
            onKeyDown={(e) => {
              if (step === 1 && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setStep(2);
              }
            }}
          >
            {step === 1 ? (
              <span className="search-text">{buttonLabel}</span>
            ) : (
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder={placeholder}
                aria-label="Search properties"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setStep(1);
                }}
              />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 2 && (
              <motion.div
                key="icon"
                className="separate-element"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={iconVariants}
                transition={{ delay: 0.1, duration: 0.85, type: 'spring', bounce: 0.15 }}
              >
                {!isLoading ? <SearchIcon isUnsupported={isUnsupported} /> : <LoadingIcon />}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {showEmpty && <p className="no-results">Nothing matches “{debounced.trim()}”.</p>}
    </div>
  );
};

export default GooeySearchBar;
