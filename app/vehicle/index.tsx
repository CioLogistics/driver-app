import { router, Stack } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { DocumentsSection } from '../../src/components/DocumentsSection';
import { SendDocsButton } from '../../src/components/SendDocsButton';
import { Button, Card, DeadlineRow, H2, Loading, Muted, Screen } from '../../src/components/ui';
import { useUserId } from '../../src/lib/auth';
import { useDocuments, useVehicle } from '../../src/lib/data';
import { useI18n } from '../../src/lib/i18n';
import type { DocKind } from '../../src/lib/supabase';
import { useTheme } from '../../src/lib/theme';

const VEHICLE_DOCS: DocKind[] = ['tech_front', 'tech_back', 'tir', 'insurance', 'cmr', 'other'];

export default function VehicleScreen() {
  const { t } = useI18n();
  const c = useTheme();
  const userId = useUserId();
  const vehicle = useVehicle();
  const docs = useDocuments();
  const v = vehicle.data;

  if (vehicle.loading) return <Loading />;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () =>
            v ? (
              <Pressable onPress={() => router.push('/vehicle/edit')} hitSlop={12}>
                <Text style={{ color: c.accent, fontSize: 16, fontWeight: '600' }}>{t('edit')}</Text>
              </Pressable>
            ) : null,
        }}
      />
      <Screen edges={['bottom']}>
        {!v ? (
          <Card>
            <Muted>{t('noVehicle')}</Muted>
            <Button title={t('addVehicle')} onPress={() => router.push('/vehicle/edit')} />
          </Card>
        ) : (
          <>
            <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 56 }}>🚛</Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: c.ink }}>{v.plate}</Text>
              <Muted>{[v.brand, v.model, v.year].filter(Boolean).join(' · ')}</Muted>
              {v.trailer_plate ? (
                <Muted>
                  {t('trailer')}: {v.trailer_plate}
                </Muted>
              ) : null}
            </Card>

            <H2>{t('deadlines')}</H2>
            <Card style={{ gap: 14 }}>
              <DeadlineRow label={t('inspection')} date={v.inspection_expiry} />
              <DeadlineRow label={t('insurance')} date={v.insurance_expiry} />
              <DeadlineRow
                label={v.tir_carnet_no ? `${t('tirCarnet')} · ${v.tir_carnet_no}` : t('tirCarnet')}
                date={v.tir_carnet_expiry}
              />
            </Card>

            <DocumentsSection
              kinds={VEHICLE_DOCS}
              docs={docs.data}
              userId={userId}
              vehicleId={v.id}
              onChanged={docs.reload}
            />
            <View style={{ height: 4 }} />
            <SendDocsButton kinds={VEHICLE_DOCS} docs={docs.data} />
          </>
        )}
      </Screen>
    </>
  );
}
