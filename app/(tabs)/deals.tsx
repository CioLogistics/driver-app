import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, H1, Muted, Segmented } from '../../src/components/ui';
import { fmt } from '../../src/lib/dates';
import { useDeals } from '../../src/lib/data';
import { useI18n } from '../../src/lib/i18n';
import type { Deal } from '../../src/lib/supabase';
import { useTheme } from '../../src/lib/theme';

export default function Deals() {
  const { t } = useI18n();
  const c = useTheme();
  const [tab, setTab] = useState<Deal['status']>('active');
  const { data, loading, reload } = useDeals();
  const list = data.filter((d) => d.status === tab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }} edges={['top']}>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <H1>{t('tabDeals')}</H1>
          <Pressable
            onPress={() => router.push('/deals/new')}
            accessibilityLabel={t('newDeal')}
            style={{
              backgroundColor: c.accent,
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 26, lineHeight: 28 }}>+</Text>
          </Pressable>
        </View>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'active', label: `${t('active')} · ${data.filter((d) => d.status === 'active').length}` },
            { value: 'done', label: `${t('done')} · ${data.filter((d) => d.status === 'done').length}` },
          ]}
        />
      </View>
      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} />}
        ListEmptyComponent={loading ? null : <Muted style={{ textAlign: 'center', marginTop: 32 }}>{t('noDeals')}</Muted>}
        renderItem={({ item: d }) => (
          <Card onPress={() => router.push(`/deals/${d.id}`)}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: c.ink }}>
              {d.from_city} → {d.to_city}
            </Text>
            <Muted>
              {[d.code, d.cargo, d.start_date ? fmt(d.start_date) : null].filter(Boolean).join(' · ')}
            </Muted>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
