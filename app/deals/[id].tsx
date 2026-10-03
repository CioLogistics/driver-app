import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { Button, Card, Loading, Muted, Screen } from '../../src/components/ui';
import { fmt } from '../../src/lib/dates';
import { useI18n } from '../../src/lib/i18n';
import { supabase, type Deal } from '../../src/lib/supabase';
import { useTheme } from '../../src/lib/theme';

export default function DealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useI18n();
  const c = useTheme();
  const [d, setD] = useState<Deal | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from('deals')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => setD(data as Deal | null));
  }, [id]);

  if (!d) return <Loading />;

  async function toggle() {
    if (!d) return;
    setBusy(true);
    const done = d.status === 'active';
    const { data, error } = await supabase
      .from('deals')
      .update({ status: done ? 'done' : 'active', done_at: done ? new Date().toISOString() : null })
      .eq('id', d.id)
      .select()
      .single();
    setBusy(false);
    if (error) Alert.alert(t('error'), error.message);
    else setD(data as Deal);
  }

  function remove() {
    Alert.alert(t('delete'), `${d?.from_city} → ${d?.to_city}`, [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await supabase.from('deals').delete().eq('id', id);
          router.back();
        },
      },
    ]);
  }

  const rows: [string, string | null][] = [
    [t('dealCode'), d.code],
    [t('cargo'), d.cargo],
    [t('client'), d.client],
    [t('startDate'), d.start_date ? fmt(d.start_date) : null],
    [t('fare'), d.fare != null ? `${d.fare} ${d.currency ?? ''}` : null],
    [t('logistPhone'), d.logistician_phone],
  ];

  return (
    <Screen edges={['bottom']}>
      <Card>
        <Text style={{ fontSize: 22, fontWeight: '800', color: c.ink }}>
          {d.from_city} → {d.to_city}
        </Text>
        <Muted>{d.status === 'active' ? t('active') : t('done')}</Muted>
      </Card>
      <Card style={{ gap: 12 }}>
        {rows
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <Muted>{k}</Muted>
              <Text style={{ color: c.ink, fontWeight: '600', flexShrink: 1, textAlign: 'right' }}>{v}</Text>
            </View>
          ))}
      </Card>
      {d.logistician_phone ? (
        <Button title={t('callLogist')} kind="secondary" onPress={() => Linking.openURL(`tel:${d.logistician_phone}`)} />
      ) : null}
      <Button title={d.status === 'active' ? t('markDone') : t('reopen')} onPress={toggle} loading={busy} />
      <Button title={t('delete')} kind="danger" onPress={remove} />
    </Screen>
  );
}
