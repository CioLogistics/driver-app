import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Field, H2, Loading, Screen } from '../../src/components/ui';
import { useUserId } from '../../src/lib/auth';
import { isValidDate, orNull } from '../../src/lib/dates';
import { useProfile } from '../../src/lib/data';
import { useI18n } from '../../src/lib/i18n';
import { supabase } from '../../src/lib/supabase';

type Form = {
  full_name: string;
  phone: string;
  whatsapp: string;
  license_no: string;
  license_expiry: string;
  passport_expiry: string;
};

export default function DriverEdit() {
  const { t } = useI18n();
  const userId = useUserId();
  const { data: p, loading } = useProfile();
  const [f, setF] = useState<Form>({
    full_name: '',
    phone: '',
    whatsapp: '',
    license_no: '',
    license_expiry: '',
    passport_expiry: '',
  });
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!p) return;
    setF({
      full_name: p.full_name ?? '',
      phone: p.phone ?? '',
      whatsapp: p.whatsapp ?? '',
      license_no: p.license_no ?? '',
      license_expiry: p.license_expiry ?? '',
      passport_expiry: p.passport_expiry ?? '',
    });
  }, [p]);

  const set = (k: keyof Form) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const dateErr = (k: 'license_expiry' | 'passport_expiry') =>
    tried && !isValidDate(f[k].trim()) ? t('badDate') : null;

  async function save() {
    setTried(true);
    if (!isValidDate(f.license_expiry.trim()) || !isValidDate(f.passport_expiry.trim())) return;
    setBusy(true);
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: orNull(f.full_name),
      phone: orNull(f.phone),
      whatsapp: orNull(f.whatsapp),
      license_no: orNull(f.license_no.toUpperCase()),
      license_expiry: orNull(f.license_expiry),
      passport_expiry: orNull(f.passport_expiry),
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) Alert.alert(t('error'), error.message);
    else router.back();
  }

  if (loading) return <Loading />;

  const dateProps = { placeholder: t('dateHint'), keyboardType: 'numbers-and-punctuation' as const, maxLength: 10 };

  return (
    <Screen edges={['bottom']}>
      <Field label={t('fullName')} value={f.full_name} onChangeText={set('full_name')} autoComplete="name" />
      <Field label={t('phone')} value={f.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholder="+374 91 123456" />
      <Field label={t('whatsapp')} value={f.whatsapp} onChangeText={set('whatsapp')} keyboardType="phone-pad" placeholder="+374 91 123456" />
      <Field label={t('licenseNo')} value={f.license_no} onChangeText={set('license_no')} autoCapitalize="characters" />

      <H2>{t('deadlines')}</H2>
      <Field label={t('licenseExpiry')} value={f.license_expiry} onChangeText={set('license_expiry')} error={dateErr('license_expiry')} {...dateProps} />
      <Field label={t('passportExpiry')} value={f.passport_expiry} onChangeText={set('passport_expiry')} error={dateErr('passport_expiry')} {...dateProps} />

      <Button title={t('save')} onPress={save} loading={busy} />
    </Screen>
  );
}
