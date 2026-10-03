const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Դատարկ արժեքը թույլատրելի է, մնացածը՝ միայն ՏՏՏՏ-ԱԱ-ՕՕ */
export function isValidDate(v: string): boolean {
  if (!v) return true;
  if (!ISO.test(v)) return false;
  const d = new Date(v + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

/** Քանի օր է մնացել մինչև ամսաթիվը (բացասական՝ եթե անցել է) */
export function daysUntil(v: string | null | undefined): number | null {
  if (!v || !isValidDate(v)) return null;
  const today = new Date();
  const t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const d = Date.parse(v + 'T00:00:00Z');
  return Math.round((d - t) / 86_400_000);
}

export type Level = 'ok' | 'warn' | 'bad' | 'none';

/** ≤ 0 օր՝ կարմիր, ≤ 30 օր՝ նարնջագույն */
export function level(days: number | null): Level {
  if (days === null) return 'none';
  if (days <= 0) return 'bad';
  if (days <= 30) return 'warn';
  return 'ok';
}

/** «2026-11-05» → «05.11.2026» */
export function fmt(v: string | null | undefined): string {
  if (!v || !isValidDate(v)) return '';
  const [y, m, d] = v.split('-');
  return `${d}.${m}.${y}`;
}

/** Դատարկ տողը դառնում է null՝ բազայի համար */
export function orNull(v: string): string | null {
  const s = v.trim();
  return s ? s : null;
}
