import React, { useEffect, useState } from 'react';
import { ActionSheetIOS, Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import { latestByKind, pickImage, signedUrl, uploadDocument } from '../lib/documents';
import { useI18n, type TKey } from '../lib/i18n';
import type { DocKind, DocumentRow } from '../lib/supabase';
import { useTheme } from '../lib/theme';
import { Card, H2 } from './ui';

/** Փաստաթղթերի ցանց. ամեն սալիկ ցույց է տալիս նկարը կամ «Վերբեռնել» */
export function DocumentsSection({
  kinds,
  docs,
  userId,
  vehicleId,
  onChanged,
}: {
  kinds: DocKind[];
  docs: DocumentRow[];
  userId: string;
  vehicleId?: string | null;
  onChanged: () => void;
}) {
  const { t } = useI18n();
  const latest = latestByKind(docs);
  return (
    <>
      <H2>{t('documents')}</H2>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {kinds.map((k) => (
          <DocTile
            key={k}
            kind={k}
            doc={latest[k] ?? null}
            userId={userId}
            vehicleId={vehicleId}
            onChanged={onChanged}
          />
        ))}
      </View>
    </>
  );
}

function DocTile({
  kind,
  doc,
  userId,
  vehicleId,
  onChanged,
}: {
  kind: DocKind;
  doc: DocumentRow | null;
  userId: string;
  vehicleId?: string | null;
  onChanged: () => void;
}) {
  const { t } = useI18n();
  const c = useTheme();
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    setUrl(null);
    if (doc) signedUrl(doc.path).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [doc?.path]);

  async function run(source: 'camera' | 'library') {
    const asset = await pickImage(source);
    if (!asset) return;
    setBusy(true);
    try {
      await uploadDocument({ userId, kind, asset, vehicleId, previous: doc });
      onChanged();
    } catch (e) {
      Alert.alert(t('error'), e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function choose() {
    const options = [t('takePhoto'), t('fromGallery'), t('cancel')];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 2 }, (i) => {
        if (i === 0) run('camera');
        if (i === 1) run('library');
      });
    } else {
      Alert.alert(t(`doc_${kind}` as TKey), undefined, [
        { text: options[0], onPress: () => run('camera') },
        { text: options[1], onPress: () => run('library') },
        { text: options[2], style: 'cancel' },
      ]);
    }
  }

  return (
    <Pressable onPress={busy ? undefined : choose} style={{ width: '48%' }}>
      <Card style={{ padding: 10, gap: 6 }}>
        <View
          style={{
            height: 96,
            borderRadius: 10,
            backgroundColor: c.bg,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderWidth: doc ? 0 : 1,
            borderStyle: 'dashed',
            borderColor: c.line,
          }}
        >
          {busy ? (
            <Text style={{ color: c.muted }}>…</Text>
          ) : url ? (
            <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <Text style={{ fontSize: 28, color: c.muted }}>＋</Text>
          )}
        </View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: c.ink }} numberOfLines={1}>
          {t(`doc_${kind}` as TKey)}
        </Text>
        <Text style={{ fontSize: 12, color: doc ? c.ok : c.muted }}>
          {doc ? `✓ ${t('uploaded')}` : t('notUploaded')}
        </Text>
      </Card>
    </Pressable>
  );
}
