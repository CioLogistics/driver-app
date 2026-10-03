import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { supabase, type Deal, type DocumentRow, type Profile, type Vehicle } from './supabase';

/** Ընդհանուր օգնական. տվյալները թարմացվում են ամեն անգամ, երբ էկրանը բացվում է */
function useFocusQuery<T>(load: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      setData(await load());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { data, loading, error, reload };
}

export function useProfile() {
  return useFocusQuery<Profile | null>(async () => {
    const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
    if (error) throw error;
    return data as Profile | null;
  }, null);
}

/** Փուլ 1-ում վարորդն ունի մեկ հիմնական մեքենա՝ առաջին ավելացվածը */
export function useVehicle() {
  return useFocusQuery<Vehicle | null>(async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data as Vehicle | null;
  }, null);
}

export function useDocuments() {
  return useFocusQuery<DocumentRow[]>(async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('id, vehicle_id, kind, path, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as DocumentRow[];
  }, []);
}

export function useDeals(status?: Deal['status']) {
  return useFocusQuery<Deal[]>(async () => {
    let q = supabase.from('deals').select('*').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Deal[];
  }, []);
}
