import { router } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, DeadlineRow, H1, H2, Muted } from '../../src/components/ui';
import { daysUntil } from '../../src/lib/dates';
import { useProfile, useVehicle } from '../../src/lib/data';
import { useI18n } from '../../src/lib/i18n';
import { useTheme } from '../../src/lib/theme';

export default function Home() {
  const { t } = useI18n();
  const c = useTheme();
  const profile = useProfile();
  const vehicle = useVehicle();
  const v = vehicle.data;
  const p = profile.data;

  const refreshing = profile.loading || vehicle.loading;
  const reload = () => {
    profile.reload();
    vehicle.reload();
  };

  // Բոլոր ժամկետները՝ ամենամոտիկը վերևում
  const deadlines = [
    { label: t('inspection'), date: v?.inspection_expiry },
    { label: t('insurance'), date: v?.insurance_expiry },
    { label: t('tirCarnet'), date: v?.tir_carnet_expiry },
    { label: t('licenseExpiry'), date: p?.license_expiry },
    { label: t('passportExpiry'), date: p?.passport_expiry },
  ]
    .filter((d) => d.date)
    .sort((a, b) => (daysUntil(a.date) ?? 9e9) - (daysUntil(b.date) ?? 9e9));

  const firstName = p?.full_name?.split(' ')[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} />}
      >
        <H1>
          {t('hello')}
          {firstName ? `, ${firstName}` : ''} 👋
        </H1>

        <H2>{t('myVehicle')}</H2>
        {v ? (
          <Card onPress={() => router.push('/vehicle')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 40 }}>🚛</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: c.ink }}>{v.plate}</Text>
                <Muted>{[v.brand, v.model, v.year].filter(Boolean).join(' · ')}</Muted>
              </View>
              <Text style={{ color: c.muted, fontSize: 22 }}>›</Text>
            </View>
          </Card>
        ) : (
          <Card>
            <Muted>{t('noVehicle')}</Muted>
            <Button title={t('addVehicle')} onPress={() => router.push('/vehicle/edit')} />
          </Card>
        )}

        <Card onPress={() => router.push('/driver')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 32 }}>🪪</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: c.ink }}>{t('driver')}</Text>
              <Muted>{p?.full_name || t('notSet')}</Muted>
            </View>
            <Text style={{ color: c.muted, fontSize: 22 }}>›</Text>
          </View>
        </Card>

        {deadlines.length ? (
          <>
            <H2>{t('deadlines')}</H2>
            <Card style={{ gap: 14 }}>
              {deadlines.map((d) => (
                <DeadlineRow key={d.label} label={d.label} date={d.date} />
              ))}
            </Card>
          </>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  );
}
