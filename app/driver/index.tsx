import { router, Stack } from 'expo-router';
import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { DocumentsSection } from '../../src/components/DocumentsSection';
import { SendDocsButton } from '../../src/components/SendDocsButton';
import { Card, DeadlineRow, H2, Loading, Muted, Screen } from '../../src/components/ui';
import { useUserId } from '../../src/lib/auth';
import { useDocuments, useProfile } from '../../src/lib/data';
import { useI18n } from '../../src/lib/i18n';
import type { DocKind } from '../../src/lib/supabase';
import { useTheme } from '../../src/lib/theme';

const DRIVER_DOCS: DocKind[] = ['passport', 'license'];

export default function DriverScreen() {
  const { t } = useI18n();
  const c = useTheme();
  const userId = useUserId();
  const profile = useProfile();
  const docs = useDocuments();
  const p = profile.data;

  if (profile.loading) return <Loading />;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.push('/driver/edit')} hitSlop={12}>
              <Text style={{ color: c.accent, fontSize: 16, fontWeight: '600' }}>{t('edit')}</Text>
            </Pressable>
          ),
        }}
      />
      <Screen edges={['bottom']}>
        <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ fontSize: 56 }}>🧑‍✈️</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: c.ink }}>{p?.full_name || t('notSet')}</Text>
          {p?.phone ? (
            <Pressable onPress={() => Linking.openURL(`tel:${p.phone}`)}>
              <Muted>{p.phone}</Muted>
            </Pressable>
          ) : null}
          {p?.license_no ? (
            <Muted>
              {t('licenseNo')} {p.license_no}
            </Muted>
          ) : null}
        </Card>

        <H2>{t('deadlines')}</H2>
        <Card style={{ gap: 14 }}>
          <DeadlineRow label={t('licenseExpiry')} date={p?.license_expiry} />
          <DeadlineRow label={t('passportExpiry')} date={p?.passport_expiry} />
        </Card>

        <DocumentsSection kinds={DRIVER_DOCS} docs={docs.data} userId={userId} onChanged={docs.reload} />
        <View style={{ height: 4 }} />
        <SendDocsButton kinds={DRIVER_DOCS} docs={docs.data} />
      </Screen>
    </>
  );
}
