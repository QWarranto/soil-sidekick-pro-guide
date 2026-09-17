import { isDemoMode } from '@/lib/demoMode';

/**
 * Persistent "Demo data" watermark. Renders a sticky banner plus a tiled
 * diagonal overlay across the whole viewport so any screenshot crop still
 * carries the marking — a demo render can never be mistaken for a real account.
 */
export const DemoDataWatermark = () => {
  if (!isDemoMode()) return null;

  const stripe =
    'repeating-linear-gradient(-45deg, transparent 0 140px, transparent 140px 141px)';

  return (
    <>
      <div className="sticky top-0 z-50 bg-destructive text-destructive-foreground">
        <div className="px-4 py-2 text-center text-sm font-semibold tracking-wide">
          DEMO DATA — fixture dashboard for testing and exhibits. Not a customer account.
        </div>
      </div>

      {/* Tiled watermark: pointer-events-none so it never blocks interaction */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden select-none"
        style={{ backgroundImage: stripe }}
      >
        <div
          className="absolute inset-[-50%] flex flex-wrap content-start gap-x-24 gap-y-28 opacity-[0.12] rotate-[-30deg]"
        >
          {Array.from({ length: 160 }).map((_, i) => (
            <span
              key={i}
              className="text-2xl font-black uppercase tracking-widest text-destructive whitespace-nowrap"
            >
              Demo data
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

/** Inline per-panel marker, for headers inside a demo render. */
export const DemoDataBadge = () => {
  if (!isDemoMode()) return null;
  return (
    <span className="ml-2 rounded border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive">
      Demo data
    </span>
  );
};
