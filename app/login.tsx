import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Button, Field, H1, Muted, Screen } from '../src/components/ui';
import { isConfigured } from '../src/config';
import { useI18n, type Lang } from '../src/lib/i18n';
import { supabase } from '../src/lib/supabase';
import { useTheme } from '../src/lib/theme';
import { Segmented } from '../src/components/ui';

export default function Login() {
  const { t, lang, setLang } = useI18n();
  const c = useTheme();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const cleanEmail = email.trim().toLowerCase();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

  async function send() {
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setStep('code');
  }

  async function verify() {
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) setErr(error.message);
    // Հաջողության դեպքում AuthProvider-ը ինքն է տեղափոխում գլխավոր էջ
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges={['top', 'bottom']}>
        <View style={{ height: 40 }} />
        <Text style={{ fontSize: 44 }}>🚛</Text>
        <H1>{t('appName')}</H1>
        <Segmented<Lang>
          value={lang}
          onChange={setLang}
          options={[
            { value: 'hy', label: 'Հայ' },
            { value: 'ru', label: 'Рус' },
            { value: 'en', label: 'Eng' },
          ]}
        />

        {!isConfigured ? (
          <View style={{ backgroundColor: c.warnSoft, padding: 12, borderRadius: 12 }}>
            <Text style={{ color: c.warn, fontWeight: '600' }}>{t('notConfigured')}</Text>
          </View>
        ) : null}

        {step === 'email' ? (
          <>
            <Muted>{t('loginSub')}</Muted>
            <Field
              label={t('email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              placeholder="name@mail.am"
              returnKeyType="send"
              onSubmitEditing={() => emailOk && send()}
            />
            <Button title={t('sendCode')} onPress={send} loading={busy} disabled={!emailOk || !isConfigured} />
          </>
        ) : (
          <>
            <Muted>
              {t('codeSent')}
              {cleanEmail}
            </Muted>
            <Field
              label={t('code')}
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 8))}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              placeholder="123456"
              maxLength={8}
            />
            <Button title={t('verify')} onPress={verify} loading={busy} disabled={code.length < 6} />
            <Button
              title={t('changeEmail')}
              kind="secondary"
              onPress={() => {
                setStep('email');
                setCode('');
              }}
            />
          </>
        )}
        {err ? <Text style={{ color: c.bad }}>{err}</Text> : null}
      </Screen>
    </KeyboardAvoidingView>
  );
}
