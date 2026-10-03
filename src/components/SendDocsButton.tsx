import React, { useState } from 'react';
import { Alert } from 'react-native';
import { latestByKind, shareViaWhatsApp } from '../lib/documents';
import { useI18n, type TKey } from '../lib/i18n';
import type { DocKind, DocumentRow } from '../lib/supabase';
import { Button } from './ui';

/** «Ուղարկել լոգիստին WhatsApp-ով»՝ ընտրված տեսակների վերջին փաստաթղթերով */
export function SendDocsButton({
  kinds,
  docs,
  phone,
}: {
  kinds: DocKind[];
  docs: DocumentRow[];
  phone?: string | null;
}) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const latest = latestByKind(docs);
  const items = kinds
    .map((k) => latest[k])
    .filter((d): d is DocumentRow => !!d)
    .map((d) => ({ label: t(`doc_${d.kind}` as TKey), path: d.path }));

  async function send() {
    if (!items.length) {
      Alert.alert(t('noDocs'));
      return;
    }
    setBusy(true);
    const ok = await shareViaWhatsApp({ docs: items, intro: t('waText'), phone });
    setBusy(false);
    if (!ok) Alert.alert(t('error'), t('noWhatsapp'));
  }

  return <Button title={t('sendToLogist')} kind="whatsapp" onPress={send} loading={busy} />;
}
