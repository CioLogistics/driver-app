import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Field, Screen } from '../../src/components/ui';
import { isValidDate, orNull } from '../../src/lib/dates';
import { useI18n } from '../../src/lib/i18n';
import { supabase } from '../../src/lib/supabase';

export default function NewDeal() {
  const { t } = useI18n();
  const [f, setF] = useState({
    from_city: '',
    to_city: '',
    cargo: '',
    client: '',
    code: '',
    logistician_phone: '',
    fare: '',
    start_date: '',
  });
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const req = (v: string) => (tried && !v.trim() ? t('required') : null);

  async function save() {
    setTried(true);
    if (!f.from_city.trim() || !f.to_city.trim() || !isValidDate(f.start_date.trim())) return;
    setBusy(true);
    const fare = Number(f.fare.replace(/[^\d.]/g, ''));
    const { error } = await supabase.from('deals').insert({
      from_city: f.from_city.trim(),
      to_city: f.to_city.trim(),
      cargo: orNull(f.cargo),
      client: orNull(f.client),
      code: orNull(f.code.toUpperCase()),
      logistician_phone: orNull(f.logistician_phone),
      fare: f.fare.trim() && !Number.isNaN(fare) ? fare : null,
      start_date: orNull(f.start_date),
    });
    setBusy(false);
    if (error) Alert.alert(t('error'), error.message);
    else router.back();
  }

  return (
    <Screen edges={['bottom']}>
      <Field label={t('from')} value={f.from_city} onChangeText={set('from_city')} placeholder="Երևան" error={req(f.from_city)} />
      <Field label={t('to')} value={f.to_city} onChangeText={set('to_city')} placeholder="Москва" error={req(f.to_city)} />
      <Field label={t('cargo')} value={f.cargo} onChangeText={set('cargo')} />
      <Field label={t('client')} value={f.client} onChangeText={set('client')} />
      <Field label={t('dealCode')} value={f.code} onChangeText={set('code')} autoCapitalize="characters" placeholder="CL-2041" />
      <Field label={t('logistPhone')} value={f.logistician_phone} onChangeText={set('logistician_phone')} keyboardType="phone-pad" />
      <Field label={`${t('fare')}, USD`} value={f.fare} onChangeText={set('fare')} keyboardType="decimal-pad" />
      <Field
        label={t('startDate')}
        value={f.start_date}
        onChangeText={set('start_date')}
        placeholder={t('dateHint')}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        error={tried && !isValidDate(f.start_date.trim()) ? t('badDate') : null}
      />
      <Button title={t('save')} onPress={save} loading={busy} />
    </Screen>
  );
}
