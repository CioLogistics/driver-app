import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Field, H2, Loading, Screen } from '../../src/components/ui';
import { isValidDate, orNull } from '../../src/lib/dates';
import { useVehicle } from '../../src/lib/data';
import { useI18n } from '../../src/lib/i18n';
import { supabase } from '../../src/lib/supabase';

type Form = {
  plate: string;
  brand: string;
  model: string;
  year: string;
  trailer_plate: string;
  inspection_expiry: string;
  insurance_expiry: string;
  tir_carnet_no: string;
  tir_carnet_expiry: string;
};

const EMPTY: Form = {
  plate: '',
  brand: '',
  model: '',
  year: '',
  trailer_plate: '',
  inspection_expiry: '',
  insurance_expiry: '',
  tir_carnet_no: '',
  tir_carnet_expiry: '',
};

const DATE_FIELDS = ['inspection_expiry', 'insurance_expiry', 'tir_carnet_expiry'] as const;

export default function VehicleEdit() {
  const { t } = useI18n();
  const { data: v, loading } = useVehicle();
  const [f, setF] = useState<Form>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!v) return;
    setF({
      plate: v.plate,
      brand: v.brand ?? '',
      model: v.model ?? '',
      year: v.year ? String(v.year) : '',
      trailer_plate: v.trailer_plate ?? '',
      inspection_expiry: v.inspection_expiry ?? '',
      insurance_expiry: v.insurance_expiry ?? '',
      tir_carnet_no: v.tir_carnet_no ?? '',
      tir_carnet_expiry: v.tir_carnet_expiry ?? '',
    });
  }, [v]);

  const set = (k: keyof Form) => (val: string) => setF((p) => ({ ...p, [k]: val }));
  const dateErr = (k: (typeof DATE_FIELDS)[number]) => (tried && !isValidDate(f[k].trim()) ? t('badDate') : null);
  const plateErr = tried && !f.plate.trim() ? t('required') : null;

  async function save() {
    setTried(true);
    if (!f.plate.trim() || DATE_FIELDS.some((k) => !isValidDate(f[k].trim()))) return;
    setBusy(true);
    const row = {
      plate: f.plate.trim().toUpperCase(),
      brand: orNull(f.brand),
      model: orNull(f.model),
      year: f.year.trim() ? Number(f.year) : null,
      trailer_plate: orNull(f.trailer_plate.toUpperCase()),
      inspection_expiry: orNull(f.inspection_expiry),
      insurance_expiry: orNull(f.insurance_expiry),
      tir_carnet_no: orNull(f.tir_carnet_no),
      tir_carnet_expiry: orNull(f.tir_carnet_expiry),
    };
    const { error } = v
      ? await supabase.from('vehicles').update(row).eq('id', v.id)
      : await supabase.from('vehicles').insert(row);
    setBusy(false);
    if (error) Alert.alert(t('error'), error.message);
    else router.back();
  }

  if (loading) return <Loading />;

  const dateProps = { placeholder: t('dateHint'), keyboardType: 'numbers-and-punctuation' as const, maxLength: 10 };

  return (
    <Screen edges={['bottom']}>
      <Field label={t('plate')} value={f.plate} onChangeText={set('plate')} autoCapitalize="characters" placeholder="35 LL 350" error={plateErr} />
      <Field label={t('brand')} value={f.brand} onChangeText={set('brand')} placeholder="Volvo" />
      <Field label={t('model')} value={f.model} onChangeText={set('model')} placeholder="FH 500" />
      <Field label={t('year')} value={f.year} onChangeText={(x) => set('year')(x.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" placeholder="2019" />
      <Field label={t('trailer')} value={f.trailer_plate} onChangeText={set('trailer_plate')} autoCapitalize="characters" />

      <H2>{t('deadlines')}</H2>
      <Field label={t('inspection')} value={f.inspection_expiry} onChangeText={set('inspection_expiry')} error={dateErr('inspection_expiry')} {...dateProps} />
      <Field label={t('insurance')} value={f.insurance_expiry} onChangeText={set('insurance_expiry')} error={dateErr('insurance_expiry')} {...dateProps} />
      <Field label={t('tirNo')} value={f.tir_carnet_no} onChangeText={set('tir_carnet_no')} autoCapitalize="characters" />
      <Field label={`${t('tirCarnet')} · ${t('validUntil')}`} value={f.tir_carnet_expiry} onChangeText={set('tir_carnet_expiry')} error={dateErr('tir_carnet_expiry')} {...dateProps} />

      <Button title={t('save')} onPress={save} loading={busy} />
    </Screen>
  );
}
