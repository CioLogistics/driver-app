// Supabase → Project Settings → API (կամ Data API)
// Այստեղ դրվում է ՄԻԱՅՆ «anon / publishable» բանալին. այն հրապարակային է և
// պաշտպանված է բազայի RLS կանոններով։ «service_role / secret» բանալին
// երբեք չի դրվում հավելվածում։
export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://wtiuqkhyxanzuazarhqr.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'YOUR-ANON-KEY';

export const isConfigured =
  !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-ANON');
