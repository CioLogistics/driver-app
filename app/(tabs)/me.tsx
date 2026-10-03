import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card, H1, H2, Muted, Screen, Segmented } from '../../src/components/ui';
import { useAuth } from '../../src/lib/auth';
import { useI18n, type Lang } from '../../src/lib/i18n';
import { supabase } from '../../src/lib/supabase';
import { useTheme } from '../../src/lib/theme';

export default function Me() {
  const { t, lang, setLang } = useI18n();
  const { session } = useAuth();
  const c = useTheme();

  const changeLang = (l: Lang) => {
    setLang(l);
    // Պահում ենք նաև պրոֆիլում, որ ապագայում ծանուցումները գան ճիշտ լեզվով
    supabase.from('profiles').update({ lang: l }).eq('id', session?.user.id ?? '').then(() => {});
  };

  return (
    <Screen>
      <H1>{t('tabMe')}</H1>
      <Muted>{session?.user.email}</Muted>

      <Card onPress={() => router.push('/driver')}>
        <Row emoji="🪪" title={t('driver')} />
      </Card>
      <Card onPress={() => router.push('/vehicle')}>
        <Row emoji="🚛" title={t('myVehicle')} />
      </Card>

      <H2>{t('language')}</H2>
      <Segmented<Lang>
        value={lang}
        onChange={changeLang}
        options={[
          { value: 'hy', label: 'Հայերեն' },
          { value: 'ru', label: 'Русский' },
          { value: 'en', label: 'English' },
        ]}
      />

      <View style={{ height: 16 }} />
      <Button title={t('signOut')} kind="danger" onPress={() => supabase.auth.signOut()} />
      <Muted style={{ textAlign: 'center', color: c.muted }}>Cio Driver · v0.1</Muted>
    </Screen>
  );
}

function Row({ emoji, title }: { emoji: string; title: string }) {
  const c = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
      <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: c.ink }}>{title}</Text>
      <Text style={{ color: c.muted, fontSize: 22 }}>›</Text>
    </View>
  );
}
