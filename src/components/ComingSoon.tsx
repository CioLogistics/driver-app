import React from 'react';
import { Text, View } from 'react-native';
import { useI18n, type TKey } from '../lib/i18n';
import { useTheme } from '../lib/theme';
import { Card, H1, Muted, Screen } from './ui';

export function ComingSoon({ title, emoji }: { title: TKey; emoji: string }) {
  const { t } = useI18n();
  const c = useTheme();
  return (
    <Screen>
      <H1>{t(title)}</H1>
      <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
        <Text style={{ fontSize: 48 }}>{emoji}</Text>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: c.ink }}>{t('soon')}</Text>
          <Muted style={{ textAlign: 'center' }}>{t('soonText')}</Muted>
        </View>
      </Card>
    </Screen>
  );
}
