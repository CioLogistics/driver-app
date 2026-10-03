import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';
import { supabase, type DocKind, type DocumentRow } from './supabase';

const BUCKET = 'documents';
const WEEK = 60 * 60 * 24 * 7;

/** Ընտրել նկար տեսախցիկից կամ պատկերասրահից։ null՝ եթե չեղարկվեց */
export async function pickImage(source: 'camera' | 'library'): Promise<ImagePicker.ImagePickerAsset | null> {
  const perm =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;

  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
  const res =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(opts)
      : await ImagePicker.launchImageLibraryAsync(opts);
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0];
}

/**
 * Վերբեռնում է նկարը `<user_id>/<kind>-<ժամանակ>.jpg` ճանապարհով և
 * փոխարինում նույն տեսակի նախորդ փաստաթուղթը (եթե կար)։
 */
export async function uploadDocument(params: {
  userId: string;
  kind: DocKind;
  asset: ImagePicker.ImagePickerAsset;
  vehicleId?: string | null;
  previous?: DocumentRow | null;
}): Promise<void> {
  const { userId, kind, asset, vehicleId = null, previous } = params;
  const ext = (asset.mimeType?.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg');
  const path = `${userId}/${kind}-${Date.now()}.${ext}`;

  const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
  const up = await supabase.storage.from(BUCKET).upload(path, decode(base64), {
    contentType: asset.mimeType ?? 'image/jpeg',
    upsert: false,
  });
  if (up.error) throw up.error;

  const ins = await supabase.from('documents').insert({ kind, path, vehicle_id: vehicleId });
  if (ins.error) throw ins.error;

  if (previous) {
    await supabase.storage.from(BUCKET).remove([previous.path]);
    await supabase.from('documents').delete().eq('id', previous.id);
  }
}

/** Ժամանակավոր հղում՝ նկարը ցույց տալու կամ ուղարկելու համար */
export async function signedUrl(path: string, seconds = 3600): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, seconds);
  return data?.signedUrl ?? null;
}

/** Վերջին փաստաթուղթը ամեն տեսակից */
export function latestByKind(rows: DocumentRow[]): Partial<Record<DocKind, DocumentRow>> {
  const out: Partial<Record<DocKind, DocumentRow>> = {};
  for (const r of rows) {
    const cur = out[r.kind];
    if (!cur || cur.created_at < r.created_at) out[r.kind] = r;
  }
  return out;
}

/**
 * Բացում է WhatsApp-ը պատրաստի հաղորդագրությամբ, որտեղ կան փաստաթղթերի
 * 7-օրյա հղումները։ phone՝ միջազգային ձևաչափով, օր. +37491123456
 */
export async function shareViaWhatsApp(params: {
  docs: { label: string; path: string }[];
  intro: string;
  phone?: string | null;
}): Promise<boolean> {
  const lines: string[] = [params.intro, ''];
  for (const d of params.docs) {
    const url = await signedUrl(d.path, WEEK);
    if (url) lines.push(`• ${d.label}: ${url}`);
  }
  const text = encodeURIComponent(lines.join('\n'));
  const digits = (params.phone ?? '').replace(/[^\d]/g, '');

  const app = `whatsapp://send?text=${text}${digits ? `&phone=${digits}` : ''}`;
  const web = `https://wa.me/${digits}?text=${text}`;
  try {
    if (await Linking.canOpenURL(app)) {
      await Linking.openURL(app);
      return true;
    }
    await Linking.openURL(web);
    return true;
  } catch {
    return false;
  }
}
