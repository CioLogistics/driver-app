import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Թարմացնել մուտքի նիշը միայն երբ հավելվածը բաց է
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  license_no: string | null;
  license_expiry: string | null;
  passport_expiry: string | null;
  lang: 'hy' | 'ru' | 'en';
};

export type Vehicle = {
  id: string;
  plate: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  trailer_plate: string | null;
  insurance_expiry: string | null;
  inspection_expiry: string | null;
  tir_carnet_no: string | null;
  tir_carnet_expiry: string | null;
};

export type DocKind =
  | 'passport'
  | 'license'
  | 'tech_front'
  | 'tech_back'
  | 'tir'
  | 'cmr'
  | 'insurance'
  | 'other';

export type DocumentRow = {
  id: string;
  vehicle_id: string | null;
  kind: DocKind;
  path: string;
  created_at: string;
};

export type Deal = {
  id: string;
  code: string | null;
  from_city: string;
  to_city: string;
  cargo: string | null;
  client: string | null;
  logistician_phone: string | null;
  fare: number | null;
  currency: string | null;
  start_date: string | null;
  status: 'active' | 'done';
  done_at: string | null;
  created_at: string;
};
