// Supabase → Project Settings → API (կամ Data API)
// Այստեղ դրվում է ՄԻԱՅՆ «anon / publishable» բանալին. այն հրապարակային է և
// պաշտպանված է բազայի RLS կանոններով։ «service_role / secret» բանալին
// երբեք չի դրվում հավելվածում։
export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://wtiuqkhyxanzuazarhqr.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aXVxa2h5eGFuenVhemFyaHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNTM4NzMsImV4cCI6MjEwNjYyOTg3M30.mr7SzbdXTTiqeJUhAhpPRFusVAq1uz5YRsL5dbGpl2A';

export const isConfigured =
  !SUPABASE_URL.includes('YOUR-PROJECT') && !SUPABASE_ANON_KEY.includes('YOUR-ANON');
